"use client";
import { CurrencyType } from "@/app/db/codeTables";
import { Outcome, BetParticipation } from "@prisma/client";

export default function YourBet({
  participation,
}: {
  participation: BetParticipation & { outcome: Outcome };
}) {
  let currency: string;
  if (participation.amountBet > 1) {
    currency =
      participation.currencyCode === CurrencyType.CRYSTAL_BALL
        ? "Crystal Balls on"
        : "Rubies on";
  } else {
    currency =
      participation.currencyCode === CurrencyType.CRYSTAL_BALL
        ? "Crystal Ball on"
        : "Ruby on";
  }

  return (
    <div className="bg-black-800 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
      <p className="text-white text-xl font-semibold">You placed</p>
      <div className="text-red-500 text-5xl font-extrabold">
        {participation.amountBet}
      </div>
      <p className="text-white text-lg">{currency}</p>
      <span className="px-5 py-2 text-gold-500 text-xl font-extrabold uppercase tracking-wide">
        {participation.outcome.name}
      </span>
    </div>
  );
}
