import React from 'react';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { InputUnit } from '@/ui/types/units';
import { cn } from '@/ui/lib/utils';

interface SimulationSettingsProps {
  expectedReturnRate: number;
  horizonYears: number;
  onReturnRateChange: (rate: number) => void;
  onHorizonYearsChange: (years: number) => void;
  onOpenReturnInfo?: () => void;
  onOpenYearsInfo?: () => void;
  className?: string;
}

export const SimulationSettings: React.FC<SimulationSettingsProps> = ({
  expectedReturnRate,
  horizonYears,
  onReturnRateChange,
  onHorizonYearsChange,
  onOpenReturnInfo,
  onOpenYearsInfo,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      <h3 className="text-body-14-semibold text-text-primary">
        シミュレーション基本設定
      </h3>

      <div className="grid grid-cols-2 gap-3 w-full">
        <LabeledField
          label="想定利回り"
          value={expectedReturnRate}
          onChange={onReturnRateChange}
          unit={InputUnit.PERCENT}
          onInfo={onOpenReturnInfo}
        />
        <LabeledField
          label="運用年数"
          value={horizonYears}
          onChange={onHorizonYearsChange}
          unit={InputUnit.YEAR}
          onInfo={onOpenYearsInfo}
        />
      </div>
    </div>
  );
};
