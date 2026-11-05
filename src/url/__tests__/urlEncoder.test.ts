import { describe, it, expect } from 'vitest';
import LZString from 'lz-string';
import { encodePlanToUrl, decodePlanFromUrl } from '../urlEncoder';
import { DEFAULT_PLAN_STATE } from '../../engine/constants';
import { NisaPlanState } from '../../types/state';

describe('urlEncoder', () => {
  it('performs full round-trip encoding and decoding with DEFAULT_PLAN_STATE', () => {
    const encoded = encodePlanToUrl(DEFAULT_PLAN_STATE);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodePlanFromUrl(encoded);
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

    const encoded = encodePlanToUrl(customPlan);
    const decoded = decodePlanFromUrl(encoded);

    expect(decoded).toEqual(customPlan);
  });

  it('returns null when decoding corrupt or invalid strings', () => {
    expect(decodePlanFromUrl('garbage_string_not_lz')).toBeNull();
    expect(decodePlanFromUrl('')).toBeNull();
  });

  it('rejects data that violates statutory bounds via Zod validation', () => {
    // Age out of bounds (< 18)
    const invalidAge = { ...DEFAULT_PLAN_STATE, age: 10 };
    const encodedInvalidAge = LZString.compressToEncodedURIComponent(
      JSON.stringify(invalidAge)
    );
    expect(decodePlanFromUrl(encodedInvalidAge)).toBeNull();

    // Return rate > 20%
    const invalidReturnRate = { ...DEFAULT_PLAN_STATE, expectedReturnRate: 0.50 };
    const encodedInvalidRate = LZString.compressToEncodedURIComponent(
      JSON.stringify(invalidReturnRate)
    );
    expect(decodePlanFromUrl(encodedInvalidRate)).toBeNull();

    // Negative contribution
    const negativeContribution = { ...DEFAULT_PLAN_STATE, tsumitateMonthly: -500 };
    const encodedNegative = LZString.compressToEncodedURIComponent(
      JSON.stringify(negativeContribution)
    );
    expect(decodePlanFromUrl(encodedNegative)).toBeNull();
  });
});
