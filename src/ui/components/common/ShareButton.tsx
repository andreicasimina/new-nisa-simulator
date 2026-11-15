import React, { useEffect, useRef, useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { cn } from '@/ui/lib/utils';
import { createShareUrl } from '@/core/url/urlUtils';
import { NisaPlanState } from '@/core/types/state';
import { shareSimulationResult } from '@/ui/utils/shareSimulation';
import { Button } from './Button';

interface ShareButtonProps {
  plan: NisaPlanState;
  chartRef?: React.RefObject<HTMLElement | null>;
  summaryText?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  plan,
  chartRef,
  summaryText,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  const isSharingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleShare = async () => {
    if (isSharingRef.current) return;
    isSharingRef.current = true;

    try {
      const fullUrl = createShareUrl(
        plan,
        `${window.location.origin}${window.location.pathname}`
      );

      const outcome = await shareSimulationResult({
        shareUrl: fullUrl,
        summaryText,
        chartElement: chartRef?.current ?? undefined,
      });

      if (outcome === 'copied') {
        setCopied(true);
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => setCopied(false), 2000);
      }
    } finally {
      isSharingRef.current = false;
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
