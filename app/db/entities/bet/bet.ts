"use server";

import prisma from "@/lib/prisma";
import {
  GRACE_DAYS_DEADLINE_CROWD_WINNING_OUT,
  GRACE_DAYS_DEADLINE_HOST_WINNING_OUT,
  OutcomeType,
} from "../../codeTables";
import { getDateWithGrace } from "@/lib/utils/dateUtils";

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
 * @param password - (Optional) Password provided for password-protected bets.
 * @returns `true` if the player is allowed to bet; otherwise `false`.
 */
export async function canPlayerBet(
  betId: number,
  playerId: number,
  password: string = ""
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
    bet?.creatorId === playerId || !bet?.password || bet.password === password
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

  return bet.betDeadline < now && now < bet.outcomeDeadline;
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
  if (!bet || !!bet.winningOutcomeId || now < bet.betDeadline) {
    return false;
  }

  const crowdDeadlineWithGracePeriod = getDateWithGrace(
    bet.outcomeDeadline,
    GRACE_DAYS_DEADLINE_CROWD_WINNING_OUT
  );

  if (bet.outcomeTypeCode === OutcomeType.VOTE) {
    if (now > crowdDeadlineWithGracePeriod) {
      return false;
    }
    return true;
  }

  // If Host decides winning outcome...
  // check if the deadline to decide the outcome is already passed
  const deadlineWithGracePeriod = getDateWithGrace(
    bet.outcomeDeadline,
    GRACE_DAYS_DEADLINE_HOST_WINNING_OUT
  );

  return now >= bet.outcomeDeadline && now < deadlineWithGracePeriod;
}
