"use client";

import { Outcome } from "@/app/generated/prisma";
import Form from "next/form";

import OutcomeDecision from "./closed/OutcomeDecision";

export interface WinningOutcomeSectionProps {
  isHost: boolean;
  outcomeTypeCode: number;
  daysRemaining: number;
  outcomes: Outcome[];
  betId: number;
  closed: boolean;
  winningOutcome: Outcome | null;
}

export default function WinningOutcomeSection({
  isHost,
  outcomeTypeCode,
  daysRemaining,
  outcomes,
  betId,
  closed,
}: WinningOutcomeSectionProps) {
  return (
    <section className="border-1 my-4 mb-4 border-gray-500">
      {closed && (
        <OutcomeDecision
          isHost={isHost}
          outcomeTypeCode={outcomeTypeCode}
          daysRemaining={daysRemaining}
          outcomes={outcomes}
          betId={betId}
        />
      )}
    </section>
  );
}
