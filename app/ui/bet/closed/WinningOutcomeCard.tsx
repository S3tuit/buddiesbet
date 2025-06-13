"use client";

import { Bet, BetParticipation, Outcome } from "@prisma/client";
import Payout from "./Payout";

interface WinningOutcomeCardProps {
  outcome: Outcome;
  betStateCode: Bet["betStateCode"];
  playerParticipation: BetParticipation | null;
}

export default function WinningOutcomeCard({
  outcome,
  betStateCode,
  playerParticipation,
}: WinningOutcomeCardProps) {
  return (
    <>
      <div className="bg-black-800 p-6 rounded-2xl shadow-xl flex flex-col items-center space-y-4">
        <div className="text-5xl">🏆</div>
        <h2 className="text-3xl font-extrabold text-gold-500 tracking-wide">
          Winning Outcome
        </h2>
        <span className="text-xl font-semibold text-white">{outcome.name}</span>
        {outcome.odds != null && (
          <span className="text-lg text-white">
            Odds: <strong>{outcome.odds.toFixed(2)}</strong>
          </span>
        )}
      </div>

      {playerParticipation && (
        <Payout
          betStateCode={betStateCode}
          playerParticipation={playerParticipation}
        />
      )}
    </>
  );
}
