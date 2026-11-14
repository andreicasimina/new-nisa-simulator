import React from 'react';
import { BottomSheet } from './BottomSheet';

export interface TipItem {
  title: string;
  description: string;
}

interface TipListSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tips: readonly TipItem[];
}

/**
 * Educational bottom sheet displaying a list of titled tips.
 */
export const TipListSheet: React.FC<TipListSheetProps> = ({
  isOpen,
  onClose,
  title,
  tips,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-2.5">
        {tips.map((tip) => (
          <div key={tip.title} className="flex flex-col gap-2.5">
            <h4 className="text-caption-12-bold text-text-primary">
              {tip.title}
            </h4>
            <p className="text-caption-12 text-text-secondary">
              {tip.description}
            </p>
            <div className="w-full h-px bg-border-subtle rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};
