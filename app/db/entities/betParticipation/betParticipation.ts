"use server";

import prisma from "@/lib/prisma";

export async function getPlayerBetParticipation(
  playerId: number,
  betId: number
) {
  return prisma.betParticipation.findFirst({
    where: {
      betId: betId,
      playerId: playerId,
    },
    include: { outcome: true },
  });
}

export async function hasPlayerAlreadyBetted(betId: number, playerId: number) {
  const participation = await prisma.betParticipation.findFirst({
    where: { playerId: playerId, betId: betId },
    select: { id: true },
  });

  return !!participation;
}
