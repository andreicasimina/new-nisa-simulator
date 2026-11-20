export enum InputUnit {
  YEN = '万円',
  PERCENT = '%',
  YEAR = '年',
  AGE = '歳',
}

export const UNIT_CONFIG: Record<InputUnit, { step: number }> = {
  [InputUnit.YEN]: { step: 1 },
  [InputUnit.PERCENT]: { step: 0.1 },
  [InputUnit.YEAR]: { step: 1 },
  [InputUnit.AGE]: { step: 1 },
};
