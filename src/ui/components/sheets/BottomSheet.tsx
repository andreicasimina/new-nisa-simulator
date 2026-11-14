import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/ui/lib/utils';
import { Backdrop } from '@/ui/components/common/Backdrop';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const EXIT_DURATION_MS = 220;

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  className,
  children,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }

    document.body.style.overflow = '';
    if (!shouldRender) return;

    const timer = window.setTimeout(() => {
      setShouldRender(false);
    }, EXIT_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  const isClosing = !isOpen;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end justify-center sm:items-center',
        isClosing && 'pointer-events-none'
      )}
    >
      <Backdrop
        onClick={onClose}
        className={isClosing ? 'animate-fade-out' : 'animate-fade-in'}
      />
      <div
        role="dialog"
        aria-modal="true"
        onAnimationEnd={(e) => {
          if (isClosing && e.target === e.currentTarget) {
            setShouldRender(false);
          }
        }}
        className={cn(
          'relative z-10 w-full max-w-[393px] bg-bg-surface rounded-t-2xl sm:rounded-b-2xl shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.08)] flex flex-col max-h-[90vh] overflow-hidden',
          isClosing ? 'animate-slide-down' : 'animate-slide-up',
          className
        )}
      >
        {/* Grab Handle */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-9 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="relative px-4 py-2 flex items-center justify-center shrink-0 min-h-[40px]">
          {title && (
            <h3 className="text-body-14-semibold text-text-primary">
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-2.5 p-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="閉じる"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 pb-6 pt-1 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
