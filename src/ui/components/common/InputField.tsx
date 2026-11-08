import React from 'react';
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
  className = '',
}) => {
  const displayVal = unitToDisplay(value, unit);
  const step = UNIT_CONFIG[unit].step;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const domainVal = parseUnitInput(rawInput, unit);
    onChange(domainVal);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      <div
        className={`bg-[#f3f4f6] flex items-center justify-between rounded-[8px] px-[7px] py-[3px] border transition-colors ${
          error ? 'border-red-500 bg-red-50/50' : 'border-transparent'
        }`}
      >
        <input
          type="number"
          value={displayVal}
          placeholder="0"
          step={step}
          min={0}
          onChange={handleChange}
          className="w-full bg-transparent text-[16px] font-medium text-[#111827] leading-[22px] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-[16px] font-medium text-[#111827] leading-[22px] shrink-0 pl-1 select-none">
          {unit}
        </span>
      </div>
      {error && (
        <span className="text-[11px] text-red-500 leading-tight">{error}</span>
      )}
    </div>
  );
};
