import React from 'react';
import { Button } from '@/ui/components/common/Button';

interface AddWithdrawalButtonProps {
  onClick: () => void;
  className?: string;
}

export const AddWithdrawalButton: React.FC<AddWithdrawalButtonProps> = ({
  onClick,
  className,
}) => {
  return (
    <Button onClick={onClick} className={className}>
      売却イベントを追加する
    </Button>
  );
};
