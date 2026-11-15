import { describe, it, expect } from 'vitest';
import { getAvailableToWithdraw } from '@/core/engine/availability';
import { simulateNisaPlan } from '@/core/engine/ledger';
import { DEFAULT_PLAN_STATE } from '@/core/engine/constants';
import { NisaPlanState } from '@/core/types/state';

describe('getAvailableToWithdraw', () => {
  const basePlan: NisaPlanState = {
    ...DEFAULT_PLAN_STATE,
    horizonYears: 10,
    tsumitateMonthly: 50_000,
    growthMonthly: 50_000,
    growthAnnualLumpSum: 0,
    expectedReturnRate: 0,
    withdrawals: [],
  };

  it('matches simulated year-end holdings when there are no withdrawals', () => {
    const sim = simulateNisaPlan(basePlan);
    const available = getAvailableToWithdraw(basePlan, 5);
    expect(available.tsumitate).toBe(sim.yearly[4].holdings.tsumitate.marketValue);
    expect(available.growth).toBe(sim.yearly[4].holdings.growth.marketValue);
  });

  it('reduces available amount by other withdrawals in the same or earlier years', () => {
    const planWithWithdrawals: NisaPlanState = {
      ...basePlan,
      withdrawals: [
        {
          id: 'w1',
          yearIndex: 3,
          targetBucket: 'tsumitate',
          amount: 500_000,
          label: 'earlier',
        },
        {
          id: 'w2',
          yearIndex: 5,
          targetBucket: 'growth',
          amount: 400_000,
          label: 'same-year',
        },
      ],
    };

    const available = getAvailableToWithdraw(planWithWithdrawals, 5);
    expect(available.tsumitate).toBe(50_000 * 12 * 5 - 500_000);
    expect(available.growth).toBe(50_000 * 12 * 5 - 400_000);
  });

  it('excludes the edited withdrawal by id while keeping others', () => {
    const planWithWithdrawals: NisaPlanState = {
      ...basePlan,
      withdrawals: [
        {
          id: 'w1',
          yearIndex: 5,
          targetBucket: 'tsumitate',
          amount: 500_000,
          label: 'editing',
        },
        {
          id: 'w2',
          yearIndex: 5,
          targetBucket: 'tsumitate',
          amount: 300_000,
          label: 'other',
        },
      ],
    };

    const available = getAvailableToWithdraw(planWithWithdrawals, 5, 'w1');
    expect(available.tsumitate).toBe(50_000 * 12 * 5 - 300_000);
    expect(available.growth).toBe(50_000 * 12 * 5);
  });

  it('clamps yearIndex below 1 and above horizonYears', () => {
    const sim = simulateNisaPlan(basePlan);
    expect(getAvailableToWithdraw(basePlan, 0)).toEqual({
      tsumitate: sim.yearly[0].holdings.tsumitate.marketValue,
      growth: sim.yearly[0].holdings.growth.marketValue,
    });
    expect(getAvailableToWithdraw(basePlan, 999)).toEqual({
      tsumitate: sim.yearly[9].holdings.tsumitate.marketValue,
      growth: sim.yearly[9].holdings.growth.marketValue,
    });
  });
});
