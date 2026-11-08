import React from 'react';
import { cn } from '@/ui/lib/utils';
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
  className?: string;
}

export const ResultCardExpanded: React.FC<ResultCardExpandedProps> = ({
  label,
  totalMarketValue,
  totalPrincipal,
  totalGain,
  yearly,
  onOpenDetails,
  className,
}) => {
  return (
    <div className={cn('w-full flex flex-col items-center gap-2.5', className)}>
      <div className="flex flex-col gap-2 items-center text-center">
        <p className="text-xs font-medium leading-[17px] text-gray-600">
          {label}
        </p>
        <p className="text-3xl font-bold leading-[34px] tracking-tight text-gray-900">
          {formatYen(totalMarketValue)}
        </p>
        <p className="text-sm font-normal leading-[21px] text-gray-600">
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
