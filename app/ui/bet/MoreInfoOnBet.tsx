"use client";

import { Bet } from "@prisma/client";
import { useState } from "react";
import { OutcomeType } from "@/app/db/codeTables";

type MoreInfoOnBetProps = {
  outcomeTypeCode: Bet["outcomeTypeCode"];
  password: Bet["password"] | undefined;
  isPrivate: boolean;
  isBetCreator: boolean;
};

export default function MoreInfoOnBet({
  outcomeTypeCode,
  password,
  isPrivate,
  isBetCreator,
}: MoreInfoOnBetProps) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  return (
    <>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowMoreOptions((prev) => !prev)}
          className="text-sm text-blue-400 hover:underline"
        >
          {showMoreOptions ? "🙈 Hide info" : "👀 More info"}
        </button>
      </div>

      {showMoreOptions && (
        <div className="mt-4 space-y-6 bg-black-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            More info about the bet
          </h2>
          <ul className="text-sm text-foreground divide-y divide-black-700">
            <li className="py-3">
              <div className="font-semibold text-gold-500">Bet Type</div>
              <div>{isPrivate ? "🔒 Private" : "🌍 Public"}</div>
            </li>

            {isPrivate && isBetCreator && (
              <li className="py-3">
                <div className="font-semibold text-gold-500">Password</div>
                <div>
                  <code className="bg-black-700 px-1 rounded text-xs">
                    {password}
                  </code>
                </div>
              </li>
            )}

            <li className="py-3">
              <div className="font-semibold text-gold-500">Outcome</div>
              <div>
                {outcomeTypeCode === OutcomeType.CREATOR
                  ? "🧑‍⚖️ Host decides"
                  : "🤝 Crowd vote"}
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
