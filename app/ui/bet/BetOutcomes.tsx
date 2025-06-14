"use client";

import { OutcomesStats } from "@/app/db/entities/betParticipation/totals";
import OutcomeList from "@/app/ui/bet/OutcomeList";
import { Outcome } from "@prisma/client";

type BetOutcomesProps = {
  outcomesStats: OutcomesStats;
  outcomes: Outcome[];
};

export default function BetOutcomes({
  outcomesStats,
  outcomes,
}: BetOutcomesProps) {
  return (
    <section className="border-1 my-4 mb-4 border-gray-500">
      <h2>Outcomes</h2>
      {outcomes.map((o) => (
        <OutcomeList
          key={o.id}
          outcomeName={o.name}
          outcomeStats={outcomesStats[o.id]}
        />
      ))}
    </section>
  );
}
