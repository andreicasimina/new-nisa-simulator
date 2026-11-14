import React from 'react';
import { cn } from '@/ui/lib/utils';
import { InputUnit } from '@/ui/types/units';
import { InputField } from './InputField';
import { InfoButton } from './InfoButton';

interface LabeledFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit: InputUnit;
  onInfo?: () => void;
  infoAriaLabel?: string;
  error?: string;
  className?: string;
}

/**
 * Form field pairing a caption label (and optional info button) with an `InputField`.
 */
export const LabeledField: React.FC<LabeledFieldProps> = ({
  label,
  value,
  onChange,
  unit,
  onInfo,
  infoAriaLabel,
  error,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1 w-full', className)}>
      {onInfo ? (
        <div className="flex items-center gap-1">
          <label className="text-caption-12 text-text-secondary">{label}</label>
          <InfoButton
            onClick={onInfo}
            ariaLabel={infoAriaLabel ?? `${label}の説明`}
          />
        </div>
      ) : (
        <label className="text-caption-12 text-text-secondary">{label}</label>
      )}
      <InputField
        value={value}
        onChange={onChange}
        unit={unit}
        error={error}
      />
    </div>
  );
};
