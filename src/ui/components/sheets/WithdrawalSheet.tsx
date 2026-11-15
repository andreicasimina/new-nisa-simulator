import React, { useState, useEffect, useMemo } from 'react';
import { BottomSheet } from './BottomSheet';
import { MilestoneWithdrawal, BucketType } from '@/core/types/nisa';
import { NisaPlanState } from '@/core/types/state';
import { getAvailableToWithdraw } from '@/core/engine/availability';
import { LabeledField } from '@/ui/components/common/LabeledField';
import { TextInput } from '@/ui/components/common/TextInput';
import { Button } from '@/ui/components/common/Button';
import { SegmentedControl } from '@/ui/components/common/SegmentedControl';
import { Divider } from '@/ui/components/common/Divider';
import { InputUnit } from '@/ui/types/units';
import { DEFAULT_WITHDRAWAL } from '@/core/engine/constants';
import { BUCKET_OPTIONS } from '@/ui/utils/constants';
import { formatYen } from '@/ui/utils/formatters';

interface WithdrawalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal?: MilestoneWithdrawal | null; // If null, we are adding new
  plan: NisaPlanState;
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
    yearIndex: withdrawal?.yearIndex ?? maxYears,
    targetBucket: withdrawal?.targetBucket ?? DEFAULT_WITHDRAWAL.TARGET_BUCKET,
    amount: withdrawal?.amount ?? DEFAULT_WITHDRAWAL.AMOUNT,
  };
}

export const WithdrawalSheet: React.FC<WithdrawalSheetProps> = ({
  isOpen,
  onClose,
  withdrawal,
  plan,
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

  const available = useMemo(
    () => getAvailableToWithdraw(plan, draft.yearIndex, withdrawal?.id),
    [plan, draft.yearIndex, withdrawal?.id]
  );

  const bucketAvailable =
    draft.targetBucket === 'tsumitate'
      ? available.tsumitate
      : draft.targetBucket === 'growth'
        ? available.growth
        : available.tsumitate + available.growth;

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4">
        {/* Label input */}
        <TextInput
          label="ラベル"
          value={draft.label}
          onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
          placeholder="例: 住宅購入の頭金、学費など"
        />

        <Divider />

        {/* Year of Withdrawal */}
        <div className="flex flex-col gap-1 w-full">
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
          <p className="text-caption-12 text-text-secondary">
            売却可能額：つみたて {formatYen(available.tsumitate)} / 成長{' '}
            {formatYen(available.growth)}
          </p>
        </div>

        <Divider />

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

        <Divider />

        {/* Withdrawal Amount */}
        <div className="flex flex-col gap-1 w-full">
          <LabeledField
            label="出金額"
            value={draft.amount}
            onChange={(amount) => setDraft((d) => ({ ...d, amount }))}
            unit={InputUnit.YEN}
            error={
              draft.amount <= 0 ? '1万円以上を入力してください。' : undefined
            }
          />
          {draft.amount > bucketAvailable && (
            <p className="text-caption-12 text-danger">
              残高が不足しているため、{formatYen(bucketAvailable)}
              しか売却されません。
            </p>
          )}
        </div>

        <Divider />

        {/* Action Buttons */}
        <div className="flex flex-col gap-1.5">
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
