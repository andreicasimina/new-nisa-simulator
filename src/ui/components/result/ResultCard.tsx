import React, { useRef, useState, useLayoutEffect } from 'react';
import { cn } from '@/ui/lib/utils';
import { SimulationResult } from '@/core/types/nisa';
import { ResultCardCollapsed } from '@/ui/components/result/ResultCardCollapsed';
import { ResultCardExpanded } from '@/ui/components/result/ResultCardExpanded';

interface ResultCardProps {
  summary: SimulationResult['summary'];
  yearly: SimulationResult['yearly'];
  horizonYears: number;
  hasWithdrawals: boolean;
  isCollapsed?: boolean;
  isSticky?: boolean;
  onOpenDetails: (year?: number) => void;
  className?: string;
}

export const ResultCard = React.forwardRef<HTMLDivElement, ResultCardProps>(
  (
    {
      summary,
      yearly,
      horizonYears,
      hasWithdrawals,
      isCollapsed = false,
      isSticky = false,
      onOpenDetails,
      className,
    },
    ref
  ) => {
    const label = hasWithdrawals
      ? `${horizonYears}年目・売却後の資産額`
      : `${horizonYears}年目・資産額`;

    const lastYearRecord = yearly[yearly.length - 1];
    const tsumitateMarketValue =
      lastYearRecord?.holdings.tsumitate.marketValue ?? 0;
    const growthMarketValue = lastYearRecord?.holdings.growth.marketValue ?? 0;

    const [expandedHeight, setExpandedHeight] = useState<number>(272);
    const [collapsedHeight, setCollapsedHeight] = useState<number>(100);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const collapsedRef = useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    useLayoutEffect(() => {
      if (cardRef.current && !isCollapsed) {
        const height = cardRef.current.offsetHeight;
        if (height > 100) {
          setExpandedHeight(height);
        }
      }
      if (collapsedRef.current) {
        const height = collapsedRef.current.offsetHeight;
        if (height > 0) {
          // Inner content + 20px padding (p-2.5) + 2px border
          setCollapsedHeight(Math.max(100, height + 22));
        }
      }
    }, [summary, yearly, isCollapsed, label]);

    return (
      <div
        ref={containerRef}
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
            'bg-bg-surface border border-border-subtle rounded-lg p-2.5 overflow-hidden',
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
            <div
              ref={collapsedRef}
              className={cn(
                'w-full transition-opacity duration-200 ease-in-out',
                isCollapsed
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none absolute inset-0'
              )}
            >
              <ResultCardCollapsed
                label={label}
                totalMarketValue={summary.finalMarketValue}
                tsumitateMarketValue={tsumitateMarketValue}
                growthMarketValue={growthMarketValue}
                onOpenDetails={() => onOpenDetails()}
              />
            </div>

            {/* Expanded content with fade in/out */}
            <div
              className={cn(
                'w-full transition-opacity duration-200 ease-in-out',
                !isCollapsed
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none absolute inset-0'
              )}
            >
              <ResultCardExpanded
                label={label}
                totalMarketValue={summary.finalMarketValue}
                totalPrincipal={summary.finalPrincipal}
                totalGain={summary.finalGain}
                yearly={yearly}
                onOpenDetails={onOpenDetails}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ResultCard.displayName = 'ResultCard';
