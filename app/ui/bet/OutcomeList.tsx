interface OutcomeListProps {
  outcomeStats: {
    totalBetAmount: number;
    participationCount: number;
    odds: number;
  };
  outcomeName: string;
}

export default function OutcomeList({
  outcomeStats,
  outcomeName,
}: OutcomeListProps) {
  return (
    <div className="border-1 m-4 border-gray-500">
      <div className="flex items-center gap-2">
        <span className="text-gold-500">-</span>
        <span className="flex-1 text-white">
          {outcomeName} —{" "}
          <span className="font-semibold">{outcomeStats.totalBetAmount}</span>{" "}
          crystal Balls placed @{" "}
          <span className="font-mono">{outcomeStats.odds}</span>
        </span>
      </div>
    </div>
  );
}
