import LZString from 'lz-string';
import { z } from 'zod';
import { DEFAULT_PLAN_STATE } from '@/core/engine/constants';
import { BUCKET_TYPES } from '@/core/types/nisa';
import { NisaPlanState } from '@/core/types/state';

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
  horizonYears: z.number().int().min(1).max(100),
  expectedReturnRate: z.number().min(0).max(0.20),
  tsumitateMonthly: z.number().min(0),
  growthMonthly: z.number().min(0),
  growthAnnualLumpSum: z.number().min(0),
  initialHoldings: holdingsSchema,
  withdrawals: z.array(milestoneWithdrawalSchema),
});

function encodeState(plan: NisaPlanState): string {
  const { initialHoldings: h } = plan;
  const hasHoldings =
    h.tsumitate.principal > 0 ||
    h.tsumitate.marketValue > 0 ||
    h.growth.principal > 0 ||
    h.growth.marketValue > 0;

  const data = {
    ...(plan.age !== DEFAULT_PLAN_STATE.age && { a: plan.age }),
    ...(plan.horizonYears !== DEFAULT_PLAN_STATE.horizonYears && { h: plan.horizonYears }),
    ...(plan.expectedReturnRate !== DEFAULT_PLAN_STATE.expectedReturnRate && { r: plan.expectedReturnRate }),
    ...(plan.tsumitateMonthly !== DEFAULT_PLAN_STATE.tsumitateMonthly && { t: plan.tsumitateMonthly }),
    ...(plan.growthMonthly !== DEFAULT_PLAN_STATE.growthMonthly && { g: plan.growthMonthly }),
    ...(plan.growthAnnualLumpSum !== DEFAULT_PLAN_STATE.growthAnnualLumpSum && { l: plan.growthAnnualLumpSum }),
    ...(hasHoldings && {
      i: [h.tsumitate.principal, h.tsumitate.marketValue, h.growth.principal, h.growth.marketValue],
    }),
    ...(plan.withdrawals.length > 0 && {
      w: plan.withdrawals.map((w) => [
        w.yearIndex,
        BUCKET_TYPES.indexOf(w.targetBucket),
        w.amount,
        w.label,
      ]),
    }),
  };

  return LZString.compressToBase64(JSON.stringify(data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function decodeState(encoded: string): NisaPlanState | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const json = LZString.decompressFromBase64(b64);
    if (!json) return null;

    const d = JSON.parse(json);
    const plan = {
      age: d.a ?? DEFAULT_PLAN_STATE.age,
      horizonYears: d.h ?? DEFAULT_PLAN_STATE.horizonYears,
      expectedReturnRate: d.r ?? DEFAULT_PLAN_STATE.expectedReturnRate,
      tsumitateMonthly: d.t ?? DEFAULT_PLAN_STATE.tsumitateMonthly,
      growthMonthly: d.g ?? DEFAULT_PLAN_STATE.growthMonthly,
      growthAnnualLumpSum: d.l ?? DEFAULT_PLAN_STATE.growthAnnualLumpSum,
      initialHoldings: d.i
        ? {
            tsumitate: { principal: d.i[0], marketValue: d.i[1] },
            growth: { principal: d.i[2], marketValue: d.i[3] },
          }
        : DEFAULT_PLAN_STATE.initialHoldings,
      withdrawals: d.w
        ? d.w.map((w: [number, number, number, string], idx: number) => ({
            id: `w-${idx}`,
            yearIndex: w[0],
            targetBucket: BUCKET_TYPES[w[1]],
            amount: w[2],
            label: w[3],
          }))
        : DEFAULT_PLAN_STATE.withdrawals,
    };

    const parsed = nisaPlanStateSchema.safeParse(plan);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function createShareUrl(plan: NisaPlanState, baseUrl: string = ''): string {
  const encoded = encodeState(plan);
  return `${baseUrl}#d=${encoded}`;
}

export function readPlanFromUrl(hash: string): NisaPlanState | null {
  if (!hash) return null;

  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const params = new URLSearchParams(cleanHash);
  const data = params.get('d');
  if (!data) return null;

  return decodeState(data);
}
