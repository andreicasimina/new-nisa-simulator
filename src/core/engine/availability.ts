import { NisaPlanState } from '@/core/types/state';
import { simulateNisaPlan } from './ledger';

/**
 * Returns the market value held in each bucket at the end of `yearIndex`,
 * after all other withdrawal events (excluding `excludeId`).
 */
export function getAvailableToWithdraw(
  plan: NisaPlanState,
  yearIndex: number,
  excludeId?: string
): { tsumitate: number; growth: number } {
  const sim = simulateNisaPlan({
    ...plan,
    withdrawals: excludeId
      ? plan.withdrawals.filter((w) => w.id !== excludeId)
      : plan.withdrawals,
  });
  const clampedIndex = Math.min(Math.max(1, yearIndex), sim.yearly.length) - 1;
  const record = sim.yearly[clampedIndex];
  return {
    tsumitate: record?.holdings.tsumitate.marketValue ?? 0,
    growth: record?.holdings.growth.marketValue ?? 0,
  };
}
