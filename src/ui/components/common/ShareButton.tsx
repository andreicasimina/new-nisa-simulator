import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { cn } from '@/ui/lib/utils';
import { createShareUrl } from '@/core/url/urlUtils';
import { NisaPlanState } from '@/core/types/state';

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
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        'w-full py-2.5 px-4 bg-border-subtle hover:bg-gray-300 text-text-primary text-body-16 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.99]',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-700 font-medium">URLをコピーしました！</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 text-text-primary" />
          <span>結果をシェア</span>
        </>
      )}
    </button>
  );
};
