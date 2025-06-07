"use server";

import { Outcome, Vote } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import {
  doesOutcomeBelogToBet,
  canHostDecideWinningOut,
  canCrowdVote,
} from "@/app/db/entities/bet/bet";
import { hasPlayerAlreadyBetted } from "@/app/db/entities/betParticipation/betParticipation";
import { hasPlayerAlreadyVoted } from "@/app/db/entities/vote/vote";

export type WinningOutcomeHostState = {
  errors?: {
    winningOutcomeId?: string[];
  };
  message?: string;
  success: boolean;
  data?: Outcome;
};

export type CrowdVoteState = {
  errors?: {
    outcomeId?: string[];
  };
  message?: string;
  success: boolean;
  data?: Vote & { outcome: Outcome };
};

const winningOutcomeHostSchema = z.object({
  winningOutcomeId: z.coerce
    .number({
      required_error: "Choose an outcome",
    })
    .min(1, "Choose an outcome"), // because 0 means the player didn't choose an outcome
});

const crowdVoteSchema = z.object({
  outcomeId: z.coerce
    .number({
      required_error: "Choose an outcome",
    })
    .min(1, "Choose an outcome"), // because 0 means the player didn't choose an outcome
});

export async function winningOutcomeHostFromForm(
  prevState: WinningOutcomeHostState,
  formData: FormData,
  betId: number
): Promise<WinningOutcomeHostState> {
  // Session
  const session = await auth();
  const player = session?.player;
  const playerId = session?.player?.id;
  if (!player || !playerId) {
    return { success: false, message: "Unauthorized" };
  }

  // FormData
  const validatedFields = winningOutcomeHostSchema.safeParse({
    winningOutcomeId: formData.get("winningOutcomeId"),
  });
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const validatedData = validatedFields.data;

  // Check if player is creator
  if (!(await canHostDecideWinningOut(betId, playerId))) {
    return {
      success: false,
      message: "You can't set the winning outcome all by yourself",
    };
  }

  // Check if outcome belongs to bet
  if (!(await doesOutcomeBelogToBet(validatedData.winningOutcomeId, betId))) {
    return {
      success: false,
      errors: { winningOutcomeId: ["Outcome doesn't belong to bet"] },
    };
  }

  try {
    const bet = await prisma.bet.update({
      where: { id: betId },
      data: { winningOutcomeId: validatedData.winningOutcomeId },
      include: {
        winningOutcome: true,
      },
    });

    if (bet.winningOutcome) {
      return { success: true, data: bet.winningOutcome };
    }

    return {
      success: false,
      message: "We couldn't set the winning outcome, please try again...",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong, please try again...",
    };
  }
}

export async function crowdVoteFromForm(
  prevState: CrowdVoteState,
  formData: FormData,
  betId: number
): Promise<CrowdVoteState> {
  // Session
  const session = await auth();
  const player = session?.player;
  const playerId = session?.player?.id;
  if (!player || !playerId) {
    return { success: false, message: "Unauthorized" };
  }

  // FormData
  const validatedFields = crowdVoteSchema.safeParse({
    outcomeId: formData.get("outcomeId"),
  });
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const validatedData = validatedFields.data;

  if (!(await canCrowdVote(betId))) {
    return {
      success: false,
      message: "This bet doesn't accept votes",
    };
  }

  // Only players who partecipated to the bet can vote
  if (!(await hasPlayerAlreadyBetted(betId, playerId))) {
    return {
      success: false,
      message: "You can't vote for the winning outcome since you didn't bet",
    };
  }

  if (await hasPlayerAlreadyVoted(betId, playerId)) {
    return {
      success: false,
      message: "You have already voted for this bet",
    };
  }

  if (!(await doesOutcomeBelogToBet(validatedData.outcomeId, betId))) {
    return {
      success: false,
      errors: { outcomeId: ["That's not a valid outcome"] },
    };
  }

  try {
    const vote = await prisma.vote.create({
      data: {
        playerId: playerId,
        betId: betId,
        outcomeId: validatedData.outcomeId,
      },
      include: {
        outcome: true,
      },
    });

    if (vote) {
      return { success: true, data: vote };
    }
    return {
      success: false,
      message: "Something went wrong, please try again...",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong, please try again...",
    };
  }
}
