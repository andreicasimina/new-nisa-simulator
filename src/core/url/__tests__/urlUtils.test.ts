import { describe, it, expect } from 'vitest';
import LZString from 'lz-string';
import { createShareUrl, readPlanFromUrl } from '../urlUtils';
import { DEFAULT_PLAN_STATE } from '../../engine/constants';
import { NisaPlanState } from '../../types/state';

describe('urlUtils', () => {
  it('performs full round-trip encoding and decoding with DEFAULT_PLAN_STATE', () => {
    const url = createShareUrl(DEFAULT_PLAN_STATE, 'https://example.com');
    expect(url).toContain('https://example.com#data=');

    const hash = url.split('#')[1];
    const decoded = readPlanFromUrl(hash);
    expect(decoded).toEqual(DEFAULT_PLAN_STATE);
  });

  it('performs round-trip with initial holdings and multiple withdrawals', () => {
    const customPlan: NisaPlanState = {
      age: 33,
      horizonYears: 20,
      expectedReturnRate: 0.06,
      tsumitateMonthly: 100_000,
      growthMonthly: 120_000,
      growthAnnualLumpSum: 400_000,
      initialHoldings: {
        tsumitate: { principal: 1_200_000, marketValue: 1_500_000 },
        growth: { principal: 2_400_000, marketValue: 3_000_000 },
      },
      withdrawals: [
        {
          id: 'w-condo',
          yearIndex: 7,
          targetBucket: 'growth',
          amount: 6_000_000,
          label: 'Condo Down Payment',
        },
        {
          id: 'w-tuition',
          yearIndex: 12,
          targetBucket: 'proportional',
          amount: 2_000_000,
          label: 'College Tuition',
        },
      ],
    };

    const url = createShareUrl(customPlan);
    const decoded = readPlanFromUrl(url.split('#')[1]);
    expect(decoded).toEqual(customPlan);
  });

  it('accepts hash with or without leading #', () => {
    const url = createShareUrl(DEFAULT_PLAN_STATE);
    const withHash = url.split('https://example.com')[1] || url; // starts with #data=...
    const withoutHash = withHash.replace(/^#/, '');

    expect(readPlanFromUrl(withHash)).toEqual(DEFAULT_PLAN_STATE);
    expect(readPlanFromUrl(withoutHash)).toEqual(DEFAULT_PLAN_STATE);
  });

  it('returns null on empty, missing data, or corrupted string', () => {
    expect(readPlanFromUrl('')).toBeNull();
    expect(readPlanFromUrl('foo=bar')).toBeNull();
    expect(readPlanFromUrl('data=corrupted_garbage_string')).toBeNull();
  });

  it('rejects data that violates statutory bounds via Zod validation', () => {
    // Age out of bounds (< 18)
    const invalidAge = { ...DEFAULT_PLAN_STATE, age: 10 };
    const encodedInvalidAge = LZString.compressToEncodedURIComponent(
      JSON.stringify(invalidAge)
    );
    expect(readPlanFromUrl(`data=${encodedInvalidAge}`)).toBeNull();

    // Return rate > 20%
    const invalidReturnRate = { ...DEFAULT_PLAN_STATE, expectedReturnRate: 0.50 };
    const encodedInvalidRate = LZString.compressToEncodedURIComponent(
      JSON.stringify(invalidReturnRate)
    );
    expect(readPlanFromUrl(`data=${encodedInvalidRate}`)).toBeNull();

    // Negative contribution
    const negativeContribution = { ...DEFAULT_PLAN_STATE, tsumitateMonthly: -500 };
    const encodedNegative = LZString.compressToEncodedURIComponent(
      JSON.stringify(negativeContribution)
    );
    expect(readPlanFromUrl(`data=${encodedNegative}`)).toBeNull();
  });
});
