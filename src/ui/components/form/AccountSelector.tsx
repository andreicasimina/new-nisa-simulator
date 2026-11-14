import React from 'react';
import { cn } from '@/ui/lib/utils';
import { SegmentedControl, SegmentedOption } from '@/ui/components/common/SegmentedControl';

export type AccountMode = 'fresh' | 'existing';

const ACCOUNT_OPTIONS: readonly SegmentedOption<AccountMode>[] = [
  { value: 'fresh', label: '新規で始める' },
  { value: 'existing', label: '既に保有している' },
];

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
  return (
    <div className={cn('flex justify-center w-full', className)}>
      <SegmentedControl
        options={ACCOUNT_OPTIONS}
        value={mode}
        onChange={onChange}
      />
    </div>
  );
};
