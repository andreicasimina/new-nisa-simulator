import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/ui/lib/utils';

interface InfoBannerProps {
  className?: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'bg-border-subtle flex items-center gap-1.5 px-2.5 py-1 rounded-lg w-full justify-center',
        className
      )}
    >
      <Info className="w-3.5 h-3.5 text-text-secondary shrink-0" />
      <span className="text-caption-12 text-text-primary select-none whitespace-nowrap">
        入力に迷ったら各項目のヒントをタップ！
      </span>
    </div>
  );
};
