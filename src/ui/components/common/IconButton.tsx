import React from 'react';
import { cn } from '@/ui/lib/utils';

export type IconButtonTone = 'muted' | 'secondary';
export type IconButtonSize = 'none' | 'sm';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  tone?: IconButtonTone;
  size?: IconButtonSize;
}

const TONE_CLASSES: Record<IconButtonTone, string> = {
  muted: 'text-text-muted hover:text-text-secondary',
  secondary: 'text-text-secondary hover:text-text-primary',
};

const SIZE_CLASSES: Record<IconButtonSize, string> = {
  none: 'p-0',
  sm: 'p-1 rounded-md',
};

/**
 * Shared accessible icon-only button with consistent hover, disabled, and cursor states.
 */
export const IconButton: React.FC<IconButtonProps> = ({
  tone = 'muted',
  size = 'sm',
  type = 'button',
  className,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center transition-colors cursor-pointer shrink-0 disabled:opacity-30 disabled:cursor-not-allowed',
        TONE_CLASSES[tone],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
