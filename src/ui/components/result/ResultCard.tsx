import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { cn } from '@/ui/lib/utils';
import { SimulationResult } from '@/core/types/nisa';
import { NisaPlanState } from '@/core/types/state';
import { ResultCardCollapsed } from '@/ui/components/result/ResultCardCollapsed';
import { ResultCardExpanded } from '@/ui/components/result/ResultCardExpanded';

export interface ResultCardHeights {
  expanded: number;
  collapsed: number;
}

/** Used until the card has been measured. */
export const DEFAULT_CARD_HEIGHTS: ResultCardHeights = { expanded: 512, collapsed: 100 };

interface ResultCardProps {
  summary: SimulationResult['summary'];
  yearly: SimulationResult['yearly'];
  horizonYears: number;
  hasWithdrawals: boolean;
  plan: NisaPlanState;
  isCollapsed?: boolean;
  isSticky?: boolean;
  onOpenDetails: (year?: number) => void;
  /** Reports the measured expanded/collapsed card heights (incl. padding and border). */
  onHeightsChange?: (heights: ResultCardHeights) => void;
  className?: string;
}

const fadeClass = (visible: boolean) =>
  cn(
    'w-full transition-opacity duration-200 ease-in-out',
    visible
      ? 'opacity-100 pointer-events-auto'
      : 'opacity-0 pointer-events-none absolute inset-x-0 top-0'
  );

export const ResultCard: React.FC<ResultCardProps> = ({
  summary,
  yearly,
  horizonYears,
  hasWithdrawals,
  plan,
  isCollapsed = false,
  isSticky = false,
  onOpenDetails,
  onHeightsChange,
  className,
}) => {
  const label = hasWithdrawals
    ? `${horizonYears}年目・売却後の資産額`
    : `${horizonYears}年目・資産額`;

  const lastYearRecord = yearly[yearly.length - 1];
  const tsumitateMarketValue =
    lastYearRecord?.holdings.tsumitate.marketValue ?? 0;
  const growthMarketValue = lastYearRecord?.holdings.growth.marketValue ?? 0;

  const [expandedHeight, setExpandedHeight] = useState<number>(DEFAULT_CARD_HEIGHTS.expanded);
  const [collapsedHeight, setCollapsedHeight] = useState<number>(DEFAULT_CARD_HEIGHTS.collapsed);
  const cardRef = useRef<HTMLDivElement>(null);
  const collapsedRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

    // Measure both contents continuously. The hidden one is pinned to the top
    // (not stretched), so its offsetHeight is always its natural height.
    useLayoutEffect(() => {
      const card = cardRef.current;
      const collapsed = collapsedRef.current;
      const expanded = expandedRef.current;
      if (!card || !collapsed || !expanded) return;

      const measure = () => {
        const style = getComputedStyle(card);
        const chrome =
          parseFloat(style.paddingTop) +
          parseFloat(style.paddingBottom) +
          parseFloat(style.borderTopWidth) +
          parseFloat(style.borderBottomWidth);
        setExpandedHeight(expanded.offsetHeight + chrome);
        setCollapsedHeight(collapsed.offsetHeight + chrome);
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(collapsed);
      observer.observe(expanded);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      onHeightsChange?.({ expanded: expandedHeight, collapsed: collapsedHeight });
    }, [expandedHeight, collapsedHeight, onHeightsChange]);

    return (
      <div
        className={cn('w-full relative flex flex-col justify-end', className)}
        style={{ height: expandedHeight }}
      >
        {/* Placeholder spacer when fixed/sticky so container height stays intact */}
        {isSticky && (
          <div
            style={{ height: collapsedHeight }}
            className="w-full pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* The persistent morphing card */}
        <div
          ref={cardRef}
          className={cn(
            'card p-2.5 overflow-hidden',
            'transition-[height,box-shadow] duration-300 ease-in-out',
            isSticky
              ? 'fixed top-3 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[361px] z-30 shadow-md'
              : 'w-full shadow-none'
          )}
          style={{
            height: isCollapsed ? collapsedHeight : expandedHeight,
          }}
        >
          <div className="relative w-full h-full">
            {/* Collapsed content with fade in/out */}
            <div ref={collapsedRef} className={fadeClass(isCollapsed)}>
              <ResultCardCollapsed
                label={label}
                totalMarketValue={summary.finalMarketValue}
                tsumitateMarketValue={tsumitateMarketValue}
                growthMarketValue={growthMarketValue}
                onOpenDetails={() => onOpenDetails()}
              />
            </div>

            {/* Expanded content with fade in/out */}
            <div ref={expandedRef} className={fadeClass(!isCollapsed)}>
              <ResultCardExpanded
                label={label}
                totalMarketValue={summary.finalMarketValue}
                totalPrincipal={summary.finalPrincipal}
                totalGain={summary.finalGain}
                yearly={yearly}
                plan={plan}
                onOpenDetails={onOpenDetails}
              />
            </div>
          </div>
        </div>
      </div>
    );
};
