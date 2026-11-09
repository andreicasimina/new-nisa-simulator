import { describe, expect, it } from 'vitest';
import { niceValueAxis } from '../chartScale';

const MAN = 10_000;

describe('niceValueAxis', () => {
  it('uses round steps for the Figma "detailed" example (max 1,330万円)', () => {
    const axis = niceValueAxis(1_330 * MAN, 10);
    expect(axis.step).toBe(200 * MAN);
    expect(axis.max).toBe(1_400 * MAN);
    expect(axis.ticks).toHaveLength(8);
  });

  it('uses round steps for the Figma "all" example (max 16,490万円)', () => {
    const axis = niceValueAxis(16_490 * MAN, 10);
    expect(axis.step).toBe(2_000 * MAN);
    expect(axis.max).toBe(18_000 * MAN);
  });

  it('uses fewer ticks when fewer intervals fit', () => {
    const axis = niceValueAxis(16_490 * MAN, 4);
    expect(axis.step).toBe(5_000 * MAN);
    expect(axis.ticks.length - 1).toBeLessThanOrEqual(4);
  });

  it('never goes below a 1万円 step', () => {
    const axis = niceValueAxis(3 * MAN, 10);
    expect(axis.step).toBe(MAN);
    expect(axis.max).toBe(3 * MAN);
  });

  it('handles empty data', () => {
    const axis = niceValueAxis(0, 10);
    expect(axis.ticks[0]).toBe(0);
    expect(axis.max).toBeGreaterThan(0);
  });
});
