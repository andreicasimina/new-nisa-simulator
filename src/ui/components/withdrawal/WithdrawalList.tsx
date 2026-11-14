import React from 'react';
import { MilestoneWithdrawal } from '@/core/types/nisa';
import { formatYen } from '@/ui/utils/formatters';
import { BUCKET_LABELS } from '@/ui/utils/constants';
import { cn } from '@/ui/lib/utils';

interface WithdrawalListProps {
  withdrawals: MilestoneWithdrawal[];
  onEdit: (withdrawal: MilestoneWithdrawal) => void;
  className?: string;
}

export const WithdrawalList: React.FC<WithdrawalListProps> = ({
  withdrawals,
  onEdit,
  className,
}) => {
  if (withdrawals.length === 0) {
    return (
      <div className={cn('flex items-center justify-center w-full', className)}>
        <p className="text-caption-12 text-text-muted whitespace-nowrap">
          登録された売却イベントは存在しません
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      {withdrawals.map((withdrawal) => (
        <div
          key={withdrawal.id}
          className="card flex gap-3 items-start justify-between p-2.5 w-full"
        >
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {/* Top row: Label & Year */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-caption-12 text-text-secondary">
                  ラベル
                </span>
                <span className="text-body-16 text-text-primary truncate">
                  {withdrawal.label || '売却'}
                </span>
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-caption-12 text-text-secondary">
                  売却年
                </span>
                <span className="text-body-16 text-text-primary">
                  {withdrawal.yearIndex} 年目
                </span>
              </div>
            </div>

            {/* Bottom row: Bucket & Amount */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-caption-12 text-text-secondary">
                  売却元
                </span>
                <span className="text-body-16 text-text-primary">
                  {BUCKET_LABELS[withdrawal.targetBucket]}
                </span>
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-caption-12 text-text-secondary">
                  売却額
                </span>
                <span className="text-body-16 text-text-primary font-medium">
                  {formatYen(withdrawal.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Action Button */}
          <button
            type="button"
            onClick={() => onEdit(withdrawal)}
            className="text-caption-12 text-text-muted hover:text-text-primary transition-colors cursor-pointer pt-0.5 shrink-0"
          >
            編集
          </button>
        </div>
      ))}
    </div>
  );
};
