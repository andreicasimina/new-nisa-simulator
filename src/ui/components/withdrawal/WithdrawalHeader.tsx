import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/ui/lib/utils';

interface WithdrawalHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
  count?: number;
}

export const WithdrawalHeader: React.FC<WithdrawalHeaderProps> = ({
  isExpanded,
  onToggle,
  count = 0,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      className="flex items-center gap-1.5 text-left cursor-pointer select-none group w-fit"
    >
      <span className="text-body-14-semibold text-text-primary group-hover:text-text-secondary transition-colors">
        売却設定 ({count})
      </span>
      <ChevronDown
        className={cn(
          'w-3.5 h-3.5 text-text-primary transition-transform duration-200',
          isExpanded && 'rotate-180'
        )}
      />
    </button>
  );
};
