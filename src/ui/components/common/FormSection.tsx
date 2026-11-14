import React from 'react';
import { cn } from '@/ui/lib/utils';
import { InfoButton } from './InfoButton';

interface FormSectionProps {
  title: string;
  onInfo?: () => void;
  infoAriaLabel?: string;
  bordered?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Shared form section container with a title, optional info button, and bottom divider.
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  onInfo,
  infoAriaLabel,
  bordered = true,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 w-full',
        bordered && 'border-b border-border-subtle pb-4',
        className
      )}
    >
      {onInfo ? (
        <div className="flex items-center gap-1">
          <h3 className="text-body-14-semibold text-text-primary">{title}</h3>
          <InfoButton
            onClick={onInfo}
            ariaLabel={infoAriaLabel ?? `${title}の説明`}
          />
        </div>
      ) : (
        <h3 className="text-body-14-semibold text-text-primary">{title}</h3>
      )}
      {children}
    </div>
  );
};
