import React, { useState, useEffect } from 'react';
import { usePlanStore } from '@/core/store/usePlanStore';
import { Header } from '@/ui/components/Header';
import { ResultCard } from '@/ui/components/result/ResultCard';
import { InputCard } from '@/ui/components/form/InputCard';
import { ShareButton } from '@/ui/components/common/ShareButton';
import { Footer } from '@/ui/components/Footer';
import { ResultDetailsSheet } from '@/ui/components/sheets/ResultDetailsSheet';
import { WithdrawalSheet } from '@/ui/components/sheets/WithdrawalSheet';
import { ReturnRateInfoSheet } from '@/ui/components/sheets/ReturnRateInfoSheet';
import { YearsInfoSheet } from '@/ui/components/sheets/YearsInfoSheet';
import { PurchaseSettingsInfoSheet } from '@/ui/components/sheets/PurchaseSettingsInfoSheet';
import { MilestoneWithdrawal } from '@/core/types/nisa';

export const App: React.FC = () => {
  const {
    plan,
    result,
    updatePlan,
    addWithdrawal,
    updateWithdrawal,
    removeWithdrawal,
  } = usePlanStore();

  const [isScrolled, setIsScrolled] = useState(false);

  // Sheet states
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isWithdrawalSheetOpen, setIsWithdrawalSheetOpen] = useState(false);
  const [editingWithdrawal, setEditingWithdrawal] = useState<MilestoneWithdrawal | null>(null);
  const [isReturnInfoOpen, setIsReturnInfoOpen] = useState(false);
  const [isYearsInfoOpen, setIsYearsInfoOpen] = useState(false);
  const [isPurchaseInfoOpen, setIsPurchaseInfoOpen] = useState(false);

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

  const handleAddWithdrawalClick = () => {
    setEditingWithdrawal(null);
    setIsWithdrawalSheetOpen(true);
  };

  const handleEditWithdrawalClick = (w: MilestoneWithdrawal) => {
    setEditingWithdrawal(w);
    setIsWithdrawalSheetOpen(true);
  };

  const handleSaveWithdrawal = (
    data: Omit<MilestoneWithdrawal, 'id'>,
    id?: string
  ) => {
    if (id) {
      updateWithdrawal(id, data);
    } else {
      addWithdrawal(data);
    }
  };

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col items-center px-4 pt-6 pb-16 text-text-primary">
      <div className="w-full max-w-[393px] flex flex-col items-center gap-4">
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

        {/* Form Inputs Section */}
        <InputCard
          plan={plan}
          onPlanUpdate={updatePlan}
          onAddWithdrawalClick={handleAddWithdrawalClick}
          onEditWithdrawalClick={handleEditWithdrawalClick}
          onOpenReturnInfo={() => setIsReturnInfoOpen(true)}
          onOpenYearsInfo={() => setIsYearsInfoOpen(true)}
          onOpenPurchaseInfo={() => setIsPurchaseInfoOpen(true)}
        />

        {/* Share Result Button */}
        <ShareButton plan={plan} />

        {/* Footer */}
        <Footer />
      </div>

      {/* Year Detail Bottom Sheet with Carousel/Stepper Navigation */}
      <ResultDetailsSheet
        isOpen={selectedYear !== null}
        onClose={() => setSelectedYear(null)}
        yearIndex={selectedYear ?? plan.horizonYears}
        onYearChange={(newYear) => setSelectedYear(newYear)}
        yearlyRecords={result.yearly}
        withdrawals={plan.withdrawals}
        horizonYears={plan.horizonYears}
      />

      {/* Withdrawal Add / Edit Bottom Sheet */}
      <WithdrawalSheet
        isOpen={isWithdrawalSheetOpen}
        onClose={() => {
          setIsWithdrawalSheetOpen(false);
          setEditingWithdrawal(null);
        }}
        withdrawal={editingWithdrawal}
        maxYears={plan.horizonYears}
        onSave={handleSaveWithdrawal}
        onDelete={removeWithdrawal}
      />

      {/* Expected Return Rate Educational Bottom Sheet */}
      <ReturnRateInfoSheet
        isOpen={isReturnInfoOpen}
        onClose={() => setIsReturnInfoOpen(false)}
        onSelectRate={(rate) => updatePlan({ expectedReturnRate: rate })}
        currentRate={plan.expectedReturnRate}
      />

      {/* Years of Operation Educational Bottom Sheet */}
      <YearsInfoSheet
        isOpen={isYearsInfoOpen}
        onClose={() => setIsYearsInfoOpen(false)}
      />

      {/* Purchase Settings Educational Bottom Sheet */}
      <PurchaseSettingsInfoSheet
        isOpen={isPurchaseInfoOpen}
        onClose={() => setIsPurchaseInfoOpen(false)}
      />
    </div>
  );
};

export default App;
