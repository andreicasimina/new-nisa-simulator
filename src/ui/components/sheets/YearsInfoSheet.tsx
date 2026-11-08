import React from 'react';
import { BottomSheet } from './BottomSheet';

interface YearsInfoSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIPS = [
  {
    title: '退職時期から逆算する',
    description:
      '「退職予定の年齢（60〜65歳など）− 現在の年齢」を基準にするのが一般的です。例えば30歳で65歳定年を目指す場合は35年となります。',
  },
  {
    title: 'ライフイベントから決める',
    description:
      '教育資金や住宅購入の頭金など中期目標なら「10〜15年」、老後資金や本格的な資産形成が目的なら「20〜30年以上」が目安です。',
  },
  {
    title: '長く続けるほど有利になる',
    description:
      '投資は期間が長くなるほど、一時的な値下がりのリスクが減り、お金が効率よく増えやすくなります。迷ったら「できるだけ長い年数」で試算してみましょう。',
  },
];

export const YearsInfoSheet: React.FC<YearsInfoSheetProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="運用年数の目安">
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
