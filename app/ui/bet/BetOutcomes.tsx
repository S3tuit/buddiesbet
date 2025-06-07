import { Outcome } from "@prisma/client";
import { OutcomeStats } from "@/app/db/entities/betParticipation/totals";

import OutcomeList from "@/app/ui/bet/OutcomeList";

type BetOutcomesProps = {
  outcomes: Outcome[];
  outcomesStats: OutcomeStats;
};

export default async function BetOutcomes({
  outcomes,
  outcomesStats,
}: BetOutcomesProps) {
  return (
    <section className="border-1 my-4 mb-4 border-gray-500">
      <h2>Outcomes</h2>
      {outcomes.map((o, i) => (
        <OutcomeList
          key={o.id}
          outcome={{
            id: o.id,
            name: o.name,
            odds: o.odds!,
            totalBets: outcomesStats[o.id].participationCount,
          }}
        />
      ))}
    </section>
  );
}
