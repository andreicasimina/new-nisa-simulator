import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { cn } from '@/ui/lib/utils';
import { createShareUrl } from '@/core/url/urlUtils';
import { NisaPlanState } from '@/core/types/state';
import { Button } from './Button';

interface ShareButtonProps {
  plan: NisaPlanState;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ plan, className }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const fullUrl = createShareUrl(
      plan,
      `${window.location.origin}${window.location.pathname}`
    );

    // Try Web Share API on mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title: '新 NISA シミュレーター',
          text: '新NISAのシミュレーション結果を作成しました。',
          url: fullUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was canceled or failed
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <Button
      onClick={handleShare}
      className={cn('px-2.5', className)}
    >
      {copied ? (
        <>
          <Check className="size-6 text-gain shrink-0" />
          <span className="text-gain font-semibold whitespace-nowrap">URLをコピーしました！</span>
        </>
      ) : (
        <>
          <Share2 className="size-6 text-text-primary shrink-0" />
          <span className="whitespace-nowrap">結果を保存・シェア</span>
        </>
      )}
    </Button>
  );
};
