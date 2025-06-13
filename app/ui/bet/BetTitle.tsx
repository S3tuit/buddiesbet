"use server";

import { BetStateType } from "@/app/db/codeTables";
import { Bet } from "@prisma/client";

type BetTitleProps = {
  name: string;
  closed: boolean;
  betStateCode: Bet["betStateCode"];
};

export default async function BetTitle({
  name,
  closed,
  betStateCode,
}: BetTitleProps) {
  const cancelled = betStateCode === BetStateType.DEADLINE_OVER_NO_VOTES;

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h1 className="mt-6 text-center text-3xl leading-9 font-extrabold text-red-500">
        {name}{" "}
        <small className="text-sm text-gray-500">
          ({cancelled ? "Cancelled" : closed ? "Closed" : "Open"})
        </small>
      </h1>
    </div>
  );
}
