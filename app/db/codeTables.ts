export enum OutcomeType {
  CREATOR = 1,
  VOTE = 2,
}

export enum CurrencyType {
  CRYSTAL_BALL = 1,
  RUBY = 2,
}

export enum ResultType {
  WIN = 1,
  LOSE = 2,
  PENDING = 3,
}

export enum BetStateType {
  OPEN = 1,
  PAYOUTS_COMPLETED = 2,
  DEADLINE_OVER_NO_VOTES = 3,
}

export const GRACE_DAYS_DEADLINE_HOST_WINNING_OUT = 10 as const;
export const CRON_DELETE_BET_MINUTES = 15 as const;
export const CRON_CHANGE_OUTCOME_TYPE_MINUTES = 5 as const;
