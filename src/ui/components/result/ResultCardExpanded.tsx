import React from 'react';
import { YearlyRecord } from '@/core/types/nisa';
import { formatYen } from '@/ui/utils/formatters';
import { BarChartPreview } from '@/ui/components/charts/BarChartPreview';

interface ResultCardExpandedProps {
  label: string;
  totalMarketValue: number;
  totalPrincipal: number;
  totalGain: number;
  yearly: YearlyRecord[];
  onOpenDetails: (year?: number) => void;
}

export const ResultCardExpanded: React.FC<ResultCardExpandedProps> = ({
  label,
  totalMarketValue,
  totalPrincipal,
  totalGain,
  yearly,
  onOpenDetails,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-[10px]">
      <div className="flex flex-col gap-[9px] items-center text-center">
        <p className="text-[12px] font-medium leading-[17px] text-[#4b5563]">
          {label}
        </p>
        <p className="text-[28px] font-bold leading-[34px] tracking-[-0.56px] text-[#111827]">
          {formatYen(totalMarketValue)}
        </p>
        <p className="text-[14px] font-normal leading-[21px] text-[#4b5563]">
          元本 {formatYen(totalPrincipal)} + 運用益 {formatYen(totalGain)}
        </p>
      </div>

      <BarChartPreview
        yearly={yearly}
        onSelectYear={(year) => onOpenDetails(year)}
      />
    </div>
  );
};
