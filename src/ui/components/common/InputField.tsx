import React, { useState, useEffect, useRef } from 'react';
import { InputUnit } from '@/ui/types/units';
import { unitToDisplay, parseUnitInput } from '@/ui/utils/unitConversion';
import { TextInput } from './TextInput';

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
    <TextInput
      inputMode={unit === InputUnit.PERCENT ? 'decimal' : 'numeric'}
      value={inputValue}
      placeholder="0"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      suffix={unit}
      error={error}
      className={className}
    />
  );
};
