import React from 'react';
import { cn } from '@/ui/lib/utils';
import { GitHubIcon } from '@/ui/components/common/GitHubIcon';
import { GITHUB_REPO_URL } from '@/ui/utils/constants';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        'w-full bg-bg-surface border-t border-border-subtle flex flex-col items-center px-5 py-8 mt-8',
        className
      )}
    >
      <div className="w-full max-w-[351px] flex flex-col items-center gap-3">
        <p className="text-caption-12 text-text-muted text-center leading-relaxed">
          ※ 本ツールの計算結果は将来の運用成果を保証するものではありません。参考値としてご利用ください。
        </p>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
          className="text-text-primary hover:text-text-secondary transition-colors"
        >
          <GitHubIcon className="w-4 h-4" />
        </a>
      </div>
    </footer>
  );
};
