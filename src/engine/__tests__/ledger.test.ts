import { describe, it, expect } from 'vitest';
import { simulateNisaPlan, calculateAllowedDeposit, executeWithdrawal } from '../ledger';
import { STATUTORY_LIMITS, DEFAULT_PLAN_STATE } from '../constants';
import { Holdings, MilestoneWithdrawal } from '../../types/nisa';
import { NisaPlanState } from '../../types/state';

describe('calculateAllowedDeposit', () => {
  it('allows full deposit when well within annual and lifetime caps', () => {
    const holdings: Holdings = {
      tsumitate: { principal: 0, marketValue: 0 },
      growth: { principal: 0, marketValue: 0 },
    };
    const target = { tsumitate: 100_000, growth: 100_000 };
    const annualContributed = { tsumitate: 0, growth: 0 };
    const inYearSoldQuota = { total: 0, growth: 0 };

    const allowed = calculateAllowedDeposit(holdings, target, annualContributed, inYearSoldQuota);
    expect(allowed.tsumitate).toBe(100_000);
    expect(allowed.growth).toBe(100_000);
  });

  it('clamps Tsumitate to statutory annual cap (¥1,200,000)', () => {
    const holdings: Holdings = {
      tsumitate: { principal: 1_150_000, marketValue: 1_150_000 },
      growth: { principal: 0, marketValue: 0 },
    };
    const target = { tsumitate: 100_000, growth: 0 };
    const annualContributed = { tsumitate: 1_150_000, growth: 0 };
    const inYearSoldQuota = { total: 0, growth: 0 };

    const allowed = calculateAllowedDeposit(holdings, target, annualContributed, inYearSoldQuota);
    expect(allowed.tsumitate).toBe(50_000); // Only 50k left in annual cap
  });

  it('clamps Growth to statutory annual aggregate cap (¥3,600,000 total)', () => {
    const holdings: Holdings = {
      tsumitate: { principal: 1_200_000, marketValue: 1_200_000 },
      growth: { principal: 2_350_000, marketValue: 2_350_000 },
    };
    // Tsumitate maxed out (¥1.2M), Growth at ¥2.35M (total = ¥3.55M)
    const target = { tsumitate: 0, growth: 100_000 };
    const annualContributed = { tsumitate: 1_200_000, growth: 2_350_000 };
    const inYearSoldQuota = { total: 0, growth: 0 };

    const allowed = calculateAllowedDeposit(holdings, target, annualContributed, inYearSoldQuota);
    expect(allowed.growth).toBe(50_000); // 3.6M - 3.55M = 50k
  });

  it('clamps to lifetime aggregate cap (¥18,000,000)', () => {
    const holdings: Holdings = {
      tsumitate: { principal: 6_000_000, marketValue: 10_000_000 },
      growth: { principal: 11_950_000, marketValue: 18_000_000 },
    };
    // Total principal = 17,950,000 (¥50,000 remaining until ¥18M)
    const target = { tsumitate: 100_000, growth: 100_000 };
    const annualContributed = { tsumitate: 0, growth: 0 };
    const inYearSoldQuota = { total: 0, growth: 0 };

    const allowed = calculateAllowedDeposit(holdings, target, annualContributed, inYearSoldQuota);
    expect(allowed.tsumitate).toBe(50_000); // Consumes last 50k of lifetime
    expect(allowed.growth).toBe(0); // None left for growth
  });
});

