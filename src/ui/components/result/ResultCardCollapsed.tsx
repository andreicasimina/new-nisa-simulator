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
      className={cn(
        'w-full flex flex-col gap-[9px] items-center cursor-pointer relative',
        className
      )}
    >
      <p className="text-caption-12 text-text-secondary whitespace-nowrap">
        {label}
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenDetails();
        }}
        className="absolute top-0 right-0 p-0 text-text-muted hover:text-text-secondary transition-colors"
        aria-label="詳細を見る"
      >
        <ArrowUpRight className="w-4 h-4" />
      </button>

      <div className="w-full flex flex-wrap gap-x-2 gap-y-0.5 items-baseline justify-center text-center">
        <span className="text-heading-20 text-text-primary whitespace-nowrap">
          {formatYen(totalMarketValue)}
        </span>
        <span className="text-body-14 text-text-secondary whitespace-nowrap">
          (積立 {formatYen(tsumitateMarketValue)} | 成長 {formatYen(growthMarketValue)})
        </span>
      </div>
    </div>
  );
};
