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
      <div className="flex flex-col gap-3 p-1 pb-4">
        {tips.map((tip) => (
          <div
            key={tip.title}
            className="flex flex-col gap-1.5 pb-3 border-b border-border-subtle last:border-b-0"
          >
            <h4 className="text-body-14-semibold text-text-primary">
              {tip.title}
            </h4>
            <p className="text-caption-12 text-text-secondary leading-relaxed">
              {tip.description}
            </p>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};
