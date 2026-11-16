import { MAN_PER_OKU, YEN_PER_MAN } from './constants';

export function formatYen(yen: number): string {
  const totalMan = Math.round(yen / YEN_PER_MAN);
  if (totalMan === 0) return '0万円';

  if (Math.abs(totalMan) >= MAN_PER_OKU) {
    const oku = Math.trunc(totalMan / MAN_PER_OKU);
    const remainingMan = Math.abs(totalMan) % MAN_PER_OKU;
    if (remainingMan === 0) {
      return `${oku.toLocaleString()}億円`;
    }
    return `${oku.toLocaleString()}億${remainingMan.toLocaleString()}万円`;
  }

  return `${totalMan.toLocaleString()}万円`;
}

export function formatPercent(rate: number): string {
  const percent = rate * 100;
  return `${percent.toFixed(1)}%`;
}
