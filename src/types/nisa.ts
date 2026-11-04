export type BucketType = 'tsumitate' | 'growth' | 'proportional';

export interface MilestoneWithdrawal {
  id: string;
  yearIndex: number;
  targetBucket: BucketType;
  amount: number;
  label: string;
}

export interface BucketBalance {
  principal: number;
  marketValue: number;
}

export interface Holdings {
  tsumitate: BucketBalance;
  growth: BucketBalance;
}

export interface MonthlyRecord {
  monthIndex: number;
  yearIndex: number;

  tsumitateContribution: number;
  growthContribution: number;
  withdrawnMarketValue: number;
  withdrawnPrincipal: number;

  holdings: Holdings;

  // Cumulative unrealized profit (totalMarketValue - totalPrincipal)
  cumulativeGain: number;
  // Tax savings based on Japan's standard 20.315% capital gains tax
  taxSaved: number;

  // Remaining lifetime quota space (subject to statutory ¥18M total and ¥12M growth caps)
  remainingLifetimeQuota: {
    total: number;
    growth: number;
  };

  // Quota restored on Jan 1 of this year from previous year liquidations
  restoredPrincipalThisYear: number;
}

export interface MilestoneImpact {
  milestone: MilestoneWithdrawal;
  withdrawnMarketValue: number;
  withdrawnPrincipal: number;
  restoredYear: number;
  paybackYear: number | null;
}

export interface SimulationResult {
  monthly: MonthlyRecord[];
  milestoneImpacts: MilestoneImpact[];
  summary: {
    finalMarketValue: number;
    finalPrincipal: number;
    finalGain: number;
    finalTaxSaved: number;
    totalContributions: number;
    totalWithdrawnMarketValue: number;
    totalWithdrawnPrincipal: number;
    lifetimeQuotaRemaining: number;
  };
}
