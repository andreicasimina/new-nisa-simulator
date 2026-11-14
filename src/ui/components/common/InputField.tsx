import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/ui/lib/utils';
import { InputUnit } from '@/ui/types/units';
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
  const [inputValue, setInputValue] = useState<string>(
    displayVal === '' ? '' : String(displayVal)
  );
  const [isFocused, setIsFocused] = useState(false);
  const lastValidValueRef = useRef(value);

  // Keep track of the latest valid domain value passed in or emitted
  useEffect(() => {
    lastValidValueRef.current = value;
  }, [value]);

  // Sync displayed string when value or unit changes externally (when not focused)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(displayVal === '' ? '' : String(displayVal));
    }
  }, [value, unit, displayVal, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;

    // Reject invalid characters based on unit
    const pattern = unit === InputUnit.PERCENT ? /^\d*\.?\d*$/ : /^\d*$/;
    if (!pattern.test(rawInput)) {
      return;
    }

    setInputValue(rawInput);

    // If the input is completely cleared, do NOT update the backend with 0.
    // Instead, retain the previous valid value in the backend.
    if (rawInput.trim() === '') {
      return;
    }

    const domainVal = parseUnitInput(rawInput, unit);
    lastValidValueRef.current = domainVal;
    onChange(domainVal);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // If blurred while empty, restore the display to the value retained in the backend
    if (inputValue.trim() === '') {
      const display = unitToDisplay(lastValidValueRef.current, unit);
      setInputValue(display === '' ? '' : String(display));
    } else {
      // Normalize displayed string (e.g. remove redundant leading zeros or trailing dots)
      const currentDomainVal = parseUnitInput(inputValue, unit);
      const display = unitToDisplay(currentDomainVal, unit);
      setInputValue(display === '' ? '' : String(display));
    }
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
          type="text"
          inputMode={unit === InputUnit.PERCENT ? 'decimal' : 'numeric'}
          value={inputValue}
          placeholder="0"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className="w-full bg-transparent text-body-16 text-text-primary focus:outline-none"
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
