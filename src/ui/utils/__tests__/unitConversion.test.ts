import { describe, it, expect } from 'vitest';
import { unitToDisplay, parseUnitInput } from '@/ui/utils/unitConversion';
import { InputUnit } from '@/ui/types/units';

describe('unitConversion', () => {
  describe('unitToDisplay', () => {
    it('converts Yen from domain (raw Yen) to display (10,000 Yen / 万円)', () => {
      expect(unitToDisplay(600_000, InputUnit.YEN)).toBe(60);
      expect(unitToDisplay(60_000, InputUnit.YEN)).toBe(6);
      expect(unitToDisplay(0, InputUnit.YEN)).toBe('');
    });

    it('converts Percent from decimal to percentage number', () => {
      expect(unitToDisplay(0.05, InputUnit.PERCENT)).toBe(5);
      expect(unitToDisplay(0.075, InputUnit.PERCENT)).toBe(7.5);
      expect(unitToDisplay(0, InputUnit.PERCENT)).toBe('');
    });

    it('converts Year directly', () => {
      expect(unitToDisplay(60, InputUnit.YEAR)).toBe(60);
      expect(unitToDisplay(6, InputUnit.YEAR)).toBe(6);
      expect(unitToDisplay(0, InputUnit.YEAR)).toBe('');
    });
  });

  describe('parseUnitInput', () => {
    it('parses empty string to 0', () => {
      expect(parseUnitInput('', InputUnit.YEN)).toBe(0);
      expect(parseUnitInput('   ', InputUnit.YEAR)).toBe(0);
      expect(parseUnitInput('', InputUnit.PERCENT)).toBe(0);
    });

    it('parses Yen input text to domain value', () => {
      expect(parseUnitInput('60', InputUnit.YEN)).toBe(600_000);
      expect(parseUnitInput('6', InputUnit.YEN)).toBe(60_000);
      expect(parseUnitInput('30', InputUnit.YEN)).toBe(300_000);
      expect(parseUnitInput('0', InputUnit.YEN)).toBe(0);
    });

    it('parses Year input text to domain value', () => {
      expect(parseUnitInput('60', InputUnit.YEAR)).toBe(60);
      expect(parseUnitInput('6', InputUnit.YEAR)).toBe(6);
      expect(parseUnitInput('30', InputUnit.YEAR)).toBe(30);
    });

    it('parses Percent input text to domain value', () => {
      expect(parseUnitInput('5', InputUnit.PERCENT)).toBe(0.05);
      expect(parseUnitInput('7.5', InputUnit.PERCENT)).toBe(0.075);
    });
  });
});
