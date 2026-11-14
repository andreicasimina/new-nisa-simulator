import React from 'react';
import { cn } from '@/ui/lib/utils';
import { APP_TITLE } from '@/ui/utils/constants';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn('flex items-center justify-center', className)}>
      <h1 className="text-display-28 text-text-primary whitespace-nowrap">
        {APP_TITLE}
      </h1>
    </header>
  );
};
