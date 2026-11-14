import React from 'react';
import { cn } from '@/ui/lib/utils';

export type ButtonVariant = 'secondary' | 'ghost-danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  secondary:
    'py-2.5 px-4 bg-border-subtle hover:bg-gray-300 text-text-primary text-body-14-semibold rounded-2xl gap-2.5',
  'ghost-danger':
    'py-2.5 px-4 text-text-muted hover:text-red-600 hover:bg-red-50 text-body-14-semibold rounded-2xl gap-1.5',
};

/**
 * Shared full-width button component with `secondary` and `ghost-danger` variants.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  type = 'button',
  className,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        'w-full flex items-center justify-center transition-colors cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
