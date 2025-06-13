"use client";

import { Bet, BetParticipation, Outcome, Vote } from "@prisma/client";
import { OutcomeStats } from "@/app/db/entities/betParticipation/totals";

import BetDescription from "./BetDescription";
import BetOutcomes from "./BetOutcomes";
import PlaceBetForm from "./PlaceBetForm";
import YourBet from "./YourBet";
import WinningOutcomeCard from "./closed/WinningOutcomeCard";
import OutcomeDecision from "./closed/OutcomeDecision";
import { useState } from "react";

type BetInfoProps = {
  bet: Bet;
  totalBetted: number;
  winningOutcomeFromProps: Outcome | null;
  outcomes: Outcome[];
  outcomesStats: OutcomeStats;
  playerParticipation: (BetParticipation & { outcome: Outcome }) | null;
  maxCrystalBalls: number;
  isHost: boolean;
  vote: (Vote & { outcome: Outcome }) | null;
  closed: boolean;
  passwordByPlayer: string;
};

export default function BetInfo({
  bet,
  totalBetted,
  winningOutcomeFromProps,
  outcomes,
  outcomesStats,
  playerParticipation,
  maxCrystalBalls,
  isHost,
  vote,
  closed,
  passwordByPlayer,
}: BetInfoProps) {
  const [winningOutcome, setWinningOutcome] = useState<Outcome | null>(
    winningOutcomeFromProps
  );
  return (
    <div className="bg-black-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <BetDescription totalBetted={totalBetted} description={bet.description} />

      <BetOutcomes outcomes={outcomes} outcomesStats={outcomesStats} />

      <section className="border-1 my-4 mb-4 border-gray-500">
        {!closed && !playerParticipation ? (
          // User hasn’t bet yet and betting is open
          <PlaceBetForm
            betId={bet.id}
            outcomes={outcomes}
            maxCrystalBalls={maxCrystalBalls}
            password={passwordByPlayer}
          />
        ) : playerParticipation ? (
          // User already placed a bet
          <YourBet participation={playerParticipation} />
        ) : null}
      </section>

      {winningOutcome && (
        <WinningOutcomeCard
          outcome={winningOutcome}
          betStateCode={bet.betStateCode}
          playerParticipation={playerParticipation}
        />
      )}

      <section className="border-1 my-4 mb-4 border-gray-500">
        {closed && playerParticipation && (
          <OutcomeDecision
            isHost={isHost}
            outcomeTypeCode={bet.outcomeTypeCode}
            outcomeDeadline={bet.outcomeDeadline}
            outcomes={outcomes}
            betId={bet.id}
            winningOutcomeFromProps={winningOutcome}
            voteFromProps={vote}
            betStateCode={bet.betStateCode}
            setWinningOutcome={setWinningOutcome}
          />
        )}
      </section>
    </div>
  );
}
