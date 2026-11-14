import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { formatYen } from '@/ui/utils/formatters';

interface ResultCardCollapsedProps {
  label: string;
  totalMarketValue: number;
  tsumitateMarketValue: number;
  growthMarketValue: number;
  onOpenDetails: () => void;
}

export const ResultCardCollapsed: React.FC<ResultCardCollapsedProps> = ({
  label,
  totalMarketValue,
  tsumitateMarketValue,
  growthMarketValue,
  onOpenDetails,
}) => {
  return (
    <button
      type="button"
      onClick={onOpenDetails}
      aria-label={`${label}の詳細を見る`}
      className="w-full flex flex-col gap-[9px] items-center cursor-pointer relative group"
    >
      <p className="text-caption-12 text-text-secondary whitespace-nowrap">
        {label}
      </p>

      <ArrowUpRight className="w-4 h-4 absolute top-0 right-0 text-text-muted group-hover:text-text-secondary transition-colors" />

      <div className="w-full flex flex-col gap-1 items-center justify-center text-center">
        <span className="text-heading-20 text-text-primary whitespace-nowrap">
          {formatYen(totalMarketValue)}
        </span>
        <span className="text-body-16 text-text-secondary whitespace-nowrap">
          (積立 {formatYen(tsumitateMarketValue)} | 成長 {formatYen(growthMarketValue)})
        </span>
      </div>
    </button>
  );
};
