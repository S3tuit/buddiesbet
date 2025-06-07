"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { CurrencyType, ResultType } from "../../codeTables";
import { auth } from "@/auth";
import { canPlayerBet, doesOutcomeBelogToBet } from "../bet/bet";
import { hasPlayerAlreadyBetted } from "./betParticipation";

export type CreateBetParticipationState = {
  errors?: {
    outcomeId?: string[];
    crystalBallBet?: string[];
  };
  message?: string;
  success: boolean;
};

const createBetParticipationSchema = z.object({
  outcomeId: z.coerce.number({ required_error: "Choose an outcome" }),
  crystalBallBet: z.coerce
    .number({ required_error: "Enter how much you want to bet" })
    .min(1, { message: "You must bet at least 1 Crystal Ball" }),
});

export async function createBetParticipationFromForm(
  prevState: CreateBetParticipationState,
  formData: FormData,
  betId: number,
  password: string = ""
): Promise<CreateBetParticipationState> {
  const session = await auth();
  const player = session?.player;
  const playerId = session?.player?.id;
  if (!player || !playerId) {
    return { success: false, message: "Unauthorized" };
  }

  const validatedFields = createBetParticipationSchema.safeParse({
    outcomeId: formData.get("outcomeId"),
    crystalBallBet: formData.get("crystalBallBet"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { outcomeId, crystalBallBet } = validatedFields.data;

  if ((await hasPlayerAlreadyBetted(betId, playerId)) === true) {
    return {
      success: false,
      message: "You already betted on this bet",
    };
  }

  if ((await canPlayerBet(betId, playerId, password)) === false) {
    return {
      success: false,
      message: "Sorry, you don't have access to the bet",
    };
  }

  if ((await doesOutcomeBelogToBet(outcomeId, betId)) === false) {
    return {
      success: false,
      message: "Seems like the outcome doesn't belong to the bet",
    };
  }

  // Check funds
  if (crystalBallBet > player.crystalBallAmount) {
    return {
      success: false,
      message: "You don't have enough Crystal Balls to place that bet.",
    };
  }

  try {
    // Run a single transaction
    return await prisma.$transaction(async (tx) => {
      // Deduct from player
      await tx.player.update({
        where: { id: playerId },
        data: {
          crystalBallAmount: {
            decrement: crystalBallBet,
          },
        },
      });

      // Create the participation
      await tx.betParticipation.create({
        data: {
          betId: betId,
          playerId: playerId,
          outcomeId: outcomeId,
          amountBet: crystalBallBet,
          currencyCode: CurrencyType.CRYSTAL_BALL,
          resultCode: ResultType.PENDING,
        },
      });

      // Success!
      return { success: true };
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong, please try again...",
    };
  }
}
