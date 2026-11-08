import { InputUnit } from '../types/units';

/**
 * Converts a raw domain value (Yen, fractional rate like 0.05, or years)
 * to a number suitable for an input field display.
 */
export function unitToDisplay(value: number, unit: InputUnit): number | '' {
  if (value === 0) return '';
  switch (unit) {
    case InputUnit.MAN_YEN:
      return value / 10_000;
    case InputUnit.PERCENT:
      return +(value * 100).toFixed(2);
    case InputUnit.YEAR:
      return value;
  }
}

/**
 * Parses user input text from an input field into a domain value
 * (Yen, fractional rate, or years).
 */
export function parseUnitInput(inputValue: string, unit: InputUnit): number {
  if (!inputValue.trim()) return 0;
  const parsed = parseFloat(inputValue);
  if (isNaN(parsed) || parsed < 0) return 0;

  switch (unit) {
    case InputUnit.MAN_YEN:
      return Math.round(parsed * 10_000);
    case InputUnit.PERCENT:
      return parsed / 100;
    case InputUnit.YEAR:
      return Math.round(parsed);
  }
}
