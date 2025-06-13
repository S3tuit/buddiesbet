"use client";

import { useState } from "react";
import { OutcomeType } from "@/app/db/codeTables";

type NerdOptionCreateBetPros = {
  setIsPrivate: (isPrivate: boolean) => void;
  isPrivate: boolean;
  setIsCreatorOdds: (isPrivate: boolean) => void;
  isCreatorOdds: boolean;
  hidden: boolean;
};

export default function NerdOptionCreateBet({
  setIsPrivate,
  isPrivate,
  hidden,
  setIsCreatorOdds,
  isCreatorOdds,
}: NerdOptionCreateBetPros) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [crowdDecides, SetCrowdDecides] = useState<boolean>(true);

  return (
    <div hidden={hidden}>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowMoreOptions((prev) => !prev)}
          className="text-sm text-blue-400 hover:underline"
        >
          {showMoreOptions ? "Hide options" : "More options"}
        </button>
      </div>

      <div className="mt-4 space-y-6" hidden={!showMoreOptions}>
        <div>
          <label className="block text-sm font-medium text-white">
            Who can join this bet?
          </label>
          <div className="mt-2 space-y-2 text-white text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isPrivate"
                value="false"
                checked={!isPrivate}
                className="form-radio"
                onChange={() => setIsPrivate(false)}
              />
              Anyone with the link
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isPrivate"
                value="true"
                checked={isPrivate}
                className="form-radio"
                onChange={() => setIsPrivate(true)}
              />
              Only people with the password (you’ll set it later)
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            How is the outcome decided?
          </label>
          <div className="mt-2 space-y-2 text-white text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="outcomeTypeCode"
                value={`${OutcomeType.VOTE}`}
                checked={crowdDecides}
                onChange={() => SetCrowdDecides(true)}
                className="form-radio"
              />
              The crowd decides (majority vote)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="outcomeTypeCode"
                value={`${OutcomeType.CREATOR}`}
                className="form-radio"
                checked={!crowdDecides}
                onChange={() => SetCrowdDecides(false)}
              />
              I’ll decide (wow, they trust you this much?!)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
