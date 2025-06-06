export enum OddsType {
  AUTO = 1,
  CREATOR = 2,
}

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

export const GRACE_DAYS_DEADLINE_CROWD_WINNING_OUT = 7 as const;
export const GRACE_DAYS_DEADLINE_HOST_WINNING_OUT = 10 as const;
