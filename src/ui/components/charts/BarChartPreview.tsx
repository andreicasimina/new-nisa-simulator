import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/ui/lib/utils';
import { YearlyRecord } from '@/core/types/nisa';
import { formatYen } from '@/ui/utils/formatters';
import { sumHoldings } from '@/ui/utils/holdings';
import { niceValueAxis } from '@/ui/utils/chartScale';

type ChartMode = 'detailed' | 'all';

/** Number of years shown per page in 詳細 mode. */
const YEARS_PER_PAGE = 5;
/** Minimum vertical space per Y-axis interval so labels never overlap. */
const MIN_TICK_SPACING_PX = 20;
const FALLBACK_PLOT_HEIGHT_PX = 204;

/** Bar colours, shared by the bars and the legend. */
const CHART_COLORS = {
  principal: 'bg-principal/40',
  principalHover: 'group-hover/bar:bg-principal/60',
  gain: 'bg-gain/40',
  gainHover: 'group-hover/bar:bg-gain/60',
  withdrawal: 'bg-withdrawal/40',
  withdrawalHover: 'group-hover/bar:bg-withdrawal/60',
} as const;

const LEGEND_ITEMS = [
  { label: '元本', color: CHART_COLORS.principal },
  { label: '運用益', color: CHART_COLORS.gain },
  { label: '売却', color: CHART_COLORS.withdrawal },
] as const;

interface ChartBar {
  yearIndex: number;
  marketValue: number;
  principal: number;
  gain: number;
  withdrawal: number;
  /** Post-withdrawal balance plus the amount withdrawn that year. */
  totalHeightValue: number;
}

interface BarChartPreviewProps {
  yearly: YearlyRecord[];
  onSelectYear: (yearIndex: number) => void;
  className?: string;
}

const toBar = (record: YearlyRecord): ChartBar => {
  const { marketValue, principal: rawPrincipal, gain } = sumHoldings(record.holdings);
  const principal = Math.min(rawPrincipal, marketValue);
  const withdrawal = record.withdrawals.tsumitate + record.withdrawals.growth;

  return {
    yearIndex: record.yearIndex,
    marketValue,
    principal,
    gain,
    withdrawal,
    totalHeightValue: marketValue + withdrawal,
  };
};

const yearLabel = (yearIndex: number) => `${yearIndex}年目`;

/** `part` as a percentage of `whole` (0 when `whole` is 0). */
const shareOf = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0);

/** Tracks an element's content-box height. */
function useElementHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setHeight(el.clientHeight);
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, height] as const;
}

