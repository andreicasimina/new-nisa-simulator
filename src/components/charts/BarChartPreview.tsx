import React from 'react';
import { YearlyRecord } from '../../types/nisa';

interface BarChartPreviewProps {
  yearly: YearlyRecord[];
  selectedYear?: number;
  onSelectYear: (yearIndex: number) => void;
}

export const BarChartPreview: React.FC<BarChartPreviewProps> = ({
  yearly,
  selectedYear,
  onSelectYear,
}) => {
  if (yearly.length === 0) return null;

  // Find max value to normalize height
  const maxVal = Math.max(
    ...yearly.map(
      (y) => y.holdings.tsumitate.marketValue + y.holdings.growth.marketValue
    ),
    1
  );

  return (
    <div
      onClick={() => onSelectYear(selectedYear ?? yearly.length)}
      className="w-full h-[150px] bg-slate-50 hover:bg-slate-100/70 transition-colors border border-gray-100 rounded-[8px] p-2 flex flex-col justify-end cursor-pointer group relative overflow-hidden"
      role="button"
      tabIndex={0}
      aria-label="資産推移グラフ（タップで詳細を表示）"
    >
      <div className="absolute top-2 right-2 flex items-center gap-3 text-[10px] text-gray-500 font-medium">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" />
          運用益
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-xs bg-slate-400 inline-block" />
          元本
        </span>
      </div>

      {/* Bars container */}
      <div className="w-full h-[110px] flex items-end gap-[2px] pt-4">
        {yearly.map((record) => {
          const totalMv =
            record.holdings.tsumitate.marketValue +
            record.holdings.growth.marketValue;
          const totalPrincipal =
            record.holdings.tsumitate.principal +
            record.holdings.growth.principal;
          const gain = Math.max(0, totalMv - totalPrincipal);

          const totalHeightPercent = (totalMv / maxVal) * 100;
          const principalHeightPercent =
            totalMv > 0 ? (totalPrincipal / totalMv) * 100 : 0;
          const gainHeightPercent =
            totalMv > 0 ? (gain / totalMv) * 100 : 0;

          const isSelected = selectedYear === record.yearIndex;
          const hasWithdrawal =
            record.withdrawals.tsumitate > 0 || record.withdrawals.growth > 0;

          return (
            <div
              key={record.yearIndex}
              onClick={(e) => {
                e.stopPropagation();
                onSelectYear(record.yearIndex);
              }}
              className="flex-1 flex flex-col justify-end h-full relative group/bar"
            >
              {/* Withdrawal marker dot */}
              {hasWithdrawal && (
                <div
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white z-10"
                  title="売却あり"
                />
              )}

              {/* Stacked bar */}
              <div
                style={{ height: `${Math.max(4, totalHeightPercent)}%` }}
                className={`w-full flex flex-col justify-end rounded-t-xs overflow-hidden transition-all ${
                  isSelected ? 'ring-2 ring-emerald-500' : 'opacity-90 group-hover/bar:opacity-100'
                }`}
              >
                {/* Gain segment */}
                <div
                  style={{ height: `${gainHeightPercent}%` }}
                  className="w-full bg-emerald-500"
                />
                {/* Principal segment */}
                <div
                  style={{ height: `${principalHeightPercent}%` }}
                  className="w-full bg-slate-400"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full flex justify-between pt-1 text-[10px] text-gray-400 border-t border-gray-200">
        <span>1年目</span>
        <span>{yearly.length}年目</span>
      </div>
    </div>
  );
};
