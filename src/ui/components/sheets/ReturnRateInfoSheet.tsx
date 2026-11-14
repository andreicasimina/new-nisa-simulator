import React from 'react';
import { BottomSheet } from './BottomSheet';
import { cn } from '@/ui/lib/utils';

interface ReturnRateInfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRate: (rate: number) => void;
  currentRate: number;
}

const RATE_OPTIONS = [
  {
    rate: 0.03,
    title: '3.0% バランス型 (8資産均等型など)',
    description:
      '株だけでなく国債など色々な資産に分けて投資します。値動きが比較的ゆるやかで、落ち着いて運用したい方向けの設定です。',
  },
  {
    rate: 0.05,
    title: '5.0% 全世界株式 (オルカンなど)',
    description:
      '世界中の主要企業まるごとに投資します。世界の経済成長に合わせて、王道の分散投資をしたい方向けの設定です。',
  },
  {
    rate: 0.07,
    title: '7.0% 米国株式 (S&P 500)',
    description:
      '成長をリードするアメリカの大手500社に投資します。一時的な値下がりも想定しつつ、高い成長を期待したい方向けの設定です。',
  },
  {
    rate: 0.09,
    title: '9.0% ハイテク・成長株 (NASDAQ100)',
    description:
      '急成長する有名IT企業を中心に投資します。値下がりの波は大きくなりますが、より大きなリターンを狙いたい方向けの設定です。',
  },
];

export const ReturnRateInfoSheet: React.FC<ReturnRateInfoSheetProps> = ({
  isOpen,
  onClose,
  onSelectRate,
  currentRate,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="想定利回り">
      <div className="flex flex-col gap-2.5 p-1 pb-4">
        {RATE_OPTIONS.map((opt) => {
          const isSelected = Math.abs(currentRate - opt.rate) < 0.001;
          return (
            <button
              key={opt.rate}
              type="button"
              onClick={() => {
                onSelectRate(opt.rate);
                onClose();
              }}
              className={cn(
                'text-left bg-bg-surface border p-2.5 rounded-lg flex flex-col gap-1.5 transition-colors cursor-pointer',
                isSelected
                  ? 'border-text-primary'
                  : 'border-border-subtle hover:border-gray-400'
              )}
            >
              <div className="flex items-center justify-between gap-2 w-full">
                <span className="text-body-14-semibold text-text-primary">
                  {opt.title}
                </span>
                {isSelected && (
                  <span className="text-caption-12 text-text-muted px-[5px] py-px bg-border-subtle rounded-[4px] whitespace-nowrap shrink-0">
                    選択中
                  </span>
                )}
              </div>
              <p className="text-caption-12 text-text-secondary">
                {opt.description}
              </p>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onClose}
          className="text-center bg-bg-surface border border-border-subtle hover:bg-bg-input p-2.5 rounded-lg text-body-14-semibold text-text-primary cursor-pointer transition-colors"
        >
          自分で入力する
        </button>
      </div>
    </BottomSheet>
  );
};