export const BarChartPreview: React.FC<BarChartPreviewProps> = ({
  yearly,
  onSelectYear,
  className,
}) => {
  const [mode, setMode] = useState<ChartMode>('all');
  const [page, setPage] = useState(0);
  const [plotRef, plotHeight] = useElementHeight<HTMLDivElement>();

  const bars = useMemo<ChartBar[]>(() => yearly.map(toBar), [yearly]);

  if (bars.length === 0) return null;

  const pageCount = Math.max(1, Math.ceil(bars.length / YEARS_PER_PAGE));
  const currentPage = Math.min(page, pageCount - 1);
  const isDetailed = mode === 'detailed';

  const visibleBars = isDetailed
    ? bars.slice(currentPage * YEARS_PER_PAGE, (currentPage + 1) * YEARS_PER_PAGE)
    : bars;
  // Keep a fixed number of slots on the last (partial) page so bar widths stay consistent
  const slotCount = isDetailed ? YEARS_PER_PAGE : bars.length;
  const firstBar = visibleBars[0];
  const lastBar = visibleBars[visibleBars.length - 1];

  const axis = niceValueAxis(
    Math.max(0, ...visibleBars.map((b) => b.totalHeightValue)),
    Math.floor((plotHeight || FALLBACK_PLOT_HEIGHT_PX) / MIN_TICK_SPACING_PX)
  );
  const toPercent = (value: number) => (value / axis.max) * 100;

  const goToPage = (next: number) =>
    setPage(Math.min(Math.max(next, 0), pageCount - 1));

  return (
    <div className={cn('w-full flex flex-col items-center gap-[5px]', className)}>
      {/* Title / page navigation */}
      <div className="w-full flex items-center justify-center gap-2.5">
        {isDetailed && (
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="p-0.5 -m-0.5 text-text-primary disabled:opacity-30 transition-opacity"
            aria-label="前の期間"
          >
            <ChevronLeft className="size-[15px]" strokeWidth={2.5} />
          </button>
        )}
        <p className="text-caption-12-bold text-text-primary whitespace-nowrap" aria-live="polite">
          {yearLabel(firstBar.yearIndex)} ~ {yearLabel(lastBar.yearIndex)}
        </p>
        {isDetailed && (
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
            className="p-0.5 -m-0.5 text-text-primary disabled:opacity-30 transition-opacity"
            aria-label="次の期間"
          >
            <ChevronRight className="size-[15px]" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="w-full flex items-center justify-center gap-2.5 text-caption-10-bold text-text-secondary">
        {LEGEND_ITEMS.map(({ label, color }) => (
          <span key={label} className="flex items-center gap-[5px]">
            <span className={cn('size-2.5 shrink-0', color)} />
            {label}
          </span>
        ))}
      </div>

      {/* Plot + Y labels (right) + X labels (bottom) */}
      <div className="w-full grid grid-cols-[minmax(0,1fr)_auto] gap-x-[5px] gap-y-[3px]">
        <div
          ref={plotRef}
          className="relative h-51 bg-bg-canvas border-b border-r border-text-muted"
        >
          <div className="absolute inset-0 flex items-end">
            {Array.from({ length: slotCount }, (_, i) => {
              const bar = visibleBars[i];
              if (!bar) return <div key={`empty-${i}`} className="flex-1" />;

              const barHeight = toPercent(bar.totalHeightValue);
              const ariaSummary =
                bar.withdrawal > 0
                  ? `${formatYen(bar.marketValue)}、売却 ${formatYen(bar.withdrawal)}`
                  : formatYen(bar.marketValue);

              return (
                <button
                  key={bar.yearIndex}
                  type="button"
                  onClick={() => onSelectYear(bar.yearIndex)}
                  aria-label={`${yearLabel(bar.yearIndex)}の詳細を見る（${ariaSummary}）`}
                  className="group/bar relative flex-1 min-w-0 h-full flex flex-col justify-end items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-gain"
                >
                  <span
                    className={cn('flex flex-col', isDetailed ? 'w-[58%]' : 'w-full')}
                    style={{ height: `${barHeight}%` }}
                  >
                    {bar.withdrawal > 0 && (
                      <span
                        className={cn(
                          'w-full transition-colors',
                          CHART_COLORS.withdrawal,
                          CHART_COLORS.withdrawalHover
                        )}
                        style={{ height: `${shareOf(bar.withdrawal, bar.totalHeightValue)}%` }}
                      />
                    )}
                    <span
                      className={cn('w-full transition-colors', CHART_COLORS.gain, CHART_COLORS.gainHover)}
                      style={{ height: `${shareOf(bar.gain, bar.totalHeightValue)}%` }}
                    />
                    <span
                      className={cn(
                        'w-full transition-colors',
                        CHART_COLORS.principal,
                        CHART_COLORS.principalHover
                      )}
                      style={{ height: `${shareOf(bar.principal, bar.totalHeightValue)}%` }}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Y labels: the hidden widest label sizes the column, the rest are positioned on their ticks */}
        <div className="relative text-caption-10 text-text-primary whitespace-nowrap" aria-hidden="true">
          <span className="invisible block h-0">{formatYen(axis.max)}</span>
          {axis.ticks.map((tick) => (
            <span
              key={tick}
              className="absolute left-0 translate-y-1/2"
              style={{ bottom: `${toPercent(tick)}%` }}
            >
              {formatYen(tick)}
            </span>
          ))}
        </div>

        {/* X labels */}
        <div className="flex text-caption-10 text-text-primary whitespace-nowrap" aria-hidden="true">
          {isDetailed ? (
            Array.from({ length: slotCount }, (_, i) => (
              <span key={i} className="flex-1 min-w-0 text-center">
                {visibleBars[i] ? yearLabel(visibleBars[i].yearIndex) : ''}
              </span>
            ))
          ) : (
            <span className="w-full flex justify-between">
              <span>{yearLabel(firstBar.yearIndex)}</span>
              <span>{yearLabel(lastBar.yearIndex)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center gap-[5px] p-[3px] border border-border-subtle rounded-lg">
          {(
            [
              ['detailed', '詳細'],
              ['all', '全体'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-pressed={mode === value}
              className={cn(
                'px-[5px] py-[2px] rounded-lg text-body-14 whitespace-nowrap transition-colors',
                mode === value
                  ? 'bg-border-subtle text-text-secondary font-bold'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
