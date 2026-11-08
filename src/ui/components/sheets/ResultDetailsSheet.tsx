import React from 'react';
import { BottomSheet } from './BottomSheet';
import { YearlyRecord, MilestoneWithdrawal } from '@/core/types/nisa';
import { formatYen } from '@/ui/utils/formatters';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STATUTORY_LIMITS } from '@/core/engine/constants';

interface ResultDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  yearIndex: number;
  onYearChange: (year: number) => void;
  yearlyRecords: YearlyRecord[];
  withdrawals: MilestoneWithdrawal[];
  horizonYears: number;
}

export const ResultDetailsSheet: React.FC<ResultDetailsSheetProps> = ({
  isOpen,
  onClose,
  yearIndex,
  onYearChange,
  yearlyRecords,
  withdrawals,
  horizonYears,
}) => {
  const currentRecord = yearlyRecords.find((r) => r.yearIndex === yearIndex);

  if (!currentRecord) return null;

  const totalMarketValue =
    currentRecord.holdings.tsumitate.marketValue +
    currentRecord.holdings.growth.marketValue;
  const totalPrincipal =
    currentRecord.holdings.tsumitate.principal +
    currentRecord.holdings.growth.principal;
  const tsumitateGain = Math.max(
    0,
    currentRecord.holdings.tsumitate.marketValue -
      currentRecord.holdings.tsumitate.principal
  );
  const growthGain = Math.max(
    0,
    currentRecord.holdings.growth.marketValue -
      currentRecord.holdings.growth.principal
  );

  // Withdrawals in this year
  const yearWithdrawals = withdrawals.filter((w) => w.yearIndex === yearIndex);
  const withdrawnTsumitate = yearWithdrawals
    .filter((w) => w.targetBucket === 'tsumitate')
    .reduce((sum, w) => sum + w.amount, 0);
  const withdrawnGrowth = yearWithdrawals
    .filter((w) => w.targetBucket === 'growth')
    .reduce((sum, w) => sum + w.amount, 0);
  const withdrawnProportional = yearWithdrawals
    .filter((w) => w.targetBucket === 'proportional')
    .reduce((sum, w) => sum + w.amount, 0);

  // Lifetime quota calculation
  const lifetimeUsed =
    STATUTORY_LIMITS.LIFETIME_AGGREGATE -
    currentRecord.remainingLifetimeQuota.total;

  const canGoPrev = yearIndex > 1;
  const canGoNext = yearIndex < horizonYears;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 p-1 pb-4">
        {/* Custom Header with Prev / Year / Next */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={() => canGoPrev && onYearChange(yearIndex - 1)}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="前年へ"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-body-14-semibold text-text-primary">
            {yearIndex}年目
          </span>
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => canGoNext && onYearChange(yearIndex + 1)}
            className="p-1 rounded-md text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="次年へ"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Total Holdings Hero */}
        <div className="flex flex-col items-center gap-1 text-center border-b border-border-subtle pb-4">
          <span className="text-caption-12 text-text-secondary">
            想定資産額（売却前）
          </span>
          <span className="text-display-28 text-text-primary">
            {formatYen(totalMarketValue)}
          </span>
          <span className="text-body-14 text-text-secondary">
            元本 {formatYen(totalPrincipal)} + 運用益 {formatYen(currentRecord.cumulativeGain)}
          </span>
        </div>

        {/* Section 1: 保有額 */}
        <div className="flex flex-col gap-2">
          <h4 className="text-body-14-semibold text-text-primary">
            保有額
          </h4>
          <div className="grid grid-cols-2 gap-3 bg-bg-input p-3 rounded-lg">
            <div className="flex flex-col gap-0.5">
              <span className="text-caption-12 text-text-secondary">
                積立 (評価額)
              </span>
              <span className="text-body-16 text-text-primary font-medium">
                {formatYen(currentRecord.holdings.tsumitate.marketValue)}
              </span>
              <span className="text-caption-12 text-text-muted">
                (運用益: {formatYen(tsumitateGain)})
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-caption-12 text-text-secondary">
                成長 (評価額)
              </span>
              <span className="text-body-16 text-text-primary font-medium">
                {formatYen(currentRecord.holdings.growth.marketValue)}
              </span>
              <span className="text-caption-12 text-text-muted">
                (運用益: {formatYen(growthGain)})
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: 売却予定額 */}
        <div className="flex flex-col gap-2">
          <h4 className="text-body-14-semibold text-text-primary">
            売却予定額
          </h4>
          <div className="grid grid-cols-2 gap-3 bg-bg-input p-3 rounded-lg">
            <div className="flex flex-col gap-0.5">
              <span className="text-caption-12 text-text-secondary">
                積立 (売却額)
              </span>
              <span className="text-body-16 text-text-primary font-medium">
                {formatYen(withdrawnTsumitate + (withdrawnProportional > 0 ? withdrawnProportional / 2 : 0))}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-caption-12 text-text-secondary">
                成長 (売却額)
              </span>
              <span className="text-body-16 text-text-primary font-medium">
                {formatYen(withdrawnGrowth + (withdrawnProportional > 0 ? withdrawnProportional / 2 : 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: 投資枠 */}
        <div className="flex flex-col gap-2">
          <h4 className="text-body-14-semibold text-text-primary">
            投資枠
          </h4>
          <div className="flex flex-col gap-2.5 bg-bg-input p-3 rounded-lg">
            {/* Lifetime Quota */}
            <div className="flex flex-col gap-0.5">
              <span className="text-caption-12 text-text-secondary">
                生涯投資枠（使用額）
              </span>
              <span className="text-body-16 text-text-primary font-medium">
                {formatYen(lifetimeUsed)} / {formatYen(STATUTORY_LIMITS.LIFETIME_AGGREGATE)}
              </span>
              {currentRecord.restoredPrincipalThisYear > 0 && (
                <span className="text-caption-12 text-emerald-600 font-medium">
                  ↳ 前年の売却により +{formatYen(currentRecord.restoredPrincipalThisYear)} 枠が復活
                </span>
              )}
            </div>

            {/* Annual Quota */}
            <div className="flex flex-col gap-0.5 border-t border-border-subtle pt-2">
              <span className="text-caption-12 text-text-secondary">
                年間投資枠（使用額）
              </span>
              <span className="text-body-16 text-text-primary font-medium">
                {formatYen(
                  currentRecord.annualContributions.tsumitate +
                    currentRecord.annualContributions.growth
                )}{' '}
                / {formatYen(STATUTORY_LIMITS.ANNUAL_AGGREGATE)}
              </span>
              <span className="text-caption-12 text-text-muted">
                (積立: {formatYen(currentRecord.annualContributions.tsumitate)} /{' '}
                {formatYen(STATUTORY_LIMITS.ANNUAL_TSUMITATE)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
