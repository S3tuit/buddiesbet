"use server";

import prisma from "@/lib/prisma";
import {
  OutcomeType,
  CRON_CHANGE_OUTCOME_TYPE_MINUTES,
  CRON_DELETE_BET_MINUTES,
} from "../../codeTables";
import { decrypt } from "@/lib/password";

/**
 * Checks if a player is allowed to participate in a bet.
 *
 * A player can bet only if:
 * - The bet is still open (i.e., the current time is before the bet deadline), and
 * - At least one of the following is true:
 *   1. The player is the creator of the bet.
 *   2. The bet has no password (i.e., it's public).
 *   3. The provided password matches the bet's password.
 *
 * @param betId - The ID of the bet to check.
 * @param playerId - The ID of the player attempting to bet.
 * @param encryptedPassword - (Optional) Password provided for password-protected bets.
 * @returns `true` if the player is allowed to bet; otherwise `false`.
 */
export async function canPlayerBet(
  betId: number,
  playerId: number,
  encryptedPassword: string = ""
) {
  const bet = await prisma.bet.findUnique({
    where: { id: betId },
    select: { creatorId: true, password: true, betDeadline: true },
  });

  const now = new Date();
  if (!bet?.betDeadline || bet?.betDeadline < now) {
    return false;
  }

  return (
    bet?.creatorId === playerId ||
    !bet?.password ||
    bet.password === encryptedPassword
  );
}

export async function doesOutcomeBelogToBet(outcomeId: number, betId: number) {
  const outcome = await prisma.outcome.findUnique({
    where: { id: outcomeId },
    select: { betId: true },
  });
  return outcome?.betId === betId;
}

export async function isPlayerCreator(betId: number, playerId: number) {
  const bet = await prisma.bet.findUnique({
    where: { id: betId },
    select: { creatorId: true },
  });

  return bet?.creatorId === playerId;
}

export async function canHostDecideWinningOut(betId: number, playerId: number) {
  const bet = await prisma.bet.findUnique({
    where: { id: betId },
    select: {
      creatorId: true,
      betDeadline: true,
      outcomeTypeCode: true,
      winningOutcomeId: true,
      outcomeDeadline: true,
    },
  });

  if (
    !bet ||
    bet.creatorId !== playerId ||
    bet.outcomeTypeCode !== OutcomeType.CREATOR ||
    !!bet.winningOutcomeId
  ) {
    return false;
  }

  const now = new Date();
  // Added grace period because it can happen that the outcomeDeadline is over and the cron job to update the bet isn't started yet
  const outcomeDeadlineWithGrace = new Date(
    bet.outcomeDeadline.getTime() +
      (2 + CRON_CHANGE_OUTCOME_TYPE_MINUTES) * 60 * 1000
  );

  return bet.betDeadline < now && now < outcomeDeadlineWithGrace;
}

export async function canCrowdVote(betId: number) {
  const bet = await prisma.bet.findUnique({
    where: { id: betId },
    select: {
      betDeadline: true,
      outcomeTypeCode: true,
      winningOutcomeId: true,
      outcomeDeadline: true,
    },
  });

  const now = new Date();
  if (
    !bet ||
    !!bet.winningOutcomeId ||
    now < bet.betDeadline ||
    bet.outcomeTypeCode !== OutcomeType.VOTE
  ) {
    return false;
  }

  // Added grace period because it can happen that the outcomeDeadline is over and the cron job to delete the bet isn't started yet
  const crowdDeadlineWithGracePeriod = new Date(
    bet.outcomeDeadline.getTime() + (2 + CRON_DELETE_BET_MINUTES) * 60 * 1000
  );

  return now < crowdDeadlineWithGracePeriod;
}

// Returns the encrypted password if correct, else null
export async function isPasswordCorrect(betId: number, plainPassword: string) {
  const bet = await prisma.bet.findUnique({
    where: { id: betId },
    select: {
      password: true,
    },
  });

  if (bet?.password && decrypt(bet.password) === plainPassword) {
    return bet.password;
  } else {
    return null;
  }
}
