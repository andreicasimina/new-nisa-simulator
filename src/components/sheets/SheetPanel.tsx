import React from 'react';

interface SheetPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const SheetPanel: React.FC<SheetPanelProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`relative z-10 w-full max-w-[393px] bg-white rounded-t-[16px] sm:rounded-b-[16px] shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.08)] flex flex-col max-h-[90vh] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};
