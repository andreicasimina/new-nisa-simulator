import { BucketType } from '@/core/types/nisa';

export const YEN_PER_MAN = 10_000;

export const APP_TITLE = '新 NISA シミュレーター';

export const GITHUB_REPO_URL =
  'https://github.com/andreicasimina/new-nisa-simulator';

export const BUCKET_LABELS: Record<BucketType, string> = {
  growth: '成長投資枠',
  tsumitate: 'つみたて投資枠',
  proportional: '按分（両方）',
};

export const BUCKET_OPTIONS = (
  Object.entries(BUCKET_LABELS) as [BucketType, string][]
).map(([value, label]) => ({ value, label }));
