import React from 'react';
import { cn } from '@/ui/lib/utils';

interface AddWithdrawalButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddWithdrawalButton: React.FC<AddWithdrawalButtonProps> = ({
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full py-2.5 px-4 bg-border-subtle hover:bg-gray-300 text-text-primary text-body-14-semibold rounded-2xl transition-colors cursor-pointer text-center active:scale-[0.99]',
        className
      )}
    >
      売却イベントを追加する
    </button>
  );
};
