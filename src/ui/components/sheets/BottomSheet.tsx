import React, { useEffect } from 'react';
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

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  className,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <Backdrop onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 w-full max-w-[393px] bg-white rounded-t-2xl sm:rounded-b-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-slide-up',
          className
        )}
      >
        {/* Grab Handle */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-9 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="relative px-4 py-2 flex items-center justify-center shrink-0 min-h-[40px]">
          {title && (
            <h3 className="font-semibold text-[14px] text-gray-900 leading-[20px]">
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
