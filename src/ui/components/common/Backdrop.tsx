import React from 'react';
import { cn } from '@/ui/lib/utils';

interface BackdropProps {
  onClick?: () => void;
  className?: string;
}

export const Backdrop: React.FC<BackdropProps> = ({ onClick, className }) => {
  return (
    <div
      className={cn('fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity', className)}
      onClick={onClick}
      aria-hidden="true"
    />
  );
};
