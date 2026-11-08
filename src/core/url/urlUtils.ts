import LZString from 'lz-string';
import { z } from 'zod';
import { NisaPlanState } from '@/core/types/state';
import { BUCKET_TYPES } from '@/core/types/nisa';

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

const nisaPlanStateSchema = z.object({
  age: z.number().int().min(18).max(100),
  horizonYears: z.number().int().min(1).max(50),
  expectedReturnRate: z.number().min(0).max(0.20),
  tsumitateMonthly: z.number().min(0),
  growthMonthly: z.number().min(0),
  growthAnnualLumpSum: z.number().min(0),
  initialHoldings: holdingsSchema,
  withdrawals: z.array(milestoneWithdrawalSchema),
});

function encodeState(plan: NisaPlanState): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(plan));
}

function decodeState(encoded: string): NisaPlanState | null {
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

export function createShareUrl(plan: NisaPlanState, baseUrl: string = ''): string {
  const encoded = encodeState(plan);
  return `${baseUrl}#data=${encoded}`;
}

export function readPlanFromUrl(hash: string): NisaPlanState | null {
  if (!hash) return null;

  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(cleanHash);
  const data = params.get('data');
  if (!data) return null;

  return decodeState(data);
}