describe('executeWithdrawal', () => {
  it('correctly calculates proportional cost basis consumption during growth', () => {
    // Principal: ¥6M, Market Value: ¥10M -> cost ratio = 0.60
    const holdings: Holdings = {
      tsumitate: { principal: 0, marketValue: 0 },
      growth: { principal: 6_000_000, marketValue: 10_000_000 },
    };
    const withdrawal: MilestoneWithdrawal = {
      id: 'w1',
      yearIndex: 7,
      targetBucket: 'growth',
      amount: 5_000_000,
      label: 'Home Down Payment',
    };

    const result = executeWithdrawal(holdings, withdrawal, 7);

    // Liquidated market value: ¥5,000,000
    // Liquidated principal: ¥5,000,000 * 0.60 = ¥3,000,000
    expect(result.liquidatedHoldings.growth.marketValue).toBe(5_000_000);
    expect(result.liquidatedHoldings.growth.principal).toBe(3_000_000);

    // Remaining holdings:
    expect(holdings.growth.marketValue).toBe(5_000_000);
    expect(holdings.growth.principal).toBe(3_000_000);

    expect(result.impact.restoredYear).toBe(8); // Reinstated Year 8 Jan 1
    expect(result.impact.withdrawnPrincipal).toBe(3_000_000);
  });

  it('handles selling at a loss without exceeding 1.0 cost basis ratio', () => {
    // Invested ¥2M, but dropped to ¥1.5M (loss)
    const holdings: Holdings = {
      tsumitate: { principal: 2_000_000, marketValue: 1_500_000 },
      growth: { principal: 0, marketValue: 0 },
    };
    const withdrawal: MilestoneWithdrawal = {
      id: 'w2',
      yearIndex: 2,
      targetBucket: 'tsumitate',
      amount: 1_000_000,
      label: 'Emergency Cash',
    };

    const result = executeWithdrawal(holdings, withdrawal, 2);

    // Cost ratio is capped at 1.0 (cannot consume more principal than market cash received)
    expect(result.liquidatedHoldings.tsumitate.marketValue).toBe(1_000_000);
    expect(result.liquidatedHoldings.tsumitate.principal).toBe(1_000_000);
  });
});

describe('simulateNisaPlan', () => {
  it('maxes out ¥18M lifetime cap in exactly 5 years with ¥100k/mo Tsumitate and ¥200k/mo Growth', () => {
    const plan: NisaPlanState = {
      ...DEFAULT_PLAN_STATE,
      horizonYears: 10,
      expectedReturnRate: 0.05,
      tsumitateMonthly: 100_000, // ¥1.2M / year
      growthMonthly: 200_000,    // ¥2.4M / year -> ¥3.6M total / year
      growthAnnualLumpSum: 0,
      withdrawals: [],
    };

    const result = simulateNisaPlan(plan);

    // After 5 years (60 months), exactly 5 * ¥3.6M = ¥18,000,000 is contributed
    const month60 = result.monthly[59];
    const principalAt60 = month60.holdings.tsumitate.principal + month60.holdings.growth.principal;
    expect(principalAt60).toBe(18_000_000);
    expect(month60.remainingLifetimeQuota.total).toBe(0);

    // In month 61 onwards, no new contributions are allowed because ¥18M is reached
    const month61 = result.monthly[60];
    expect(month61.tsumitateContribution).toBe(0);
    expect(month61.growthContribution).toBe(0);
  });

  it('does not allow reusing liquidated quota in the same year, unlocks on Jan 1 of next year', () => {
    // 5 years of max contributions (reaches ¥18M in year 5)
    // Withdraws ¥3M in Year 6
    const plan: NisaPlanState = {
      ...DEFAULT_PLAN_STATE,
      horizonYears: 8,
      expectedReturnRate: 0.05,
      tsumitateMonthly: 100_000,
      growthMonthly: 200_000,
      withdrawals: [
        {
          id: 'w-y6',
          yearIndex: 6,
          targetBucket: 'growth',
          amount: 3_000_000,
          label: 'Year 6 Sale',
        },
      ],
    };

    const result = simulateNisaPlan(plan);

    // At end of Year 6 (month 72), withdrawal occurred
    const month72 = result.monthly[71];
    expect(month72.withdrawnMarketValue).toBe(3_000_000);

    // In Year 7 (months 73-84), quota is restored on Jan 1, so contributions resume!
    const month73 = result.monthly[72];
    expect(month73.restoredPrincipalThisYear).toBeGreaterThan(0);
    expect(month73.tsumitateContribution).toBe(100_000);
  });
});
