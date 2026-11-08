import React from 'react';
import { Plus } from 'lucide-react';
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
        'w-full py-2.5 px-4 bg-border-subtle hover:bg-gray-300 text-text-primary text-body-14-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      <Plus className="w-4 h-4 text-text-primary" />
      <span>売却イベントを追加する</span>
    </button>
  );
};
