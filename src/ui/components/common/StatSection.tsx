import React from 'react';
import { cn } from '@/ui/lib/utils';

interface StatCellProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  subClassName?: string;
  className?: string;
}

/**
 * Displays a labeled statistic value with optional secondary caption.
 */
export const StatCell: React.FC<StatCellProps> = ({
  label,
  value,
  sub,
  subClassName,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-caption-12 text-text-secondary">{label}</span>
      <span className="text-body-16 text-text-primary font-medium">{value}</span>
      {sub && (
        <span className={cn('text-caption-12 text-text-muted', subClassName)}>
          {sub}
        </span>
      )}
    </div>
  );
};

interface StatSectionProps {
  title: string;
  columns?: 1 | 2;
  className?: string;
  children: React.ReactNode;
}

/**
 * Groups `StatCell` items under a section heading in detail views.
 */
export const StatSection: React.FC<StatSectionProps> = ({
  title,
  columns = 2,
  className,
  children,
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <h4 className="text-body-14-semibold text-text-primary">{title}</h4>
      <div
        className={cn(
          columns === 2 ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'
        )}
      >
        {children}
      </div>
    </div>
  );
};
