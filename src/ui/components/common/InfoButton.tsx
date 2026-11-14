import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/ui/lib/utils';
import { IconButton } from './IconButton';

interface InfoButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
}

export const InfoButton: React.FC<InfoButtonProps> = ({
  onClick,
  ariaLabel = '説明を表示',
  className,
}) => {
  return (
    <IconButton
      size="none"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn('size-3.5 border-0 leading-none', className)}
    >
      <Info className="size-3 fill-current stroke-bg-canvas block" />
    </IconButton>
  );
};
