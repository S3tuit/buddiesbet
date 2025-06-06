"use client";

import { useState, useActionState, useEffect } from "react";
import Form from "next/form";
import { Outcome, Vote } from "@/app/generated/prisma";
import { formatTimeLeftToMinutes } from "@/lib/utils/dateUtils";

import {
  crowdVoteFromForm,
  CrowdVoteState,
} from "@/app/db/entities/bet/winningOutcome";

interface CrowdSetWinningOutProps {
  timeLeftMs: number;
  outcomes: Outcome[];
  onSuccess: (newVote: Vote & { outcome: Outcome }) => void;
  betId: number;
}

export default function CrowdSetWinningOut({
  timeLeftMs,
  outcomes,
  onSuccess,
  betId,
}: CrowdSetWinningOutProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<number>(0);
  const [setCrowdVoteState, setCrowdVoteFormAction, pending] = useActionState(
    (prevState: CrowdVoteState, formData: FormData) =>
      crowdVoteFromForm(prevState, formData, betId),
    { success: false } as CrowdVoteState
  );

  const { success, errors, message } = setCrowdVoteState;
  const timeLeftString = formatTimeLeftToMinutes(timeLeftMs);

  useEffect(() => {
    if (success && setCrowdVoteState.data) {
      onSuccess(setCrowdVoteState.data);
    }
  }, [setCrowdVoteState]);

  return (
    <Form
      action={setCrowdVoteFormAction}
      className="bg-black-800 p-6 rounded-lg shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
        🗳️ Vote for the Winning Outcome
      </h2>
      <p className="text-foreground">
        Voting closes in {timeLeftString} — majority wins!
      </p>

      <fieldset className="space-y-2">
        {outcomes.map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-white">
            <input
              type="radio"
              name="outcomeId"
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
      <input type="hidden" name="outcomeId" value={selectedOutcome} />

      {/* field-specific errors */}
      {!success && errors?.outcomeId && (
        <div className="text-red-800 underline text-sm">
          {errors.outcomeId.map((errMsg, i) => (
            <div key={i}>* {errMsg}</div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-gold-500 text-black-900 font-semibold rounded-md hover:bg-gold-600 transition"
      >
        Vote The Outcome
      </button>

      {/* general error message */}
      {!success && message && (
        <div className="text-red-800 underline text-sm">* {message}</div>
      )}
    </Form>
  );
}
