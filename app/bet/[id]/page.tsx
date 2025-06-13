import { notFound, unauthorized } from "next/navigation";
import prisma from "@/lib/prisma";
import { Vote, Outcome } from "@prisma/client";
import { auth } from "@/auth";
import { getParticipationStatsByOutcome } from "@/app/db/entities/betParticipation/totals";
import { getPlayerBetParticipation } from "@/app/db/entities/betParticipation/betParticipation";

import MoreInfoOnBet from "@/app/ui/bet/MoreInfoOnBet";
import BetTitle from "@/app/ui/bet/BetTitle";
import BetInfo from "@/app/ui/bet/BetInfo";
import { decrypt } from "@/lib/password";
import { cookies } from "next/headers";
import PasswordForm from "@/app/ui/bet/password/PasswordForm";

export default async function BetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1) Get player and bet id
  const session = await auth();
  const playerId = session?.player?.id;
  if (!playerId) unauthorized();

  const { id } = await params;
  const betId = parseInt(id, 10);
  if (isNaN(betId)) notFound();

  // 2) Fetch the bet, and its outcomes:
  const bet = await prisma.bet.findUnique({
    where: { id: betId },
    include: {
      winningOutcome: true,
      outcomes: true,
    },
  });
  if (!bet) notFound();

  // 3) Check if the player has access to the bet
  const isHost = bet.creatorId === playerId;
  let passwordByPlayer;
  if (bet.password && !isHost) {
    const cookieStore = await cookies();
    passwordByPlayer = cookieStore.get(`bet_access_${betId}`)?.value;
    if (passwordByPlayer !== bet.password) {
      return <PasswordForm betId={bet.id} />;
    }
  }

  // 4) Get bet stats
  const outcomesStats = await getParticipationStatsByOutcome(bet.outcomes);
  const totalBetted = Object.values(outcomesStats).reduce(
    (sum, { totalBetAmount }) => sum + totalBetAmount,
    0
  );

  const n = bet.outcomes.length;

  bet.outcomes = bet.outcomes.map((outcome) => {
    const stats = outcomesStats[outcome.id];

    //    If nobody bet anything yet, fall back to even odds (1/n)
    const probability =
      totalBetted > 0 ? stats.totalBetAmount / totalBetted : 1 / n;
    let rawOdds = 1 / probability;

    if (rawOdds < 1.01) rawOdds = 1.01;
    if (rawOdds > 99) rawOdds = 99;

    return {
      ...outcome,
      odds: parseFloat(rawOdds.toFixed(2)),
    };
  });

  // 5) Check if bet closed
  const now = new Date();
  const closed = bet.betDeadline.getTime() < now.getTime();

  // 6) Fetch if the user already betted
  const playerParticipation = await getPlayerBetParticipation(playerId, betId);

  // 7) Fetch the user vote if bet closed
  let vote: (Vote & { outcome: Outcome }) | null = null;
  if (closed) {
    vote = await prisma.vote.findFirst({
      where: {
        playerId: playerId,
        outcome: { betId: bet.id },
      },
      include: {
        outcome: true,
      },
    });
  }

  return (
    <div className="min-h-screen bg-black-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <BetTitle
        name={bet.name}
        closed={closed}
        betStateCode={bet.betStateCode}
      />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <BetInfo
          bet={bet}
          totalBetted={totalBetted}
          winningOutcomeFromProps={bet.winningOutcome}
          outcomes={bet.outcomes}
          outcomesStats={outcomesStats}
          playerParticipation={playerParticipation}
          maxCrystalBalls={session.player!.crystalBallAmount}
          isHost={isHost}
          vote={vote}
          closed={closed}
          passwordByPlayer={passwordByPlayer ? passwordByPlayer : ""}
        />

        <div className="bg-black-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <MoreInfoOnBet
            outcomeTypeCode={bet.outcomeTypeCode}
            password={isHost && bet.password ? decrypt(bet.password) : null}
            isPrivate={!!bet.password}
            isBetCreator={playerId === bet.creatorId}
          />
        </div>
      </div>
    </div>
  );
}
