import React from 'react';
import { cn } from '@/ui/lib/utils';
import { GitHubIcon } from '@/ui/components/common/GitHubIcon';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'w-full max-w-[393px] bg-bg-surface border border-border-subtle rounded-2xl flex flex-col items-center gap-3 px-5 py-6 mt-4',
        className
      )}
    >
      <p className="text-caption-12 text-text-secondary text-center leading-relaxed">
        ※ 本ツールの計算結果は将来の運用成果を保証するものではありません。参考値としてご利用ください。
      </p>
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Repository"
        className="text-text-primary hover:text-text-secondary transition-colors"
      >
        <GitHubIcon className="w-5 h-5" />
      </a>
    </footer>
  );
};
