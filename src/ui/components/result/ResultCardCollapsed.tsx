import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/ui/lib/utils';
import { formatYen } from '@/ui/utils/formatters';

interface ResultCardCollapsedProps {
  label: string;
  totalMarketValue: number;
  tsumitateMarketValue: number;
  growthMarketValue: number;
  onOpenDetails: () => void;
  className?: string;
}

export const ResultCardCollapsed: React.FC<ResultCardCollapsedProps> = ({
  label,
  totalMarketValue,
  tsumitateMarketValue,
  growthMarketValue,
  onOpenDetails,
  className,
}) => {
  return (
    <div
      onClick={onOpenDetails}
      className={cn('w-full flex flex-col items-center gap-1 cursor-pointer relative', className)}
    >
      <div className="w-full flex items-center justify-center relative">
        <p className="text-xs font-medium leading-[17px] text-gray-600">
          {label}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
          className="absolute right-0 top-0 p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="詳細を見る"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-xl font-semibold leading-[26px] tracking-tight text-gray-900">
          {formatYen(totalMarketValue)}
        </span>
        <span className="text-sm font-medium leading-[22px] text-gray-600">
          (積立 {formatYen(tsumitateMarketValue)} | 成長 {formatYen(growthMarketValue)})
        </span>
      </div>
    </div>
  );
};
