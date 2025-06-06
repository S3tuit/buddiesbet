"use client";
import { Outcome, BetParticipation } from "@/app/generated/prisma";

export default function YourBet({
  participation,
}: {
  participation: BetParticipation & { outcome: Outcome };
}) {
  return (
    <div className="bg-black-800 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
      <p className="text-white text-xl font-semibold">You placed</p>
      <div className="text-red-500 text-5xl font-extrabold">
        {participation.amountBet}
      </div>
      <p className="text-white text-lg">prismas on</p>
      <span className="px-5 py-2 text-gold-500 text-xl font-extrabold uppercase tracking-wide">
        {participation.outcome.name}
      </span>
    </div>
  );
}
