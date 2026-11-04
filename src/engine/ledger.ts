import { STATUTORY_LIMITS } from './constants';
import { NisaPlanState } from '../types/state';
import {
  BucketAmount,
  Holdings,
  MilestoneImpact,
  MilestoneWithdrawal,
  MonthlyRecord,
  SimulationResult,
} from '../types/nisa';

const MONTHS_PER_YEAR = 12;

export function calculateAllowedDeposit(
  currentHoldings: Holdings,
  requestedDeposit: BucketAmount,
  annualContributed: BucketAmount,
  // TODO: Create a Quota class/type to encapsulate quota calculations and tracking across buckets.
  inYearSoldQuota: { total: number; growth: number }
): BucketAmount {
  const occupiedLifetimeTotalQuota =
    currentHoldings.tsumitate.principal + currentHoldings.growth.principal + inYearSoldQuota.total;
  const occupiedLifetimeGrowthQuota =
    currentHoldings.growth.principal + inYearSoldQuota.growth;

  const remainingLifetimeTotalQuota = Math.max(
    0,
    STATUTORY_LIMITS.LIFETIME_AGGREGATE - occupiedLifetimeTotalQuota
  );
  const remainingLifetimeGrowthQuota = Math.max(
    0,
    STATUTORY_LIMITS.LIFETIME_GROWTH - occupiedLifetimeGrowthQuota
  );

  const remainingAnnualAggregateQuota = Math.max(
    0,
    STATUTORY_LIMITS.ANNUAL_AGGREGATE - (annualContributed.tsumitate + annualContributed.growth)
  );
  const remainingAnnualTsumitateQuota = Math.max(
    0,
    STATUTORY_LIMITS.ANNUAL_TSUMITATE - annualContributed.tsumitate
  );
  const remainingAnnualGrowthQuota = Math.max(
    0,
    STATUTORY_LIMITS.ANNUAL_GROWTH - annualContributed.growth
  );

  // Tsumitate takes first priority under aggregate limits
  const allowedTsumitate = Math.min(
    requestedDeposit.tsumitate,
    remainingLifetimeTotalQuota,
    remainingAnnualTsumitateQuota,
    remainingAnnualAggregateQuota
  );

  // Remaining aggregate headroom for Growth after Tsumitate
  const remainingLifetimeTotalAfterTsumitate =
    remainingLifetimeTotalQuota - allowedTsumitate;
  const remainingAnnualAggregateAfterTsumitate =
    remainingAnnualAggregateQuota - allowedTsumitate;

  const allowedGrowth = Math.min(
    requestedDeposit.growth,
    remainingLifetimeTotalAfterTsumitate,
    remainingLifetimeGrowthQuota,
    remainingAnnualGrowthQuota,
    remainingAnnualAggregateAfterTsumitate
  );

  return {
    tsumitate: allowedTsumitate,
    growth: allowedGrowth,
  };
}

export function executeWithdrawal(
  currentHoldings: Holdings,
  withdrawal: MilestoneWithdrawal,
  yearIndex: number
): {
  liquidatedHoldings: Holdings;
  impact: MilestoneImpact;
} {
  let targetTsumitateMarket = 0;
  let targetGrowthMarket = 0;

  if (withdrawal.targetBucket === 'growth') {
    targetGrowthMarket = Math.min(withdrawal.amount, currentHoldings.growth.marketValue);
  } else if (withdrawal.targetBucket === 'tsumitate') {
    targetTsumitateMarket = Math.min(withdrawal.amount, currentHoldings.tsumitate.marketValue);
  } else {
    const totalMarketValue = currentHoldings.tsumitate.marketValue + currentHoldings.growth.marketValue;
    if (totalMarketValue > 0) {
      targetTsumitateMarket = Math.min(
        withdrawal.amount * (currentHoldings.tsumitate.marketValue / totalMarketValue),
        currentHoldings.tsumitate.marketValue
      );
      targetGrowthMarket = Math.min(
        withdrawal.amount * (currentHoldings.growth.marketValue / totalMarketValue),
        currentHoldings.growth.marketValue
      );
    }
  }

  const tsumitateCostBasisRatio =
    currentHoldings.tsumitate.marketValue > 0
      ? Math.min(1.0, currentHoldings.tsumitate.principal / currentHoldings.tsumitate.marketValue)
      : 1.0;
  const growthCostBasisRatio =
    currentHoldings.growth.marketValue > 0
      ? Math.min(1.0, currentHoldings.growth.principal / currentHoldings.growth.marketValue)
      : 1.0;

  const tsumitatePrincipalConsumed = Math.min(
    currentHoldings.tsumitate.principal,
    targetTsumitateMarket * tsumitateCostBasisRatio
  );
  const growthPrincipalConsumed = Math.min(
    currentHoldings.growth.principal,
    targetGrowthMarket * growthCostBasisRatio
  );

  const liquidatedHoldings: Holdings = {
    tsumitate: {
      principal: tsumitatePrincipalConsumed,
      marketValue: targetTsumitateMarket,
    },
    growth: {
      principal: growthPrincipalConsumed,
      marketValue: targetGrowthMarket,
    },
  };

  currentHoldings.tsumitate.principal -= liquidatedHoldings.tsumitate.principal;
  currentHoldings.tsumitate.marketValue -= liquidatedHoldings.tsumitate.marketValue;
  currentHoldings.growth.principal -= liquidatedHoldings.growth.principal;
  currentHoldings.growth.marketValue -= liquidatedHoldings.growth.marketValue;

  const totalMarketWithdrawn =
    liquidatedHoldings.tsumitate.marketValue + liquidatedHoldings.growth.marketValue;
  const totalPrincipalWithdrawn =
    liquidatedHoldings.tsumitate.principal + liquidatedHoldings.growth.principal;

  const impact: MilestoneImpact = {
    milestone: withdrawal,
    withdrawnMarketValue: totalMarketWithdrawn,
    withdrawnPrincipal: totalPrincipalWithdrawn,
    restoredYear: yearIndex + 1,
    paybackYear: null,
  };

  return {
    liquidatedHoldings,
    impact,
  };
}

