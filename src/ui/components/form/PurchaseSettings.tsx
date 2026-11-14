import React from 'react';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { InfoButton } from '@/ui/components/common/InfoButton';
import { InputUnit } from '@/ui/types/units';
import { cn } from '@/ui/lib/utils';

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
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      <div className="flex items-center gap-1">
        <h3 className="text-body-14-semibold text-text-primary">購入設定</h3>
        {onOpenPurchaseInfo && (
          <InfoButton onClick={onOpenPurchaseInfo} ariaLabel="購入設定の説明" />
        )}
      </div>

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
    </div>
  );
};
