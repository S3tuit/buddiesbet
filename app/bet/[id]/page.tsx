import { notFound, unauthorized } from "next/navigation";
import prisma from "@/lib/prisma";
import { Vote, Outcome } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { getParticipationStatsByOutcome } from "@/app/db/entities/betParticipation/totals";
import { getPlayerBetParticipation } from "@/app/db/entities/betParticipation/betParticipation";
import { OddsType } from "@/app/db/codeTables";

// Client components (must live in their own files under app/)
import BetOutcomes from "@/app/ui/bet/BetOutcomes";
import PlaceBetForm from "@/app/ui/bet/PlaceBetForm";
import YourBet from "@/app/ui/bet/YourBet";
import MoreInfoOnBet from "@/app/ui/bet/MoreInfoOnBet";
import BetPrismasAndDesc from "@/app/ui/bet/BetPrismasAndDesc";
import OutcomeDecision from "@/app/ui/bet/closed/OutcomeDecision";
import BetTitle from "@/app/ui/bet/BetTitle";

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
  const isPrivate = !!bet.password;
  if (bet.creatorId !== playerId && isPrivate) unauthorized();
  const isHost = bet.creatorId === playerId;

  // 4) Get bet stats
  const outcomesStats = await getParticipationStatsByOutcome(bet.outcomes);
  const totalBetted = Object.values(outcomesStats).reduce(
    (sum, { totalBetAmount }) => sum + totalBetAmount,
    0
  );
  const totalPlayers = Object.values(outcomesStats).reduce(
    (tot, { participationCount }) => tot + participationCount,
    0
  );
  if (bet.oddsTypeCode === OddsType.AUTO) {
    const n = bet.outcomes.length;
    const smoothedTotal = totalPlayers + n;

    bet.outcomes = bet.outcomes.map((outcome) => {
      const probability =
        (outcomesStats[outcome.id].participationCount + 1) / smoothedTotal;
      const rawOdds = 1 / probability;

      return {
        ...outcome,
        odds: parseFloat(rawOdds.toFixed(2)),
      };
    });
  }

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
      <BetTitle name={bet.name} closed={closed} />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-black-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <BetPrismasAndDesc
            totalBetted={totalBetted}
            description={bet.description}
          />

          <BetOutcomes outcomes={bet.outcomes} outcomesStats={outcomesStats} />

          <section className="border-1 my-4 mb-4 border-gray-500">
            {!closed && !playerParticipation ? (
              // User hasn’t bet yet and betting is open
              <PlaceBetForm
                betId={bet.id}
                outcomes={bet.outcomes}
                maxRuby={session.player!.rubyAmount}
                password=""
              />
            ) : playerParticipation ? (
              // User already placed a bet
              <YourBet participation={playerParticipation} />
            ) : null}
          </section>

          <section className="border-1 my-4 mb-4 border-gray-500">
            {closed && playerParticipation && (
              <OutcomeDecision
                isHost={isHost}
                outcomeTypeCode={bet.outcomeTypeCode}
                outcomeDeadline={bet.outcomeDeadline}
                outcomes={bet.outcomes}
                betId={bet.id}
                winningOutcomeFromProps={bet.winningOutcome}
                voteFromProps={vote}
              />
            )}
          </section>

          <MoreInfoOnBet
            outcomeTypeCode={bet.outcomeTypeCode}
            oddsTypeCode={bet.oddsTypeCode}
            password={
              isHost && bet.password ? bet.password : bet.password ? "1" : null
            }
            isBetCreator={playerId === bet.creatorId}
          />
        </div>
      </div>
    </div>
  );
}
