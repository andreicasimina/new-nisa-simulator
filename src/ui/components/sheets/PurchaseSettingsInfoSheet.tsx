import React from 'react';
import { BottomSheet } from './BottomSheet';

interface PurchaseSettingsInfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIPS = [
  {
    title: '余剰資金で無理なく設定する',
    description:
      'どんなに手堅い投資でも一時的な値下がりは避けられません。生活費や数年以内に使うお金は銀行に残し、当面使わない「余ったお金」で設定しましょう。',
  },
  {
    title: 'つみたて枠と成長枠の違い',
    description:
      '「つみたて枠」は安全基準をクリアした商品の毎月積立用、「成長枠」は一括購入や追加購入もできる枠です。迷ったらまずは「つみたて枠」だけで十分です。',
  },
  {
    title: '年間投資枠と生涯非課税枠',
    description:
      '1年に投資できるのは最大360万円、一生涯では最大1,800万円までです。1,800万円の枠は、つみたて枠だけでも使い切ることができます。',
  },
  {
    title: '売却すると非課税枠が復活する',
    description:
      '途中で売却しても、その「買ったときの金額」分の枠は翌年に復活します。急な出費でお金が必要になったら、いつでも解約して引き出せます。',
  },
];

export const PurchaseSettingsInfoSheet: React.FC<PurchaseSettingsInfoSheetProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="購入設定の目安とルール">
      <div className="flex flex-col gap-3 p-1 pb-4">
        {TIPS.map((tip, idx) => (
          <div key={idx} className="flex flex-col gap-1.5 pb-3 border-b border-border-subtle last:border-b-0">
            <h4 className="text-body-14-semibold text-text-primary">
              {tip.title}
            </h4>
            <p className="text-caption-12 text-text-secondary leading-relaxed">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};
