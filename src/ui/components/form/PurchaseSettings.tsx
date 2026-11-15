import React, { useState } from 'react';
import { NisaPlanState } from '@/core/types/state';
import { STATUTORY_LIMITS } from '@/core/engine/constants';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { FormSection } from '@/ui/components/common/FormSection';
import { InputUnit } from '@/ui/types/units';

const MAX_TSUMITATE_MONTHLY = STATUTORY_LIMITS.ANNUAL_TSUMITATE / 12;

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
  const [tsumitateError, setTsumitateError] = useState<string | undefined>();

  const handleTsumitateChange = (val: number) => {
    if (val > MAX_TSUMITATE_MONTHLY) {
      setTsumitateError('つみたて投資枠の上限は月10万円です。');
      onPlanUpdate({ tsumitateMonthly: MAX_TSUMITATE_MONTHLY });
    } else {
      setTsumitateError(undefined);
      onPlanUpdate({ tsumitateMonthly: val });
    }
  };

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
          onChange={handleTsumitateChange}
          unit={InputUnit.YEN}
          error={tsumitateError}
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
