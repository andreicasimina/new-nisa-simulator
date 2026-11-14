import { NisaPlanState } from '@/core/types/state';

export const STATUTORY_LIMITS = {
  ANNUAL_AGGREGATE: 3_600_000,
  ANNUAL_TSUMITATE: 1_200_000,
  ANNUAL_GROWTH: 2_400_000,
  LIFETIME_AGGREGATE: 18_000_000,
  LIFETIME_GROWTH: 12_000_000,
  TAX_RATE: 0.20315,
} as const;

export const DEFAULT_PLAN_STATE: NisaPlanState = {
  age: 30,
  horizonYears: 30,
  expectedReturnRate: 0.05,
  tsumitateMonthly: 100_000,
  growthMonthly: 0,
  growthAnnualLumpSum: 0,
  initialHoldings: {
    tsumitate: { principal: 0, marketValue: 0 },
    growth: { principal: 0, marketValue: 0 },
  },
  withdrawals: [],
};

export const DEFAULT_WITHDRAWAL = {
  YEAR_INDEX: 10,
  AMOUNT: 1_000_000,
  TARGET_BUCKET: 'growth',
} as const;
