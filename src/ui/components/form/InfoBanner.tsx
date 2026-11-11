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
        'bg-border-subtle flex items-center gap-1 px-[5px] py-[3px] rounded-lg',
        className
      )}
    >
      <div className="size-3.5 shrink-0 flex items-center justify-center">
        <Info className="size-3 fill-text-muted stroke-border-subtle block" />
      </div>
      <span className="text-body-14 text-text-primary select-none whitespace-nowrap">
        入力に迷ったら各項目のヒントをタップ！
      </span>
    </div>
  );
};
