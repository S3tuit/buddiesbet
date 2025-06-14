"use client";

import { useState, useActionState, useEffect } from "react";
import Form from "next/form";
import { BetParticipation, Outcome } from "@prisma/client";
import {
  CreateBetParticipationState,
  createBetParticipationFromForm,
} from "@/app/db/entities/betParticipation/createBetParticipation";

import FieldErrors from "@/app/ui/FieldErrors";
import FormError from "@/app/ui/FormError";
import { SetStateAction, useCallback } from "react";
import { OutcomesStats } from "@/app/db/entities/betParticipation/totals";

interface PlaceBetFormProps {
  betId: number;
  outcomes: Outcome[];
  maxCrystalBalls: number;
  password: string;
  setOutcomesStats: (value: SetStateAction<OutcomesStats>) => void;
  setPlayerParticipation: (
    value: SetStateAction<(BetParticipation & { outcome: Outcome }) | null>
  ) => void;
}

export default function PlaceBetForm({
  betId,
  outcomes,
  maxCrystalBalls,
  password = "",
  setOutcomesStats,
  setPlayerParticipation,
}: PlaceBetFormProps) {
  const [selected, setSelected] = useState<number>(outcomes[0].id);
  const [amount, setAmount] = useState<number>(0);
  const [betParticipationState, betParticipationFormAction, pending] =
    useActionState(
      (prevState: CreateBetParticipationState, formData: FormData) =>
        createBetParticipationFromForm(prevState, formData, betId, password),
      { success: false } as CreateBetParticipationState
    );

  useEffect(() => {
    if (betParticipationState.success && betParticipationState.data) {
      setPlayerParticipation(betParticipationState.data);
    }
  }, [betParticipationState]);

  const addBetAndRecalcOdds = useCallback(
    (outcomeId: number, newBetAmount: number) => {
      setOutcomesStats((prev) => {
        // 1) clone the map and apply the single‐outcome update
        const updatedStats: Record<number, (typeof prev)[number]> = {
          ...prev,
          [outcomeId]: {
            ...prev[outcomeId],
            totalBetAmount: prev[outcomeId].totalBetAmount + newBetAmount,
            participationCount:
              newBetAmount > 0
                ? prev[outcomeId].participationCount + 1
                : prev[outcomeId].participationCount - 1,
            // keep the old odds for now
            odds: prev[outcomeId].odds,
          },
        };

        // 2) compute the new total betted across all outcomes
        const entries = Object.entries(updatedStats) as [
          string,
          (typeof prev)[number]
        ][];
        const totalBetted = entries.reduce(
          (sum, [, { totalBetAmount }]) => sum + totalBetAmount,
          0
        );
        const n = entries.length;

        // 3) recalc odds for every outcome
        for (const [key, o] of entries) {
          const id = Number(key);
          const probability =
            totalBetted > 0 ? o.totalBetAmount / totalBetted : 1 / n;
          let rawOdds = 1 / probability;
          rawOdds = Math.min(Math.max(rawOdds, 1.01), 99);

          updatedStats[id] = {
            ...o,
            odds: parseFloat(rawOdds.toFixed(2)),
          };
        }

        return updatedStats;
      });
    },
    [setOutcomesStats]
  );

  const { success, errors } = betParticipationState;

  return (
    <Form
      action={betParticipationFormAction}
      className="bg-black-800 p-6 rounded-2xl shadow-lg space-y-6"
    >
      <h3 className="text-2xl font-extrabold text-gold-500">
        🎯 Pick Your Outcome
      </h3>

      {/* Outcome buttons */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
        {outcomes.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              if (selected !== o.id) {
                addBetAndRecalcOdds(selected, -amount);
                addBetAndRecalcOdds(o.id, amount);
              }
              setSelected(o.id);
            }}
            className={`flex items-center justify-center gap-2 p-4 rounded-lg transition ${
              selected === o.id
                ? "bg-gold-500 text-black-900 shadow-inner"
                : "bg-black-700 text-white hover:bg-black-600"
            }`}
          >
            <span className="font-medium">{o.name}</span>
          </button>
        ))}
      </div>
      {/* mirror the selected outcome into a hidden field */}
      <input type="hidden" name="outcomeId" value={selected} />
      <FieldErrors errors={errors} field="outcomeId" />

      {/* Amount selector */}
      <div className="justify-center">
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-white mb-1"
        >
          How many Crystal Balls? {`you have: ${maxCrystalBalls}`}
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              setAmount((a) => Math.min(maxCrystalBalls, Math.max(0, a - 1)));
              addBetAndRecalcOdds(selected, -1);
            }}
            className="px-3 py-2 bg-black-700 rounded hover:bg-black-600 text-white"
          >
            –
          </button>
          <input
            id="crystalBallBet"
            name="crystalBallBet"
            type="number"
            min={0}
            value={amount}
            onChange={(e) => {
              e.preventDefault();
              const newAmount = Math.min(
                maxCrystalBalls,
                Math.max(0, parseInt(e.target.value) || 0)
              );
              const diff = newAmount - amount;

              setAmount(newAmount);
              if (diff !== 0) {
                addBetAndRecalcOdds(selected, diff);
              }
            }}
            className="w-20 text-center px-3 py-2 bg-black-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <button
            type="button"
            onClick={() => {
              setAmount((a) => Math.min(maxCrystalBalls, a + 1));
              addBetAndRecalcOdds(selected, 1);
            }}
            className="px-3 py-2 bg-black-700 rounded hover:bg-black-600 text-white"
          >
            +
          </button>
        </div>
      </div>
      <FieldErrors errors={errors} field="crystalBallBet" />

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-gold-500 rounded-full text-black-900 font-bold text-lg hover:bg-gold-600 transition-transform transform hover:scale-105"
      >
        🎲 Place Bet
      </button>
      <FormError message={betParticipationState.message} />
    </Form>
  );
}
