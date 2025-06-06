"use client";

import { Outcome, Vote, Bet } from "@/app/generated/prisma";
import { useState, useCallback } from "react";
import {
  GRACE_DAYS_DEADLINE_HOST_WINNING_OUT,
  OutcomeType,
} from "@/app/db/codeTables";
import { getTimeLeftWithGracePeriod } from "@/lib/utils/dateUtils";

import HostSetWinningOut from "./HostSetWinningOut";
import WaitingOnHost from "./WaitingOnHost";
import WinningOutcomeCard from "./WinningOutcomeCard";
import CrowdSetWinningOut from "./CrowdSetWinningOut";

export interface OutcomeDecisionProps {
  isHost: boolean;
  outcomeTypeCode: Bet["outcomeTypeCode"];
  outcomeDeadline: Bet["outcomeDeadline"];
  outcomes: Outcome[];
  betId: Bet["id"];
  winningOutcomeFromProps: Outcome | null;
  voteFromProps: (Vote & { outcome: Outcome }) | null;
}

type resolutionMethod = "creator" | "vote";

export default function OutcomeDecision({
  isHost,
  outcomeTypeCode,
  outcomeDeadline,
  outcomes,
  betId,
  winningOutcomeFromProps,
  voteFromProps,
}: OutcomeDecisionProps) {
  const [winningOutcome, setwinningOutcome] = useState(winningOutcomeFromProps);
  const [vote, setVote] = useState(voteFromProps);
  let resolutionMethod: resolutionMethod =
    outcomeTypeCode === OutcomeType.CREATOR ? "creator" : "vote";

  const onSuccessHostSetWQ = useCallback(
    (newWinningOut: Outcome) => {
      setwinningOutcome(newWinningOut);
    },
    [setwinningOutcome]
  );

  const onSuccessCrowdSetWQ = useCallback(
    (newVote: Vote & { outcome: Outcome }) => {
      setVote(newVote);
    },
    [setVote]
  );

  // Outcome already decided
  if (winningOutcome) {
    return <WinningOutcomeCard outcome={winningOutcome} />;
  }

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
      // Host has no more time to decide winning outcome
      resolutionMethod = "vote";
    }
  }

  // Crowd vote
  if (resolutionMethod === "vote") {
    const timeLeftMs = getTimeLeftWithGracePeriod(
      outcomeDeadline,
      outcomeTypeCode === OutcomeType.CREATOR
        ? GRACE_DAYS_DEADLINE_HOST_WINNING_OUT
        : 0
    );
    if (timeLeftMs > 0) {
      if (!vote) {
        return (
          <CrowdSetWinningOut
            timeLeftMs={timeLeftMs}
            outcomes={outcomes}
            onSuccess={onSuccessCrowdSetWQ}
            betId={betId}
          />
        );
      } else {
        return <p>{vote.outcome.name}</p>;
      }
    }
  }

  // Fallback (shouldn’t happen)
  return null;
}
