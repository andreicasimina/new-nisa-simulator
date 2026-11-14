import React from 'react';
import { Holdings } from '@/core/types/nisa';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { FormSection } from '@/ui/components/common/FormSection';
import { InputUnit } from '@/ui/types/units';

interface InitialHoldingsSectionProps {
  holdings: Holdings;
  onChange: (holdings: Holdings) => void;
  className?: string;
}

export const InitialHoldingsSection: React.FC<InitialHoldingsSectionProps> = ({
  holdings,
  onChange,
  className,
}) => {
  const handleTsumitatePrincipalChange = (val: number) => {
    onChange({
      ...holdings,
      tsumitate: { ...holdings.tsumitate, principal: val },
    });
  };

  const handleTsumitateMarketValueChange = (val: number) => {
    onChange({
      ...holdings,
      tsumitate: { ...holdings.tsumitate, marketValue: val },
    });
  };

  const handleGrowthPrincipalChange = (val: number) => {
    onChange({
      ...holdings,
      growth: { ...holdings.growth, principal: val },
    });
  };

  const handleGrowthMarketValueChange = (val: number) => {
    onChange({
      ...holdings,
      growth: { ...holdings.growth, marketValue: val },
    });
  };

  return (
    <FormSection title="初期資産" className={className}>
      {/* Principal Row */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <LabeledField
          label="積立 (元本)"
          value={holdings.tsumitate.principal}
          onChange={handleTsumitatePrincipalChange}
          unit={InputUnit.YEN}
        />
        <LabeledField
          label="成長 (元本)"
          value={holdings.growth.principal}
          onChange={handleGrowthPrincipalChange}
          unit={InputUnit.YEN}
        />
      </div>

      {/* Market Value Row */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <LabeledField
          label="積立 (評価額)"
          value={holdings.tsumitate.marketValue}
          onChange={handleTsumitateMarketValueChange}
          unit={InputUnit.YEN}
        />
        <LabeledField
          label="成長 (評価額)"
          value={holdings.growth.marketValue}
          onChange={handleGrowthMarketValueChange}
          unit={InputUnit.YEN}
        />
      </div>
    </FormSection>
  );
};
