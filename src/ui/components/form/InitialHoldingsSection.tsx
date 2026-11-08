import React from 'react';
import { Holdings } from '@/core/types/nisa';
import { InputField } from '@/ui/components/common/InputField';
import { InputUnit } from '@/ui/types/units';
import { cn } from '@/ui/lib/utils';

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
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      <h3 className="text-body-14-semibold text-text-primary">
        初期資産
      </h3>

      {/* Principal Row */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="flex flex-col gap-1">
          <label className="text-caption-12 text-text-secondary">
            積立 (元本)
          </label>
          <InputField
            value={holdings.tsumitate.principal}
            onChange={handleTsumitatePrincipalChange}
            unit={InputUnit.YEN}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-caption-12 text-text-secondary">
            成長 (元本)
          </label>
          <InputField
            value={holdings.growth.principal}
            onChange={handleGrowthPrincipalChange}
            unit={InputUnit.YEN}
          />
        </div>
      </div>

      {/* Market Value Row */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="flex flex-col gap-1">
          <label className="text-caption-12 text-text-secondary">
            積立 (評価額)
          </label>
          <InputField
            value={holdings.tsumitate.marketValue}
            onChange={handleTsumitateMarketValueChange}
            unit={InputUnit.YEN}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-caption-12 text-text-secondary">
            成長 (評価額)
          </label>
          <InputField
            value={holdings.growth.marketValue}
            onChange={handleGrowthMarketValueChange}
            unit={InputUnit.YEN}
          />
        </div>
      </div>
    </div>
  );
};
