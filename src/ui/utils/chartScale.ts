const STEP_MULTIPLIERS = [1, 2, 5, 10] as const;
/** Smallest allowed tick step (1万円) so axis labels are always whole 万円. */
const MIN_STEP_YEN = 10_000;

export interface ValueAxis {
  /** Top of the axis in yen (always a multiple of `step`). */
  max: number;
  step: number;
  /** Tick values from 0 to `max` inclusive, ascending. */
  ticks: number[];
}

/**
 * Builds a 0-based value axis with "round" steps (1, 2, 5 × 10^n yen),
 * using at most `maxIntervals` intervals.
 */
export function niceValueAxis(maxValue: number, maxIntervals: number): ValueAxis {
  const intervalsLimit = Math.max(1, Math.floor(maxIntervals));

  if (!(maxValue > 0)) {
    return { max: MIN_STEP_YEN, step: MIN_STEP_YEN, ticks: [0, MIN_STEP_YEN] };
  }

  const rawStep = maxValue / intervalsLimit;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));

  let step = MIN_STEP_YEN;
  for (const multiplier of STEP_MULTIPLIERS) {
    const candidate = Math.max(MIN_STEP_YEN, Math.round(multiplier * magnitude));
    if (Math.ceil(maxValue / candidate) <= intervalsLimit) {
      step = candidate;
      break;
    }
  }

  const intervals = Math.max(1, Math.ceil(maxValue / step));
  const ticks = Array.from({ length: intervals + 1 }, (_, i) => i * step);

  return { max: intervals * step, step, ticks };
}
