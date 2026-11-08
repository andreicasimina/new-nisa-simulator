import React from 'react';
import { SimulationResult } from '../../core/types/nisa';
import { ResultCardCollapsed } from './result/ResultCardCollapsed';
import { ResultCardExpanded } from './result/ResultCardExpanded';

interface ResultCardProps {
  summary: SimulationResult['summary'];
  yearly: SimulationResult['yearly'];
  horizonYears: number;
  hasWithdrawals: boolean;
  isCollapsed?: boolean;
  onOpenDetails: (year?: number) => void;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  summary,
  yearly,
  horizonYears,
  hasWithdrawals,
  isCollapsed = false,
  onOpenDetails,
  className = '',
}) => {
  const label = hasWithdrawals
    ? `${horizonYears}年目・売却後の資産額`
    : `${horizonYears}年目の資産額`;

  const lastYearRecord = yearly[yearly.length - 1];
  const tsumitateMarketValue = lastYearRecord?.holdings.tsumitate.marketValue ?? 0;
  const growthMarketValue = lastYearRecord?.holdings.growth.marketValue ?? 0;

  return (
    <div
      className={`bg-white border border-[#e5e7eb] rounded-[8px] p-[10px] w-full transition-all duration-300 ease-in-out ${
        isCollapsed
          ? 'sticky top-3 z-30 shadow-[0px_4px_6px_rgba(0,0,0,0.12)]'
          : 'shadow-xs'
      } ${className}`}
    >
      {isCollapsed ? (
        <ResultCardCollapsed
          label={label}
          totalMarketValue={summary.finalMarketValue}
          tsumitateMarketValue={tsumitateMarketValue}
          growthMarketValue={growthMarketValue}
          onOpenDetails={() => onOpenDetails()}
        />
      ) : (
        <ResultCardExpanded
          label={label}
          totalMarketValue={summary.finalMarketValue}
          totalPrincipal={summary.finalPrincipal}
          totalGain={summary.finalGain}
          yearly={yearly}
          onOpenDetails={onOpenDetails}
        />
      )}
    </div>
  );
};
