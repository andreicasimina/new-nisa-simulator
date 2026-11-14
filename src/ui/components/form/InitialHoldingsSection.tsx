import React from 'react';
import { Holdings } from '@/core/types/nisa';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { FormSection } from '@/ui/components/common/FormSection';
import { InputUnit } from '@/ui/types/units';

interface InitialHoldingsSectionProps {
  holdings: Holdings;
  onChange: (holdings: Holdings) => void;
}

type HoldingBucket = keyof Holdings;
type HoldingField = keyof Holdings['tsumitate'];

const HOLDING_ROWS: readonly (readonly {
  bucket: HoldingBucket;
  field: HoldingField;
  label: string;
}[])[] = [
  [
    { bucket: 'tsumitate', field: 'principal', label: '積立 (元本)' },
    { bucket: 'growth', field: 'principal', label: '成長 (元本)' },
  ],
  [
    { bucket: 'tsumitate', field: 'marketValue', label: '積立 (評価額)' },
    { bucket: 'growth', field: 'marketValue', label: '成長 (評価額)' },
  ],
];

export const InitialHoldingsSection: React.FC<InitialHoldingsSectionProps> = ({
  holdings,
  onChange,
}) => {
  const updateHolding = (
    bucket: HoldingBucket,
    field: HoldingField,
    val: number
  ) => {
    onChange({
      ...holdings,
      [bucket]: { ...holdings[bucket], [field]: val },
    });
  };

  return (
    <FormSection title="初期資産">
      {HOLDING_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-2 gap-3 w-full">
          {row.map(({ bucket, field, label }) => (
            <LabeledField
              key={`${bucket}-${field}`}
              label={label}
              value={holdings[bucket][field]}
              onChange={(val) => updateHolding(bucket, field, val)}
              unit={InputUnit.YEN}
            />
          ))}
        </div>
      ))}
    </FormSection>
  );
};
