import React from 'react';
import { InputField } from '@/ui/components/common/InputField';
import { InfoButton } from '@/ui/components/common/InfoButton';
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
        {/* Return Rate */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <label className="text-caption-12 text-text-secondary">
              想定利回り
            </label>
            {onOpenReturnInfo && (
              <InfoButton onClick={onOpenReturnInfo} ariaLabel="想定利回りの説明" />
            )}
          </div>
          <InputField
            value={expectedReturnRate}
            onChange={onReturnRateChange}
            unit={InputUnit.PERCENT}
          />
        </div>

        {/* Years of Operation */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <label className="text-caption-12 text-text-secondary">
              運用年数
            </label>
            {onOpenYearsInfo && (
              <InfoButton onClick={onOpenYearsInfo} ariaLabel="運用年数の説明" />
            )}
          </div>
          <InputField
            value={horizonYears}
            onChange={onHorizonYearsChange}
            unit={InputUnit.YEAR}
          />
        </div>
      </div>
    </div>
  );
};
