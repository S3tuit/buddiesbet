"use server";

import prisma from "@/lib/prisma";

export async function hasPlayerAlreadyVoted(betId: number, playerId: number) {
  const vote = await prisma.vote.findUnique({
    where: {
      betId_playerId: {
        betId: betId,
        playerId: playerId,
      },
    },
    select: {
      betId: true,
    },
  });

  return !!vote?.betId;
}
