"use client";

import { useState, useActionState } from "react";
import Form from "next/form";
import { Outcome } from "@/app/generated/prisma";
import {
  CreateBetParticipationState,
  createBetParticipationFromForm,
} from "@/app/db/entities/betParticipation/createBetParticipation";

import FieldErrors from "@/app/ui/FieldErrors";
import FormError from "@/app/ui/FormError";

interface PlaceBetFormProps {
  betId: number;
  outcomes: Outcome[];
  maxRuby: number;
  password: string;
}

export default function PlaceBetForm({
  betId,
  outcomes,
  maxRuby,
  password = "",
}: PlaceBetFormProps) {
  const [selected, setSelected] = useState<number>(outcomes[0].id);
  const [amount, setAmount] = useState<number>(0);
  const [setBetParticipationState, setBetParticipationFormAction, pending] =
    useActionState(
      (prevState: CreateBetParticipationState, formData: FormData) =>
        createBetParticipationFromForm(prevState, formData, betId, password),
      { success: false } as CreateBetParticipationState
    );
  const { success, errors } = setBetParticipationState;

  return (
    <Form
      action={setBetParticipationFormAction}
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
            onClick={() => setSelected(o.id)}
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
          How many Ruby? {`you have: ${maxRuby}`}
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() =>
              setAmount((a) => Math.min(maxRuby, Math.max(0, a - 1)))
            }
            className="px-3 py-2 bg-black-700 rounded hover:bg-black-600 text-white"
          >
            –
          </button>
          <input
            id="rubyBet"
            name="rubyBet"
            type="number"
            min={0}
            value={amount}
            onChange={(e) =>
              setAmount(
                Math.min(maxRuby, Math.max(0, parseInt(e.target.value) || 0))
              )
            }
            className="w-20 text-center px-3 py-2 bg-black-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <button
            type="button"
            onClick={() => setAmount((a) => Math.min(maxRuby, a + 1))}
            className="px-3 py-2 bg-black-700 rounded hover:bg-black-600 text-white"
          >
            +
          </button>
        </div>
      </div>
      <FieldErrors errors={errors} field="rubyBet" />

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-gold-500 rounded-full text-black-900 font-bold text-lg hover:bg-gold-600 transition-transform transform hover:scale-105"
      >
        🎲 Place Bet
      </button>
      <FormError message={setBetParticipationState.message} />
    </Form>
  );
}
