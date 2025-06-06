"use client";

import { useCallback } from "react";
import { OutcomeInputForm } from "@/app/db/entities/bet/createBet";
import { CreateBetState } from "@/app/db/entities/bet/createBet";
import FieldErrors from "../FieldErrors";

interface SetOddsFormProps {
  outcomes: OutcomeInputForm[];
  setOutcomes: (outcomes: OutcomeInputForm[]) => void;
  hidden: boolean;
  errors: CreateBetState["errors"];
}

export default function SetOddsForm({
  outcomes,
  setOutcomes,
  hidden,
  errors,
}: SetOddsFormProps) {
  // when user edits odds, recalc probability
  const handleOddsChange = useCallback(
    (idx: number, odds: string) => {
      const arr = [...outcomes];
      arr[idx].odds = odds;
      const n = parseFloat(odds);
      arr[idx].probability =
        !isNaN(n) && n > 0 ? ((1 / n) * 100).toFixed(2) : "";
      setOutcomes(arr);
    },
    [setOutcomes, outcomes]
  );

  // when user edits probability, recalc odds
  const handleProbChange = useCallback(
    (idx: number, prob: string) => {
      const arr = [...outcomes];
      arr[idx].probability = prob;
      const p = parseFloat(prob);
      arr[idx].odds = !isNaN(p) && p > 0 ? (1 / (p / 100)).toFixed(2) : "";
      setOutcomes(arr);
    },
    [setOutcomes, outcomes]
  );

  // “Do the math” button: recalc all probabilities from odds
  const balanceAll = useCallback(() => {
    // 1. Parse current probabilities
    const rawProbs = outcomes.map((v) => parseFloat(v.probability) || 0);
    const totalRaw = rawProbs.reduce((sum, p) => sum + p, 0);

    // If there's nothing to normalize, leave unchanged
    if (totalRaw <= 0) return;

    // 2. Normalize to percentages
    const normalized = rawProbs.map((p) => (p / totalRaw) * 100);

    // 3. Floor each value
    const floored = normalized.map((p) => Math.floor(p));
    const sumFloored = floored.reduce((sum, p) => sum + p, 0);

    // 4. Compute leftover and distribute to the last item
    const leftover = 100 - sumFloored;

    const updated = outcomes.map((v, i) => {
      const finalProb =
        i === outcomes.length - 1 ? floored[i] + leftover : floored[i];

      const finalOdds = finalProb > 0 ? (1 / (finalProb / 100)).toFixed(2) : "";

      return {
        ...v,
        probability: finalProb.toString(),
        odds: finalOdds,
      };
    });

    setOutcomes(updated);
  }, [setOutcomes, outcomes]);

  return (
    <div hidden={hidden} className="space-y-4 mb-16">
      <p className="text-white">
        Set the odds or the probability for each outcome — whichever feels
        easier.
      </p>
      <p className="text-gray-400 text-sm">
        💡 Reminder:
        <br />
        Higher odds = bigger payout = less likely
        <br />
        Higher probability = safer bet = lower payout
      </p>

      <div className="space-y-3">
        {outcomes.map((v, i) => (
          <div key={v.id} className="flex items-center gap-4 text-white">
            <span className="flex-1">- {v.name}</span>
            <input
              name={`${v.id}`}
              type="number"
              placeholder="Odds"
              step="0.01"
              value={v.odds}
              onChange={(e) => handleOddsChange(i, e.target.value)}
              className="w-24 px-2 py-1 rounded border border-gray-600 bg-black-800 text-white"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="%"
              step="1"
              value={v.probability}
              onChange={(e) => handleProbChange(i, e.target.value)}
              className="w-24 px-2 py-1 rounded border border-gray-600 bg-black-800 text-white"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <FieldErrors errors={errors} field="outcomesOdds" />
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          type="button"
          onClick={balanceAll}
          className="text-blue-400 hover:underline"
        >
          Do the math
        </button>
      </div>
    </div>
  );
}
