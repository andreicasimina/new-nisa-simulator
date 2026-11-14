import React from 'react';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { FormSection } from '@/ui/components/common/FormSection';
import { InputUnit } from '@/ui/types/units';

interface PurchaseSettingsProps {
  tsumitateMonthly: number;
  growthMonthly: number;
  growthAnnualLumpSum: number;
  onTsumitateMonthlyChange: (val: number) => void;
  onGrowthMonthlyChange: (val: number) => void;
  onGrowthAnnualLumpSumChange: (val: number) => void;
  onOpenPurchaseInfo?: () => void;
  className?: string;
}

export const PurchaseSettings: React.FC<PurchaseSettingsProps> = ({
  tsumitateMonthly,
  growthMonthly,
  growthAnnualLumpSum,
  onTsumitateMonthlyChange,
  onGrowthMonthlyChange,
  onGrowthAnnualLumpSumChange,
  onOpenPurchaseInfo,
  className,
}) => {
  return (
    <FormSection
      title="購入設定"
      onInfo={onOpenPurchaseInfo}
      infoAriaLabel="購入設定の説明"
      className={className}
    >
      {/* Monthly Row */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <LabeledField
          label="積立 (毎月)"
          value={tsumitateMonthly}
          onChange={onTsumitateMonthlyChange}
          unit={InputUnit.YEN}
        />
        <LabeledField
          label="成長 (毎月)"
          value={growthMonthly}
          onChange={onGrowthMonthlyChange}
          unit={InputUnit.YEN}
        />
      </div>

      {/* Annual Bonus Row */}
      <LabeledField
        label="成長 (年間ボーナス)"
        value={growthAnnualLumpSum}
        onChange={onGrowthAnnualLumpSumChange}
        unit={InputUnit.YEN}
      />
    </FormSection>
  );
};
