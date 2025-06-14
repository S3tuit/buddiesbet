"use client";

import { Outcome, Vote, Bet } from "@prisma/client";
import { useState, useCallback } from "react";
import { BetStateType, OutcomeType } from "@/app/db/codeTables";
import { getTimeLeftWithGracePeriod } from "@/lib/utils/dateUtils";

import HostSetWinningOut from "./HostSetWinningOut";
import WaitingOnHost from "./WaitingOnHost";
import CrowdSetWinningOut from "./CrowdSetWinningOut";

export interface OutcomeDecisionProps {
  isHost: boolean;
  outcomeTypeCode: Bet["outcomeTypeCode"];
  outcomeDeadline: Bet["outcomeDeadline"];
  outcomes: Outcome[];
  betId: Bet["id"];
  winningOutcomeFromProps: Outcome | null;
  voteFromProps: (Vote & { outcome: Outcome }) | null;
  betStateCode: Bet["betStateCode"];
  setWinningOutcome: (o: Outcome) => void;
}

type resolutionMethod = "creator" | "vote";

export default function OutcomeDecision({
  isHost,
  outcomeTypeCode,
  outcomeDeadline,
  outcomes,
  betId,
  setWinningOutcome,
  voteFromProps,
  betStateCode,
}: OutcomeDecisionProps) {
  const [vote, setVote] = useState(voteFromProps);
  const resolutionMethod: resolutionMethod =
    outcomeTypeCode === OutcomeType.CREATOR ? "creator" : "vote";

  const onSuccessHostSetWQ = useCallback(
    (newWinningOut: Outcome) => {
      setWinningOutcome(newWinningOut);
    },
    [setWinningOutcome]
  );

  const onSuccessCrowdSetWQ = useCallback(
    (newVote: Vote & { outcome: Outcome }) => {
      setVote(newVote);
    },
    [setVote]
  );

  // Host decides outcome
  if (resolutionMethod === "creator") {
    // How many ms left to creator to decide winning outcome
    const timeLeftMs = getTimeLeftWithGracePeriod(outcomeDeadline);

    if (isHost && timeLeftMs > 0) {
      return (
        <HostSetWinningOut
          timeLeftMs={timeLeftMs}
          outcomes={outcomes}
          betId={betId}
          onSuccess={onSuccessHostSetWQ}
        />
      );
    } else if (timeLeftMs > 0) {
      return <WaitingOnHost timeLeftMs={timeLeftMs} />;
    } else {
      // Host has no more time to decide winning outcome and cron job hasn't started yet
      return <p>Deadline is over, voting will be opened to crowd.</p>;
    }
  }

  // Crowd vote
  if (resolutionMethod === "vote") {
    const timeLeftMs = getTimeLeftWithGracePeriod(outcomeDeadline, 0);
    // Player already voted
    if (vote) {
      return <p>You voted: {vote.outcome.name}</p>;
    }
    // Player didn't vote and can vote
    else if (timeLeftMs > 0) {
      return (
        <CrowdSetWinningOut
          timeLeftMs={timeLeftMs}
          outcomes={outcomes}
          onSuccess={onSuccessCrowdSetWQ}
          betId={betId}
          isGracePeriod={false}
        />
      );
    }
  }

  // Bet will be deleted because deadline is over
  if (betStateCode === BetStateType.DEADLINE_OVER_NO_VOTES) {
    return (
      <p>No one voted. This bet is canceled and the players got a refund.</p>
    );
  } else {
    return (
      <p>
        No one voted. The bet will be canceled and the players will get a
        refund.
      </p>
    );
  }
}
