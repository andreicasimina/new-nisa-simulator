import { cn } from '@/ui/lib/utils';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Shared segmented control supporting inline or full-width wrapping layouts.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  fullWidth = false,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'border border-border-subtle flex flex-wrap items-center p-[3px] rounded-lg',
        fullWidth ? 'w-full justify-between gap-y-2.5' : 'gap-2.5',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center justify-center px-[5px] py-[2px] rounded-lg cursor-pointer transition-colors text-body-14 whitespace-nowrap',
              isSelected
                ? 'bg-border-subtle font-bold text-text-secondary'
                : 'font-normal text-text-muted hover:text-text-secondary'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
