import React from 'react';
import { BottomSheet } from './BottomSheet';
import { YearlyRecord } from '@/core/types/nisa';
import { formatYen } from '@/ui/utils/formatters';
import { sumHoldings } from '@/ui/utils/holdings';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { STATUTORY_LIMITS } from '@/core/engine/constants';
import { IconButton } from '@/ui/components/common/IconButton';
import { StatCell, StatSection } from '@/ui/components/common/StatSection';

interface ResultDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  yearIndex: number;
  onYearChange: (year: number) => void;
  yearlyRecords: YearlyRecord[];
}

export const ResultDetailsSheet: React.FC<ResultDetailsSheetProps> = ({
  isOpen,
  onClose,
  yearIndex,
  onYearChange,
  yearlyRecords,
}) => {
  const currentRecord = yearlyRecords.find((r) => r.yearIndex === yearIndex);

  if (!currentRecord) return null;

  const { marketValue: totalMarketValue, principal: totalPrincipal } =
    sumHoldings(currentRecord.holdings);
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

  // Lifetime quota calculation
  const lifetimeUsed =
    STATUTORY_LIMITS.LIFETIME_AGGREGATE -
    currentRecord.remainingLifetimeQuota.total;

  const canGoPrev = yearIndex > 1;
  const canGoNext = yearIndex < yearlyRecords.length;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-[10px]">
        {/* Custom Header with Prev / Year / Next */}
        <div className="flex items-center justify-center gap-1">
          <IconButton
            tone="secondary"
            disabled={!canGoPrev}
            onClick={() => canGoPrev && onYearChange(yearIndex - 1)}
            aria-label="前年へ"
          >
            <ChevronLeft className="size-3" />
          </IconButton>
          <span className="text-body-14-semibold text-text-primary">
            {yearIndex}年目
          </span>
          <IconButton
            tone="secondary"
            disabled={!canGoNext}
            onClick={() => canGoNext && onYearChange(yearIndex + 1)}
            aria-label="次年へ"
          >
            <ChevronRight className="size-3" />
          </IconButton>
        </div>

        {/* Total Holdings Hero */}
        <span className="text-caption-12 text-text-secondary text-center">
          想定資産額（売却前）
        </span>
        <div className="flex flex-col items-center gap-[9px] text-center">
          <span className="text-display-28 text-text-primary">
            {formatYen(totalMarketValue)}
          </span>
          <span className="text-body-14 text-text-secondary">
            元本 {formatYen(totalPrincipal)} + 運用益 {formatYen(currentRecord.cumulativeGain)}
          </span>
        </div>

        <div className="mt-[6px] flex flex-col gap-4">
        {/* Section 1: 保有額 */}
        <StatSection title="保有額">
          <StatCell
            label="積立 (評価額)"
            value={formatYen(currentRecord.holdings.tsumitate.marketValue)}
            sub={`(運用益: ${formatYen(tsumitateGain)})`}
          />
          <StatCell
            label="成長 (評価額)"
            value={formatYen(currentRecord.holdings.growth.marketValue)}
            sub={`(運用益: ${formatYen(growthGain)})`}
          />
        </StatSection>

        <div className="h-px w-full shrink-0 rounded-full bg-border-subtle" />

        {/* Section 2: 売却予定額 */}
        <StatSection title="売却予定額">
          <StatCell
            label="積立 (評価額)"
            value={formatYen(currentRecord.withdrawals.tsumitate)}
          />
          <StatCell
            label="成長 (評価額)"
            value={formatYen(currentRecord.withdrawals.growth)}
          />
        </StatSection>

        <div className="h-px w-full shrink-0 rounded-full bg-border-subtle" />

        {/* Section 3: 投資枠 */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-body-14-semibold text-text-primary">年間投資枠（使用額）</h4>
            <div className="flex flex-wrap gap-1">
              <span className="text-body-16 text-text-primary font-medium">
                {`${formatYen(
                  currentRecord.annualContributions.tsumitate +
                    currentRecord.annualContributions.growth
                )} / ${formatYen(STATUTORY_LIMITS.ANNUAL_AGGREGATE)}`}
              </span>
              <span className="text-body-14 text-text-secondary">
                {`(積立使用額: ${formatYen(currentRecord.annualContributions.tsumitate)} / ${formatYen(STATUTORY_LIMITS.ANNUAL_TSUMITATE)})`}
              </span>
            </div>
          </div>
          <div className="h-px w-full shrink-0 rounded-full bg-border-subtle" />
          <div className="flex flex-col gap-1">
            <h4 className="text-body-14-semibold text-text-primary">生涯投資枠（使用額）</h4>
            <span className="text-body-16 text-text-primary font-medium">
              {`${formatYen(lifetimeUsed)} / ${formatYen(STATUTORY_LIMITS.LIFETIME_AGGREGATE)}`}
            </span>
            {currentRecord.restoredPrincipalThisYear > 0 && (
              <span className="text-body-14 text-gain">
                {`↳ 前年の売却により +${formatYen(currentRecord.restoredPrincipalThisYear)} 枠が復活`}
              </span>
            )}
          </div>
        </div>
        </div>
      </div>
    </BottomSheet>
  );
};
