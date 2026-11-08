import React from 'react';
import { cn } from '@/ui/lib/utils';
import { InputUnit, UNIT_CONFIG } from '@/ui/types/units';
import { unitToDisplay, parseUnitInput } from '@/ui/utils/unitConversion';

interface InputFieldProps {
  value: number;
  onChange: (val: number) => void;
  unit: InputUnit;
  error?: string;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  unit,
  error,
  className,
}) => {
  const displayVal = unitToDisplay(value, unit);
  const step = UNIT_CONFIG[unit].step;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const domainVal = parseUnitInput(rawInput, unit);
    onChange(domainVal);
  };

  return (
    <div className={cn('flex flex-col gap-1 w-full', className)}>
      <div
        className={cn(
          'bg-bg-input flex items-center justify-between rounded-lg px-2 py-1 border transition-colors',
          error ? 'border-red-500 bg-red-50/50' : 'border-transparent'
        )}
      >
        <input
          type="number"
          value={displayVal}
          placeholder="0"
          step={step}
          min={0}
          onChange={handleChange}
          className="w-full bg-transparent text-body-16 text-text-primary focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-body-16 text-text-primary shrink-0 pl-1 select-none">
          {unit}
        </span>
      </div>
      {error && (
        <span className="text-xs text-red-500 leading-tight">{error}</span>
      )}
    </div>
  );
};
