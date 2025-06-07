"use server";

import { Outcome, Bet } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { BetStateType, OddsType } from "@/app/db/codeTables";

export type CreateBetState = {
  errors?: {
    name?: string[];
    description?: string[];
    betDeadline?: string[];
    outcomeDeadline?: string[];
    outcomeTypeCode?: string[];
    oddsTypeCode?: string[];
    password?: string[];
    creatorId?: string[];
    outcomes?: string[];
    outcomesOdds?: string[];
  };
  message?: string;
  success: boolean;
  data?: Bet;
};

export type OutcomeInputForm = {
  id: number;
  name: string;
  odds: string;
  probability: string;
};

type OutcomeOdds = {
  name: Outcome["name"];
  odds: number;
};

const HOURS_3_MS = 3 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const PASSWORD_REGEX =
  /^(?:$|(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?]).*)$/;
const createBetSchema = z
  .object({
    name: z
      .string({ required_error: "Bet name is required" })
      .min(4, { message: "Please enter a bet name longer than 4 characters" })
      .max(150, {
        message: "Please enter a bet name shorter than 150 characters",
      }),
    description: z
      .string()
      .max(200, {
        message: "Please enter a bet description shorter than 200 characters",
      })
      .optional(),
    betDeadline: z.coerce
      .date({ required_error: "Bet deadline is required" })
      .refine((date) => date.getTime() >= Date.now() + HOURS_3_MS, {
        message: "Bet deadline must be at least 3 hours from now",
      }),
    outcomeDeadline: z.coerce.date({
      required_error: "An outcome deadline is required",
    }),
    outcomeTypeCode: z.coerce.number(),
    oddsTypeCode: z.coerce.number(),
    password: z
      .string()
      .optional()
      .refine(
        (val) => {
          // if it’s empty or not provided → okay
          if (!val) return true;

          // otherwise enforce length + regex
          return (
            val.length >= 8 && val.length <= 16 && PASSWORD_REGEX.test(val)
          );
        },
        {
          message:
            "Please choose a password that meets the rules above or click “Generate a strong one”.",
        }
      ),
    creatorId: z.coerce.number({
      required_error: "We need to know who is trying to create the bet.",
    }),
  })
  .superRefine((data, ctx) => {
    // check outcomeDeadline ≥ betDeadline + 2 days
    if (
      data.outcomeDeadline.getTime() <
      data.betDeadline.getTime() + ONE_DAY_MS
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["outcomeDeadline"],
        message:
          "Outcome deadline must be at least 1 day after the bet deadline",
      });
    }
  });

const OutcomeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character" })
    .max(100, { message: "Name must be 100 characters or less" }),
  odds: z.string(),
});

const OutcomesListSchema = z
  .array(OutcomeSchema)
  .min(2, { message: "Add at least 2 possible outcomes for your bet" })
  .max(10, { message: "No more than 10 outcomes allowed" })
  .refine(
    (list) => {
      const names = list.map((o) => o.name);
      return new Set(names).size === names.length;
    },
    {
      message: "All outcome names must be unique",
      path: [],
    }
  );

function validateOutcomes(outcomes: OutcomeInputForm[]): string[] {
  const result = OutcomesListSchema.safeParse(outcomes);
  if (result.success) {
    return [];
  }
  return result.error.issues.map((issue) => issue.message);
}

function validateOutcomesOdds(outcomes: OutcomeInputForm[]): OutcomeOdds[] {
  // 2) Parse name & odds, filter out invalid values
  const data: OutcomeOdds[] = outcomes.flatMap((outcome) => {
    const rawOdds = parseFloat(String(outcome.odds));
    if (!isNaN(rawOdds) && rawOdds > 0) {
      return [{ name: outcome.name, odds: rawOdds }];
    }
    return [];
  });

  if (data.length === 0 || data.length !== outcomes.length) {
    return [];
  }

  // 3) Compute “raw” probabilities from the odds
  const rawProbs = data.map((d) => 1 / d.odds);
  const totalRaw = rawProbs.reduce((sum, p) => sum + p, 0);
  if (totalRaw <= 0) return [];

  // 4) Comput leftover
  const normalized = rawProbs.map((p) => (p / totalRaw) * 100);
  const floored = normalized.map((p) => Math.floor(p));
  const sumFloored = floored.reduce((sum, p) => sum + p, 0);
  const leftover = 100 - sumFloored;

  // 4) Normalize and recompute odds
  return data.map((outcome, i) => {
    const finalProb =
      i === data.length - 1 ? floored[i] + leftover : floored[i];
    const finalOdds = 1 / (finalProb / 100);
    return {
      name: outcome.name,
      odds: Number(finalOdds.toFixed(2)),
    };
  });
}

export async function createBetFromForm(
  prevState: CreateBetState,
  formData: FormData,
  outcomes: OutcomeInputForm[],
  isPrivate: boolean
): Promise<CreateBetState> {
  const session = await auth();
  // Validate session
  if (!session?.player) {
    return {
      success: false,
      message:
        "Seems like you're not authorized. Please, try reloading the page.",
    };
  }

  // Validate bet fields
  const validatedFields = createBetSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    betDeadline: formData.get("betDeadline"),
    outcomeDeadline: formData.get("outcomeDeadline"),
    outcomeTypeCode: formData.get("outcomeTypeCode"),
    oddsTypeCode: formData.get("oddsTypeCode"),
    creatorId: session.player.id,
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const isPasswordOk = isPrivate
    ? validatedFields.data.password && validatedFields.data.password.length > 1
    : true;
  if (!isPasswordOk) {
    return {
      success: false,
      errors: { password: ["Please, choose a password"] },
    };
  }

  // Validate outcomes
  const outcomesErros = validateOutcomes(outcomes);
  if (outcomesErros.length > 0) {
    return { success: false, errors: { outcomes: outcomesErros } };
  }

  // Validate outcomes odds
  let validatedOdds;
  if (validatedFields.data.oddsTypeCode === OddsType.AUTO) {
    validatedOdds = outcomes.map((outcome) => {
      return { name: outcome.name, odds: null };
    });
  } else {
    validatedOdds = validateOutcomesOdds(outcomes);
  }

  if (validatedOdds.length === 0) {
    return {
      success: false,
      errors: {
        outcomesOdds: [
          "Please, make sure to insert valid odds / probabilities",
        ],
      },
    };
  }

  const validatedData = validatedFields.data;

  try {
    const bet = await prisma.bet.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        betDeadline: validatedData.betDeadline,
        outcomeDeadline: validatedData.outcomeDeadline,
        password: isPrivate ? validatedData.password : undefined,
        creator: { connect: { id: validatedData.creatorId } },
        outcomeType: { connect: { code: validatedData.outcomeTypeCode } },
        oddsType: { connect: { code: validatedData.oddsTypeCode } },
        betState: { connect: { code: BetStateType.OPEN } },
        outcomes: {
          create: validatedOdds.map((outcome) => ({
            name: outcome.name,
            odds: outcome.odds,
          })),
        },
      },
    });
    return {
      success: true,
      data: bet,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong, please try again...",
    };
  }
}
