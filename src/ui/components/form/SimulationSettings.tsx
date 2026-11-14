import React from 'react';
import { NisaPlanState } from '@/core/types/state';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { FormSection } from '@/ui/components/common/FormSection';
import { InputUnit } from '@/ui/types/units';

interface SimulationSettingsProps {
  plan: NisaPlanState;
  onPlanUpdate: (updates: Partial<NisaPlanState>) => void;
  onOpenReturnInfo?: () => void;
  onOpenYearsInfo?: () => void;
}

export const SimulationSettings: React.FC<SimulationSettingsProps> = ({
  plan,
  onPlanUpdate,
  onOpenReturnInfo,
  onOpenYearsInfo,
}) => {
  return (
    <FormSection title="シミュレーション基本設定">
      <div className="grid grid-cols-2 gap-3 w-full">
        <LabeledField
          label="想定利回り"
          value={plan.expectedReturnRate}
          onChange={(expectedReturnRate) => onPlanUpdate({ expectedReturnRate })}
          unit={InputUnit.PERCENT}
          onInfo={onOpenReturnInfo}
        />
        <LabeledField
          label="運用年数"
          value={plan.horizonYears}
          onChange={(horizonYears) => onPlanUpdate({ horizonYears })}
          unit={InputUnit.YEAR}
          onInfo={onOpenYearsInfo}
        />
      </div>
    </FormSection>
  );
};
