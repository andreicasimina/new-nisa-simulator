export function formatYen(yen: number): string {
  if (yen === 0) return '0万円';
  const man = yen / 10_000;
  if (Number.isInteger(man)) {
    return `${man.toLocaleString()}万円`;
  }
  const rounded = Math.round(man * 10) / 10;
  return `${rounded.toLocaleString()}万円`;
}

export function formatPercent(rate: number): string {
  const percent = rate * 100;
  return `${percent.toFixed(1)}%`;
}
