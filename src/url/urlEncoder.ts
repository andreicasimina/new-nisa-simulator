import LZString from 'lz-string';
import { z } from 'zod';
import { NisaPlanState } from '../types/state';
import { BUCKET_TYPES } from '../types/nisa';

const bucketBalanceSchema = z.object({
  principal: z.number().min(0),
  marketValue: z.number().min(0),
});

const holdingsSchema = z.object({
  tsumitate: bucketBalanceSchema,
  growth: bucketBalanceSchema,
});

const milestoneWithdrawalSchema = z.object({
  id: z.string(),
  yearIndex: z.number().int().min(1).max(50),
  targetBucket: z.enum(BUCKET_TYPES),
  amount: z.number().min(0),
  label: z.string().max(100),
});

export const nisaPlanStateSchema = z.object({
  age: z.number().int().min(18).max(100),
  horizonYears: z.number().int().min(1).max(50),
  expectedReturnRate: z.number().min(0).max(0.20),
  tsumitateMonthly: z.number().min(0),
  growthMonthly: z.number().min(0),
  growthAnnualLumpSum: z.number().min(0),
  initialHoldings: holdingsSchema,
  withdrawals: z.array(milestoneWithdrawalSchema),
});

export function encodePlanToUrl(state: NisaPlanState): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(state));
}

export function decodePlanFromUrl(encoded: string): NisaPlanState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const raw = JSON.parse(json);
    const parsed = nisaPlanStateSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
