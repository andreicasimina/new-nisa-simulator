import React from 'react';
import { cn } from '@/ui/lib/utils';
import { YearlyRecord } from '@/core/types/nisa';
import { NisaPlanState } from '@/core/types/state';
import { formatYen } from '@/ui/utils/formatters';
import { BarChartPreview } from '@/ui/components/charts/BarChartPreview';
import { ShareButton } from '@/ui/components/common/ShareButton';

interface ResultCardExpandedProps {
  label: string;
  totalMarketValue: number;
  totalPrincipal: number;
  totalGain: number;
  yearly: YearlyRecord[];
  plan: NisaPlanState;
  onOpenDetails: (year?: number) => void;
  className?: string;
}

export const ResultCardExpanded: React.FC<ResultCardExpandedProps> = ({
  label,
  totalMarketValue,
  totalPrincipal,
  totalGain,
  yearly,
  plan,
  onOpenDetails,
  className,
}) => {
  return (
    <div className={cn('w-full flex flex-col items-center gap-2.5', className)}>
      <div className="flex flex-col gap-[9px] items-center text-center">
        <p className="text-caption-12 text-text-secondary">
          {label}
        </p>
        <p className="text-display-28 text-text-primary">
          {formatYen(totalMarketValue)}
        </p>
        <p className="text-body-14 text-text-secondary">
          元本 {formatYen(totalPrincipal)} + 運用益 {formatYen(totalGain)}
        </p>
      </div>

      <div className="w-full h-px bg-border-subtle rounded-full shrink-0" />

      <div className="w-full flex flex-col gap-2.5 items-center">
        <BarChartPreview
          yearly={yearly}
          onSelectYear={(year) => onOpenDetails(year)}
          className="p-[5px]"
        />
        <div className="w-full h-px bg-border-subtle rounded-full shrink-0" />
        <ShareButton plan={plan} className="w-full max-w-[327px]" />
      </div>
    </div>
  );
};
