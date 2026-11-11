import React from 'react';
import { cn } from '@/ui/lib/utils';

export type AccountMode = 'fresh' | 'existing';

interface AccountSelectorProps {
  mode: AccountMode;
  onChange: (mode: AccountMode) => void;
  className?: string;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  mode,
  onChange,
  className,
}) => {
  const isFresh = mode === 'fresh';

  return (
    <div className={cn('flex justify-center w-full', className)}>
      <div className="border border-border-subtle flex items-center p-[3px] rounded-lg gap-2.5">
        <button
          type="button"
          onClick={() => onChange('fresh')}
          className={cn(
            'flex items-center justify-center px-[5px] py-[2px] rounded-lg cursor-pointer transition-colors text-body-14 whitespace-nowrap',
            isFresh
              ? 'bg-border-subtle font-bold text-text-secondary'
              : 'font-normal text-text-muted hover:text-text-secondary'
          )}
        >
          新規で始める
        </button>
        <button
          type="button"
          onClick={() => onChange('existing')}
          className={cn(
            'flex items-center justify-center px-[5px] py-[2px] rounded-lg cursor-pointer transition-colors text-body-14 whitespace-nowrap',
            !isFresh
              ? 'bg-border-subtle font-bold text-text-secondary'
              : 'font-normal text-text-muted hover:text-text-secondary'
          )}
        >
          既に保有している
        </button>
      </div>
    </div>
  );
};
