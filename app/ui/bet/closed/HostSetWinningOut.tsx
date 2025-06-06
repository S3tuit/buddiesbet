"use client";

import { useState, useActionState, useEffect } from "react";
import { Outcome } from "@/app/generated/prisma";
import {
  winningOutcomeHostFromForm,
  WinningOutcomeHostState,
} from "@/app/db/entities/bet/winningOutcome";
import { formatTimeLeftToMinutes } from "@/lib/utils/dateUtils";

import Form from "next/form";
import FieldErrors from "../../FieldErrors";
import FormError from "../../FormError";

export interface HostSetWinningOutProps {
  timeLeftMs: number;
  outcomes: Outcome[];
  betId: number;
  onSuccess: (outcome: Outcome) => void;
}

export default function HostSetWinningOut({
  timeLeftMs,
  outcomes,
  betId,
  onSuccess,
}: HostSetWinningOutProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<number>(0);
  const [setWinningOutHostState, setWinningOutHostFormAction, pending] =
    useActionState(
      (prevState: WinningOutcomeHostState, formData: FormData) =>
        winningOutcomeHostFromForm(prevState, formData, betId),
      { success: false } as WinningOutcomeHostState
    );

  const { success, errors, message } = setWinningOutHostState;

  useEffect(() => {
    if (success && setWinningOutHostState.data) {
      onSuccess(setWinningOutHostState.data);
    }
  }, [setWinningOutHostState]);
  const timeLeftString = formatTimeLeftToMinutes(timeLeftMs);

  return (
    <Form
      action={setWinningOutHostFormAction}
      className="bg-black-800 p-6 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
        ✅ Decide the Outcome
      </h2>
      <p className="text-foreground">
        You have <b>{timeLeftString}</b> left to choose the winning outcome.
        <br />
        If you don&apos;t act, the crowd will vote instead.
      </p>
      <fieldset className="space-y-2">
        {outcomes.map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-white">
            <input
              type="radio"
              value={o.id}
              checked={selectedOutcome === o.id}
              onChange={() => setSelectedOutcome(o.id)}
              className="form-radio text-gold-500"
            />
            <span className="ml-2">{o.name}</span>
          </label>
        ))}
      </fieldset>
      {/* mirror selection */}
      <input type="hidden" name="winningOutcomeId" value={selectedOutcome} />

      <FieldErrors errors={errors} field="winningOutcomeId" />

      <button
        type="submit"
        className="w-full py-2 bg-gold-500 text-black-900 font-semibold rounded-md hover:bg-gold-600 transition"
      >
        Confirm Outcome
      </button>

      {/* Display general error message */}
      <FormError message={message} />
    </Form>
  );
}
