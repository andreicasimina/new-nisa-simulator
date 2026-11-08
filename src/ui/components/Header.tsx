import React from 'react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`flex items-center justify-center py-4 ${className}`}>
      <h1 className="font-bold text-[28px] leading-[34px] tracking-[-0.56px] text-gray-900 whitespace-nowrap">
        新 NISA シミュレーター
      </h1>
    </header>
  );
};
