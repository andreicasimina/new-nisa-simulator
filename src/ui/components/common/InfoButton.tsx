import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/ui/lib/utils';

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
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'size-3.5 p-0 border-0 leading-none inline-flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors cursor-pointer shrink-0',
        className
      )}
    >
      <Info className="size-3 fill-current stroke-bg-canvas block" />
    </button>
  );
};
