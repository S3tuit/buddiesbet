interface OutcomeListProps {
  outcome: {
    id: number;
    name: string;
    odds: number;
    totalBets: number;
  };
}

export default function OutcomeList({ outcome }: OutcomeListProps) {
  return (
    <div className="border-1 m-4 border-gray-500">
      <div className="flex items-center gap-2">
        <span className="text-gold-500">-</span>
        <span className="flex-1 text-white">
          {outcome.name} —{" "}
          <span className="font-semibold">{outcome.totalBets}</span> bets @{" "}
          <span className="font-mono">{outcome.odds}</span>
        </span>
      </div>
    </div>
  );
}
