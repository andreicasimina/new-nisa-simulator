import React, { useState, useEffect } from 'react';
import { usePlanStore } from '@/core/store/usePlanStore';
import { Header } from '@/ui/components/Header';
import { ResultCard } from '@/ui/components/result/ResultCard';
import { BottomSheet } from '@/ui/components/sheets/BottomSheet';
import { formatYen } from '@/ui/utils/formatters';

export const App: React.FC = () => {
  const { plan, result } = usePlanStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Monitor scroll position to trigger collapsed sticky header
  useEffect(() => {
    const handleScroll = () => {
      // Collapse when scrolled past ~100px
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenDetails = (yearIndex?: number) => {
    setSelectedYear(yearIndex ?? plan.horizonYears);
  };

  const handleCloseDetails = () => {
    setSelectedYear(null);
  };

  const selectedYearRecord = selectedYear
    ? result.yearly.find((record) => record.yearIndex === selectedYear)
    : null;

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col items-center px-4 py-6 text-text-primary">
      <div className="w-full max-w-[393px] flex flex-col gap-4">
        {/* App Title Header */}
        <Header />

        {/* Morphing Result Card (Expanded in-flow -> Collapsed sticky on scroll) */}
        <ResultCard
          summary={result.summary}
          yearly={result.yearly}
          horizonYears={plan.horizonYears}
          hasWithdrawals={plan.withdrawals.length > 0}
          isCollapsed={isScrolled}
          onOpenDetails={handleOpenDetails}
        />
      </div>

      {/* Year Detail Bottom Sheet */}
      <BottomSheet
        isOpen={selectedYear !== null}
        onClose={handleCloseDetails}
        title={selectedYear ? `${selectedYear}年目の詳細` : undefined}
      >
        {selectedYearRecord && (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-caption-12 text-text-secondary">
                想定資産額（売却前）
              </span>
              <span className="text-display-28 text-text-primary">
                {formatYen(
                  selectedYearRecord.holdings.tsumitate.marketValue +
                    selectedYearRecord.holdings.growth.marketValue
                )}
              </span>
              <span className="text-body-14 text-text-secondary">
                元本{' '}
                {formatYen(
                  selectedYearRecord.holdings.tsumitate.principal +
                    selectedYearRecord.holdings.growth.principal
                )}{' '}
                + 運用益 {formatYen(selectedYearRecord.cumulativeGain)}
              </span>
            </div>

            <div className="border-t border-border-subtle pt-3 flex flex-col gap-2">
              <span className="text-body-14-semibold text-text-primary">
                保有額の内訳
              </span>
              <div className="grid grid-cols-2 gap-2 text-sm bg-bg-input p-3 rounded-lg">
                <div>
                  <p className="text-caption-12 text-text-secondary">積立（評価額）</p>
                  <p className="text-body-16 text-text-primary font-medium">
                    {formatYen(selectedYearRecord.holdings.tsumitate.marketValue)}
                  </p>
                </div>
                <div>
                  <p className="text-caption-12 text-text-secondary">成長（評価額）</p>
                  <p className="text-body-16 text-text-primary font-medium">
                    {formatYen(selectedYearRecord.holdings.growth.marketValue)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default App;
