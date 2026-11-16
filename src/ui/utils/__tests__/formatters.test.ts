import { describe, expect, it } from 'vitest';
import { formatPercent, formatYen } from '../formatters';

describe('formatYen', () => {
  it('formats 0 as 0万円', () => {
    expect(formatYen(0)).toBe('0万円');
  });

  it('formats values under 1億円 in whole 万円 without decimals', () => {
    expect(formatYen(10_000)).toBe('1万円');
    expect(formatYen(14_000)).toBe('1万円');
    expect(formatYen(15_000)).toBe('2万円');
    expect(formatYen(12_345_000)).toBe('1,235万円');
    expect(formatYen(99_990_000)).toBe('9,999万円');
  });

  it('formats exact multiples of 1億円 without 万円 remainder', () => {
    expect(formatYen(100_000_000)).toBe('1億円');
    expect(formatYen(200_000_000)).toBe('2億円');
    expect(formatYen(10_000_000_000)).toBe('100億円');
  });

  it('formats combined 億 and whole 万円 for values >= 1億円 with remainder', () => {
    expect(formatYen(123_450_000)).toBe('1億2,345万円');
    expect(formatYen(123_456_000)).toBe('1億2,346万円');
    expect(formatYen(100_010_000)).toBe('1億1万円');
  });

  it('handles rounding across the 1億円 boundary', () => {
    expect(formatYen(99_996_000)).toBe('1億円');
  });
});

describe('formatPercent', () => {
  it('formats decimal rate as percentage with 1 decimal place', () => {
    expect(formatPercent(0.05)).toBe('5.0%');
    expect(formatPercent(0.075)).toBe('7.5%');
  });
});
