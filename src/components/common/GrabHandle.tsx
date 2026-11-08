import React from 'react';

interface GrabHandleProps {
  className?: string;
}

export const GrabHandle: React.FC<GrabHandleProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-center pt-2 pb-1 shrink-0 ${className}`}>
      <div className="w-[36px] h-[4px] bg-[#d1d5db] rounded-full" />
    </div>
  );
};
