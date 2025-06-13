"use client";

import { BetStateType } from "@/app/db/codeTables";
import { BetParticipation, Bet } from "@prisma/client";
import WaitingPayout from "./WaitingPayout";

type PayoutProps = {
  playerParticipation: BetParticipation;
  betStateCode: Bet["betStateCode"];
};

export default function Payout({
  playerParticipation,
  betStateCode,
}: PayoutProps) {
  if (betStateCode === BetStateType.PAYOUTS_COMPLETED) {
    if (playerParticipation.payout) {
      return (
        <p>{`You betted: ${playerParticipation.amountBet} and you've won ${playerParticipation.payout}`}</p>
      );
    }

    return (
      <p>{`You betted: ${playerParticipation.amountBet} and this time you haven't won`}</p>
    );
  }

  return <WaitingPayout />;
}
