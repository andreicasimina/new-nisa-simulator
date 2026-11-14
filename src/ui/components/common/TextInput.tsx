import React from 'react';
import { cn } from '@/ui/lib/utils';

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string;
  suffix?: React.ReactNode;
  error?: string;
  className?: string;
}

/**
 * Shared styled text input with optional label, trailing suffix, and error state.
 */
export const TextInput: React.FC<TextInputProps> = ({
  label,
  suffix,
  error,
  className,
  type = 'text',
  ...inputProps
}) => {
  return (
    <div className={cn('flex flex-col gap-1 w-full', className)}>
      {label && (
        <label className="text-caption-12 text-text-secondary">{label}</label>
      )}
      <div
        className={cn(
          'bg-bg-input flex items-center justify-between rounded-lg px-2 py-1 border transition-colors',
          error
            ? 'border-red-500 bg-red-50/50'
            : 'border-transparent focus-within:border-text-primary'
        )}
      >
        <input
          type={type}
          className="w-full bg-transparent text-body-16 text-text-primary focus:outline-none"
          {...inputProps}
        />
        {suffix !== undefined && suffix !== null && (
          <span className="text-body-16 text-text-primary shrink-0 pl-1 select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 leading-tight">{error}</span>
      )}
    </div>
  );
};
