import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import { MilestoneWithdrawal, BucketType } from '@/core/types/nisa';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { TextInput } from '@/ui/components/common/TextInput';
import { Button } from '@/ui/components/common/Button';
import { SegmentedControl, SegmentedOption } from '@/ui/components/common/SegmentedControl';
import { InputUnit } from '@/ui/types/units';

interface WithdrawalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal?: MilestoneWithdrawal | null; // If null, we are adding new
  maxYears: number;
  onSave: (withdrawal: Omit<MilestoneWithdrawal, 'id'>, id?: string) => void;
  onDelete?: (id: string) => void;
}

const BUCKET_OPTIONS: readonly SegmentedOption<BucketType>[] = [
  { value: 'growth', label: '成長投資枠' },
  { value: 'tsumitate', label: 'つみたて投資枠' },
  { value: 'proportional', label: '按分（両方）' },
];

export const WithdrawalSheet: React.FC<WithdrawalSheetProps> = ({
  isOpen,
  onClose,
  withdrawal,
  maxYears,
  onSave,
  onDelete,
}) => {
  const [label, setLabel] = useState(withdrawal?.label ?? '');
  const [yearIndex, setYearIndex] = useState(withdrawal?.yearIndex ?? Math.min(10, maxYears));
  const [targetBucket, setTargetBucket] = useState<BucketType>(
    withdrawal?.targetBucket ?? 'growth'
  );
  const [amount, setAmount] = useState(withdrawal?.amount ?? 1_000_000);

  // Sync state when open or withdrawal changes
  useEffect(() => {
    if (isOpen) {
      setLabel(withdrawal?.label ?? '');
      setYearIndex(withdrawal?.yearIndex ?? Math.min(10, maxYears));
      setTargetBucket(withdrawal?.targetBucket ?? 'growth');
      setAmount(withdrawal?.amount ?? 1_000_000);
    }
  }, [isOpen, withdrawal, maxYears]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    onSave(
      {
        label: label.trim() || '売却',
        yearIndex: Math.min(Math.max(1, yearIndex), maxYears),
        targetBucket,
        amount,
      },
      withdrawal?.id
    );
    onClose();
  };

  const handleDelete = () => {
    if (withdrawal?.id && onDelete) {
      onDelete(withdrawal.id);
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={withdrawal ? '売却イベントを編集' : '売却イベントを追加'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-1 pb-2">
        {/* Label input */}
        <TextInput
          label="ラベル"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="例: 住宅購入の頭金、学費など"
        />

        {/* Year of Withdrawal */}
        <LabeledField
          label={`売却年（1 〜 ${maxYears} 年目）`}
          value={yearIndex}
          onChange={(val) => setYearIndex(Math.min(Math.max(1, val), maxYears))}
          unit={InputUnit.YEAR}
        />

        {/* Bucket selector */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-caption-12 text-text-secondary">
            売却元
          </label>
          <SegmentedControl
            options={BUCKET_OPTIONS}
            value={targetBucket}
            onChange={setTargetBucket}
            fullWidth
          />
        </div>

        {/* Withdrawal Amount */}
        <LabeledField
          label="出金額"
          value={amount}
          onChange={(val) => setAmount(val)}
          unit={InputUnit.YEN}
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-1.5 pt-1">
          <Button type="submit">
            {withdrawal ? '変更を保存する' : '売却イベントを追加する'}
          </Button>

          {withdrawal && onDelete && (
            <Button variant="ghost-danger" onClick={handleDelete}>
              イベントを削除する
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  );
};
