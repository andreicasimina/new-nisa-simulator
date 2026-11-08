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
        'inline-flex items-center justify-center p-0.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer',
        className
      )}
    >
      <Info className="w-3.5 h-3.5" />
    </button>
  );
};
