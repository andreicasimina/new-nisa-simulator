import { describe, it, expect, beforeEach } from 'vitest';
import { usePlanStore } from '@/core/store/usePlanStore';
import { DEFAULT_PLAN_STATE } from '@/core/engine/constants';

describe('usePlanStore', () => {
  beforeEach(() => {
    usePlanStore.getState().resetToDefault();
  });

  it('initializes with default plan state and simulated result', () => {
    const { plan, result } = usePlanStore.getState();
    expect(plan.tsumitateMonthly).toBe(DEFAULT_PLAN_STATE.tsumitateMonthly);
    expect(result.monthly.length).toBe(DEFAULT_PLAN_STATE.horizonYears * 12);
    expect(result.summary.finalMarketValue).toBeGreaterThan(0);
  });

  it('updates plan properties and automatically recalculates result', () => {
    const initialMarketValue = usePlanStore.getState().result.summary.finalMarketValue;

    usePlanStore.getState().updatePlan({
      growthMonthly: 100_000,
      expectedReturnRate: 0.08,
    });

    const { plan, result } = usePlanStore.getState();
    expect(plan.growthMonthly).toBe(100_000);
    expect(plan.expectedReturnRate).toBe(0.08);

    // Higher monthly contributions and returns should yield a higher final value
    expect(result.summary.finalMarketValue).toBeGreaterThan(initialMarketValue);
  });

  it('supports adding, updating, and removing milestone withdrawals', () => {
    usePlanStore.getState().addWithdrawal({
      yearIndex: 7,
      targetBucket: 'growth',
      amount: 3_000_000,
      label: 'Car Purchase',
    });

    let { plan, result } = usePlanStore.getState();
    expect(plan.withdrawals).toHaveLength(1);
    expect(plan.withdrawals[0].label).toBe('Car Purchase');
    expect(plan.withdrawals[0].id).toBeDefined();
    expect(result.milestoneImpacts).toHaveLength(1);

    const withdrawalId = plan.withdrawals[0].id;

    // Update label and amount
    usePlanStore.getState().updateWithdrawal(withdrawalId, {
      amount: 4_000_000,
      label: 'Home Renovation',
    });

    plan = usePlanStore.getState().plan;
    expect(plan.withdrawals[0].amount).toBe(4_000_000);
    expect(plan.withdrawals[0].label).toBe('Home Renovation');

    // Remove withdrawal
    usePlanStore.getState().removeWithdrawal(withdrawalId);
    plan = usePlanStore.getState().plan;
    result = usePlanStore.getState().result;

    expect(plan.withdrawals).toHaveLength(0);
    expect(result.milestoneImpacts).toHaveLength(0);
  });

  it('resets back to default state', () => {
    usePlanStore.getState().updatePlan({
      horizonYears: 40,
      tsumitateMonthly: 50_000,
    });

    usePlanStore.getState().resetToDefault();
    const { plan } = usePlanStore.getState();

    expect(plan.horizonYears).toBe(DEFAULT_PLAN_STATE.horizonYears);
    expect(plan.tsumitateMonthly).toBe(DEFAULT_PLAN_STATE.tsumitateMonthly);
  });
});
