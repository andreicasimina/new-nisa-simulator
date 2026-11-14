import { Holdings } from '@/core/types/nisa';

export interface HoldingsSummary {
  marketValue: number;
  principal: number;
  gain: number;
}

/**
 * Sums market value, principal, and unrealized gain across both NISA buckets.
 */
export function sumHoldings(holdings: Holdings): HoldingsSummary {
  const marketValue =
    holdings.tsumitate.marketValue + holdings.growth.marketValue;
  const principal = holdings.tsumitate.principal + holdings.growth.principal;
  const gain = Math.max(0, marketValue - principal);
  return { marketValue, principal, gain };
}