export function simulateNisaPlan(state: NisaPlanState): SimulationResult {
  const monthlyRate = Math.pow(1 + state.expectedReturnRate, 1 / MONTHS_PER_YEAR) - 1;

  const currentHoldings: Holdings = {
    tsumitate: { ...state.initialHoldings.tsumitate },
    growth: { ...state.initialHoldings.growth },
  };

  const inYearSoldQuota = { total: 0, growth: 0 };
  let restoredPrincipalThisYear = 0;

  const monthlyRecords: MonthlyRecord[] = [];
  const milestoneImpacts: MilestoneImpact[] = [];

  const withdrawalsByYear = new Map<number, MilestoneWithdrawal[]>();
  for (const withdrawal of state.withdrawals) {
    const list = withdrawalsByYear.get(withdrawal.yearIndex) ?? [];
    list.push(withdrawal);
    withdrawalsByYear.set(withdrawal.yearIndex, list);
  }

  let monthIndex = 1;

  for (let yearIndex = 1; yearIndex <= state.horizonYears; yearIndex++) {
    // January 1st: Quota from previous calendar year sales becomes available
    restoredPrincipalThisYear = inYearSoldQuota.total;
    inYearSoldQuota.total = 0;
    inYearSoldQuota.growth = 0;

    const annualContributed: BucketAmount = { tsumitate: 0, growth: 0 };

    for (let monthInYear = 1; monthInYear <= MONTHS_PER_YEAR; monthInYear++) {
      const requestedDeposit: BucketAmount = {
        tsumitate: state.tsumitateMonthly,
        growth: state.growthMonthly + (monthInYear === 1 ? state.growthAnnualLumpSum : 0),
      };

      const allowedDeposit = calculateAllowedDeposit(
        currentHoldings,
        requestedDeposit,
        annualContributed,
        inYearSoldQuota
      );

      currentHoldings.tsumitate.principal += allowedDeposit.tsumitate;
      currentHoldings.tsumitate.marketValue += allowedDeposit.tsumitate;
      annualContributed.tsumitate += allowedDeposit.tsumitate;

      currentHoldings.growth.principal += allowedDeposit.growth;
      currentHoldings.growth.marketValue += allowedDeposit.growth;
      annualContributed.growth += allowedDeposit.growth;

      // Compound monthly growth
      currentHoldings.tsumitate.marketValue *= (1 + monthlyRate);
      currentHoldings.growth.marketValue *= (1 + monthlyRate);

      const totalPrincipal = currentHoldings.tsumitate.principal + currentHoldings.growth.principal;
      const totalMarketValue = currentHoldings.tsumitate.marketValue + currentHoldings.growth.marketValue;
      const cumulativeGain = Math.max(0, totalMarketValue - totalPrincipal);

      monthlyRecords.push({
        monthIndex,
        yearIndex,
        tsumitateContribution: allowedDeposit.tsumitate,
        growthContribution: allowedDeposit.growth,
        withdrawnMarketValue: 0,
        withdrawnPrincipal: 0,
        holdings: {
          tsumitate: { ...currentHoldings.tsumitate },
          growth: { ...currentHoldings.growth },
        },
        cumulativeGain,
        taxSaved: cumulativeGain * STATUTORY_LIMITS.TAX_RATE,
        remainingLifetimeQuota: {
          total: Math.max(0, STATUTORY_LIMITS.LIFETIME_AGGREGATE - (totalPrincipal + inYearSoldQuota.total)),
          growth: Math.max(0, STATUTORY_LIMITS.LIFETIME_GROWTH - (currentHoldings.growth.principal + inYearSoldQuota.growth)),
        },
        restoredPrincipalThisYear,
      });

      restoredPrincipalThisYear = 0;
      monthIndex++;
    }

    // Process milestone liquidations scheduled for this year (applied at month 12)
    const yearlyWithdrawals = withdrawalsByYear.get(yearIndex);
    if (yearlyWithdrawals && yearlyWithdrawals.length > 0) {
      const lastMonthRecord = monthlyRecords[monthlyRecords.length - 1];

      for (const withdrawal of yearlyWithdrawals) {
        const sale = executeWithdrawal(currentHoldings, withdrawal, yearIndex);

        const liquidatedTotalPrincipal =
          sale.liquidatedHoldings.tsumitate.principal + sale.liquidatedHoldings.growth.principal;
        const liquidatedTotalMarket =
          sale.liquidatedHoldings.tsumitate.marketValue + sale.liquidatedHoldings.growth.marketValue;

        inYearSoldQuota.total += liquidatedTotalPrincipal;
        inYearSoldQuota.growth += sale.liquidatedHoldings.growth.principal;

        lastMonthRecord.withdrawnMarketValue += liquidatedTotalMarket;
        lastMonthRecord.withdrawnPrincipal += liquidatedTotalPrincipal;

        milestoneImpacts.push(sale.impact);
      }

      lastMonthRecord.holdings = {
        tsumitate: { ...currentHoldings.tsumitate },
        growth: { ...currentHoldings.growth },
      };

      const finalPrincipal = currentHoldings.tsumitate.principal + currentHoldings.growth.principal;
      const finalMarketValue = currentHoldings.tsumitate.marketValue + currentHoldings.growth.marketValue;
      const gainAfterSale = Math.max(0, finalMarketValue - finalPrincipal);

      lastMonthRecord.cumulativeGain = gainAfterSale;
      lastMonthRecord.taxSaved = gainAfterSale * STATUTORY_LIMITS.TAX_RATE;
      lastMonthRecord.remainingLifetimeQuota = {
        total: Math.max(0, STATUTORY_LIMITS.LIFETIME_AGGREGATE - (finalPrincipal + inYearSoldQuota.total)),
        growth: Math.max(0, STATUTORY_LIMITS.LIFETIME_GROWTH - (currentHoldings.growth.principal + inYearSoldQuota.growth)),
      };
    }
  }

  // Calculate payback years for milestones
  const annualSavingsPace =
    (state.tsumitateMonthly + state.growthMonthly) * MONTHS_PER_YEAR + state.growthAnnualLumpSum;

  for (const impact of milestoneImpacts) {
    const restoredYear = impact.restoredYear;
    let paybackYear: number | null = null;

    // Check when lifetime quota fills back to capacity
    for (let year = restoredYear; year <= state.horizonYears; year++) {
      const yearEndRecord = monthlyRecords[year * MONTHS_PER_YEAR - 1];
      if (yearEndRecord && yearEndRecord.remainingLifetimeQuota.total === 0) {
        paybackYear = year;
        break;
      }
    }

    // If quota never hits capacity, estimate by annual savings pace
    if (paybackYear === null && annualSavingsPace > 0) {
      const yearsNeeded = Math.ceil(impact.withdrawnPrincipal / annualSavingsPace);
      const estimatedYear = restoredYear + yearsNeeded - 1;
      if (estimatedYear <= state.horizonYears) {
        paybackYear = estimatedYear;
      }
    }

    impact.paybackYear = paybackYear;
  }

  const finalRecord = monthlyRecords[monthlyRecords.length - 1];
  const finalPrincipal = finalRecord.holdings.tsumitate.principal + finalRecord.holdings.growth.principal;
  const finalMarketValue = finalRecord.holdings.tsumitate.marketValue + finalRecord.holdings.growth.marketValue;
  const finalGain = Math.max(0, finalMarketValue - finalPrincipal);

  let totalContributions = 0;
  let totalWithdrawnMarketValue = 0;
  let totalWithdrawnPrincipal = 0;

  for (const record of monthlyRecords) {
    totalContributions += record.tsumitateContribution + record.growthContribution;
    totalWithdrawnMarketValue += record.withdrawnMarketValue;
    totalWithdrawnPrincipal += record.withdrawnPrincipal;
  }

  return {
    monthly: monthlyRecords,
    milestoneImpacts,
    summary: {
      finalMarketValue,
      finalPrincipal,
      finalGain,
      finalTaxSaved: finalGain * STATUTORY_LIMITS.TAX_RATE,
      totalContributions,
      totalWithdrawnMarketValue,
      totalWithdrawnPrincipal,
      lifetimeQuotaRemaining: finalRecord.remainingLifetimeQuota.total,
    },
  };
}
