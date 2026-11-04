import { Holdings, MilestoneWithdrawal } from './nisa';

export interface NisaPlanState {
  age: number;
  horizonYears: number;
  expectedReturnRate: number;
  tsumitateMonthly: number;
  growthMonthly: number;
  growthAnnualLumpSum: number;
  initialHoldings: Holdings;
  withdrawals: MilestoneWithdrawal[];
}
