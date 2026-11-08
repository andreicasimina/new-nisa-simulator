import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/ui/lib/utils';

interface WithdrawalHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
  count?: number;
  className?: string;
}

export const WithdrawalHeader: React.FC<WithdrawalHeaderProps> = ({
  isExpanded,
  onToggle,
  count,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex items-center gap-1.5 text-left cursor-pointer select-none group w-fit',
        className
      )}
    >
      <span className="text-body-14-semibold text-text-primary group-hover:text-text-secondary transition-colors">
        売却設定
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-caption-12 text-text-muted">({count})</span>
      )}
      {isExpanded ? (
        <ChevronUp className="w-3.5 h-3.5 text-text-primary transition-transform" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5 text-text-primary transition-transform" />
      )}
    </button>
  );
};
