import React from 'react';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { FormSection } from '@/ui/components/common/FormSection';
import { InputUnit } from '@/ui/types/units';

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
    <FormSection title="シミュレーション基本設定" className={className}>
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
    </FormSection>
  );
};
