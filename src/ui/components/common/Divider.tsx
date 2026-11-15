import React from 'react';
import { cn } from '@/ui/lib/utils';

interface DividerProps {
  className?: string;
}

/**
 * 1px horizontal divider using the subtle border token.
 */
export const Divider: React.FC<DividerProps> = ({ className }) => (
  <div
    className={cn(
      'w-full h-px bg-border-subtle rounded-full shrink-0',
      className
    )}
  />
);
