import React from 'react';
import { NisaPlanState } from '@/core/types/state';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { FormSection } from '@/ui/components/common/FormSection';
import { InputUnit } from '@/ui/types/units';

interface PurchaseSettingsProps {
  plan: NisaPlanState;
  onPlanUpdate: (updates: Partial<NisaPlanState>) => void;
  onOpenPurchaseInfo?: () => void;
}

export const PurchaseSettings: React.FC<PurchaseSettingsProps> = ({
  plan,
  onPlanUpdate,
  onOpenPurchaseInfo,
}) => {
  return (
    <FormSection
      title="購入設定"
      onInfo={onOpenPurchaseInfo}
      infoAriaLabel="購入設定の説明"
    >
      {/* Monthly Row */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <LabeledField
          label="積立 (毎月)"
          value={plan.tsumitateMonthly}
          onChange={(tsumitateMonthly) => onPlanUpdate({ tsumitateMonthly })}
          unit={InputUnit.YEN}
        />
        <LabeledField
          label="成長 (毎月)"
          value={plan.growthMonthly}
          onChange={(growthMonthly) => onPlanUpdate({ growthMonthly })}
          unit={InputUnit.YEN}
        />
      </div>

      {/* Annual Bonus Row */}
      <LabeledField
        label="成長 (年間ボーナス)"
        value={plan.growthAnnualLumpSum}
        onChange={(growthAnnualLumpSum) =>
          onPlanUpdate({ growthAnnualLumpSum })
        }
        unit={InputUnit.YEN}
      />
    </FormSection>
  );
};
