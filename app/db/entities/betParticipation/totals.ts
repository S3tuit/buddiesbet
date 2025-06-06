"use server";

import { Outcome } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

export async function getTotalBetAmount(betId: number): Promise<number> {
  const result = await prisma.betParticipation.aggregate({
    where: { betId },
    _sum: { amountBet: true },
  });

  // If there are no participations, result._sum.amountBet will be null
  return result._sum.amountBet ?? 0;
}

export type OutcomeStats = Record<
  number,
  { totalBetAmount: number; participationCount: number }
>;

/**
 * For each outcome in the list, returns both:
 *  - totalBetAmount: sum of amountBet
 *  - participationCount: number of betParticipations
 */
export async function getParticipationStatsByOutcome(
  outcomes: Outcome[]
): Promise<OutcomeStats> {
  const outcomeIds = outcomes.map((o) => o.id);

  // Group by outcomeId, computing both sum and count in one query
  const grouped = await prisma.betParticipation.groupBy({
    by: ["outcomeId"],
    where: { outcomeId: { in: outcomeIds } },
    _sum: { amountBet: true },
    _count: { _all: true },
  });

  // Build a result map, defaulting to zero
  const result: OutcomeStats = {};
  for (const id of outcomeIds) {
    result[id] = {
      totalBetAmount: 0,
      participationCount: 0,
    };
  }

  for (const entry of grouped) {
    result[entry.outcomeId] = {
      totalBetAmount: entry._sum.amountBet ?? 0,
      participationCount: entry._count._all,
    };
  }

  return result;
}
