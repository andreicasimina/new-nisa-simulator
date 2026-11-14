import React, { useState, useEffect } from 'react';
import { BottomSheet } from './BottomSheet';
import { MilestoneWithdrawal, BucketType } from '@/core/types/nisa';
import { InputField } from '@/ui/components/common/InputField';
import { Button } from '@/ui/components/common/Button';
import { InputUnit } from '@/ui/types/units';
import { cn } from '@/ui/lib/utils';
import { Trash2 } from 'lucide-react';

interface WithdrawalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawal?: MilestoneWithdrawal | null; // If null, we are adding new
  maxYears: number;
  onSave: (withdrawal: Omit<MilestoneWithdrawal, 'id'>, id?: string) => void;
  onDelete?: (id: string) => void;
}

const BUCKET_OPTIONS: { type: BucketType; label: string }[] = [
  { type: 'growth', label: '成長投資枠' },
  { type: 'tsumitate', label: 'つみたて投資枠' },
  { type: 'proportional', label: '按分（両方）' },
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-1 pb-4">
        {/* Label input */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-caption-12 text-text-secondary">
            ラベル
          </label>
          <div className="bg-bg-input flex items-center rounded-lg px-2.5 py-1.5 border border-transparent focus-within:border-text-primary transition-colors">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="例: 住宅購入の頭金、学費など"
              className="w-full bg-transparent text-body-16 text-text-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Year of Withdrawal */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-caption-12 text-text-secondary">
            売却年（1 〜 {maxYears} 年目）
          </label>
          <InputField
            value={yearIndex}
            onChange={(val) => setYearIndex(Math.min(Math.max(1, val), maxYears))}
            unit={InputUnit.YEAR}
          />
        </div>

        {/* Bucket selector */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-caption-12 text-text-secondary">
            売却元
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-bg-input rounded-lg border border-border-subtle">
            {BUCKET_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setTargetBucket(opt.type)}
                className={cn(
                  'py-1.5 text-center text-caption-12 font-medium rounded-md transition-all cursor-pointer truncate',
                  targetBucket === opt.type
                    ? 'bg-bg-surface text-text-primary shadow-xs font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawal Amount */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-caption-12 text-text-secondary">
            出金額
          </label>
          <InputField
            value={amount}
            onChange={(val) => setAmount(val)}
            unit={InputUnit.YEN}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button type="submit">
            {withdrawal ? '変更を保存する' : '売却イベントを追加する'}
          </Button>

          {withdrawal && onDelete && (
            <Button variant="ghost-danger" onClick={handleDelete}>
              <Trash2 className="w-3.5 h-3.5" />
              <span>このイベントを削除する</span>
            </Button>
          )}
        </div>
      </form>
    </BottomSheet>
  );
};
