import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import { MilestoneWithdrawal, BucketType } from '@/core/types/nisa';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { TextInput } from '@/ui/components/common/TextInput';
import { Button } from '@/ui/components/common/Button';
import { SegmentedControl, SegmentedOption } from '@/ui/components/common/SegmentedControl';
import { InputUnit } from '@/ui/types/units';
import { DEFAULT_WITHDRAWAL } from '@/core/engine/constants';

interface WithdrawalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal?: MilestoneWithdrawal | null; // If null, we are adding new
  maxYears: number;
  onAdd: (withdrawal: Omit<MilestoneWithdrawal, 'id'>) => void;
  onUpdate: (id: string, withdrawal: Omit<MilestoneWithdrawal, 'id'>) => void;
  onDelete?: (id: string) => void;
}

interface WithdrawalDraft {
  label: string;
  yearIndex: number;
  targetBucket: BucketType;
  amount: number;
}

function toDraft(
  withdrawal: MilestoneWithdrawal | null | undefined,
  maxYears: number
): WithdrawalDraft {
  return {
    label: withdrawal?.label ?? '',
    yearIndex:
      withdrawal?.yearIndex ??
      Math.min(DEFAULT_WITHDRAWAL.YEAR_INDEX, maxYears),
    targetBucket: withdrawal?.targetBucket ?? DEFAULT_WITHDRAWAL.TARGET_BUCKET,
    amount: withdrawal?.amount ?? DEFAULT_WITHDRAWAL.AMOUNT,
  };
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
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [draft, setDraft] = useState<WithdrawalDraft>(() =>
    toDraft(withdrawal, maxYears)
  );

  // Sync draft when opening or switching between add/edit targets
  useEffect(() => {
    if (isOpen) {
      setDraft(toDraft(withdrawal, maxYears));
    }
  }, [isOpen, withdrawal, maxYears]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.amount <= 0) return;

    const payload: Omit<MilestoneWithdrawal, 'id'> = {
      label: draft.label.trim() || '売却',
      yearIndex: Math.min(Math.max(1, draft.yearIndex), maxYears),
      targetBucket: draft.targetBucket,
      amount: draft.amount,
    };

    if (withdrawal?.id) {
      onUpdate(withdrawal.id, payload);
    } else {
      onAdd(payload);
    }
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
          value={draft.label}
          onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
          placeholder="例: 住宅購入の頭金、学費など"
        />

        {/* Year of Withdrawal */}
        <LabeledField
          label="売却年"
          value={draft.yearIndex}
          onChange={(val) =>
            setDraft((d) => ({
              ...d,
              yearIndex: Math.min(Math.max(1, val), maxYears),
            }))
          }
          unit={InputUnit.YEAR}
        />

        {/* Bucket selector */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-caption-12 text-text-secondary">
            売却元
          </label>
          <SegmentedControl
            options={BUCKET_OPTIONS}
            value={draft.targetBucket}
            onChange={(targetBucket) =>
              setDraft((d) => ({ ...d, targetBucket }))
            }
            fullWidth
          />
        </div>

        {/* Withdrawal Amount */}
        <LabeledField
          label="出金額"
          value={draft.amount}
          onChange={(amount) => setDraft((d) => ({ ...d, amount }))}
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
