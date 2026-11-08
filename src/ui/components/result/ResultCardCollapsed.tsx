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
    <div
      onClick={onOpenDetails}
      className="w-full flex flex-col items-center gap-1 cursor-pointer relative"
    >
      <div className="w-full flex items-center justify-center relative">
        <p className="text-[12px] font-medium leading-[17px] text-[#4b5563]">
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
        <span className="text-[20px] font-semibold leading-[26px] tracking-[-0.2px] text-[#111827]">
          {formatYen(totalMarketValue)}
        </span>
        <span className="text-[14px] font-medium leading-[22px] text-[#4b5563]">
          (積立 {formatYen(tsumitateMarketValue)} | 成長 {formatYen(growthMarketValue)})
        </span>
      </div>
    </div>
  );
};
