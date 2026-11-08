import React from 'react';
import { cn } from '@/ui/lib/utils';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn('flex items-center justify-center py-4', className)}>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
        新 NISA シミュレーター
      </h1>
    </header>
  );
};
