import React, { useState, useEffect, useRef } from 'react';
import { usePlanStore } from '@/core/store/usePlanStore';
import { Header } from '@/ui/components/Header';
import {
  ResultCard,
  ResultCardHeights,
  DEFAULT_CARD_HEIGHTS,
} from '@/ui/components/result/ResultCard';
import { InputCard } from '@/ui/components/form/InputCard';
import { Footer } from '@/ui/components/Footer';
import { ResultDetailsSheet } from '@/ui/components/sheets/ResultDetailsSheet';
import { WithdrawalSheet } from '@/ui/components/sheets/WithdrawalSheet';
import { ReturnRateInfoSheet } from '@/ui/components/sheets/ReturnRateInfoSheet';
import { TipListSheet, TipItem } from '@/ui/components/sheets/TipListSheet';
import { MilestoneWithdrawal } from '@/core/types/nisa';

const YEARS_TIPS: readonly TipItem[] = [
  {
    title: '退職時期から逆算する',
    description:
      '「退職予定の年齢（60〜65歳など）− 現在の年齢」を基準にするのが一般的です。例えば30歳で65歳定年を目指す場合は35年となります。',
  },
  {
    title: 'ライフイベントから決める',
    description:
      '教育資金や住宅購入の頭金など中期目標なら「10〜15年」、老後資金や本格的な資産形成が目的なら「20〜30年以上」が目安です。',
  },
  {
    title: '長く続けるほど有利になる',
    description:
      '投資は期間が長くなるほど、一時的な値下がりのリスクが減り、お金が効率よく増えやすくなります。迷ったら「できるだけ長い年数」で試算してみましょう。',
  },
];

const PURCHASE_SETTINGS_TIPS: readonly TipItem[] = [
  {
    title: '余剰資金で無理なく設定する',
    description:
      'どんなに手堅い投資でも一時的な値下がりは避けられません。生活費や数年以内に使うお金は銀行に残し、当面使わない「余ったお金」で設定しましょう。',
  },
  {
    title: 'つみたて枠と成長枠の違い',
    description:
      '「つみたて枠」は安全基準をクリアした商品の毎月積立用、「成長枠」は一括購入や追加購入もできる枠です。迷ったらまずは「つみたて枠」だけで十分です。',
  },
  {
    title: '年間投資枠と生涯非課税枠',
    description:
      '1年に投資できるのは最大360万円、一生涯では最大1,800万円までです。1,800万円の枠は、つみたて枠だけでも使い切ることができます。',
  },
  {
    title: '売却すると非課税枠が復活する',
    description:
      '途中で売却しても、その「買ったときの金額」分の枠は翌年に復活します。急な出費でお金が必要になったら、いつでも解約して引き出せます。',
  },
];

export const App: React.FC = () => {
  const {
    plan,
    result,
    updatePlan,
    addWithdrawal,
    updateWithdrawal,
    removeWithdrawal,
  } = usePlanStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [cardHeights, setCardHeights] = useState<ResultCardHeights>(DEFAULT_CARD_HEIGHTS);
  const headerRef = useRef<HTMLDivElement>(null);

  // Sheet states
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isWithdrawalSheetOpen, setIsWithdrawalSheetOpen] = useState(false);
  const [editingWithdrawal, setEditingWithdrawal] = useState<MilestoneWithdrawal | null>(null);
  const [isReturnInfoOpen, setIsReturnInfoOpen] = useState(false);
  const [isYearsInfoOpen, setIsYearsInfoOpen] = useState(false);
  const [isPurchaseInfoOpen, setIsPurchaseInfoOpen] = useState(false);

  // Monitor scroll position: collapse first, then turn sticky when scrolling further down
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const headerRect = headerRef.current.getBoundingClientRect();
      const headerTop = headerRect.top + window.scrollY;
      const headerHeight = headerRef.current.offsetHeight;

      // Distance from top of document to top of ResultCard container (header + gap-4)
      const containerTop = headerTop + headerHeight + 16;
      const { expanded: expandedHeight, collapsed: collapsedHeight } = cardHeights;

      // 1. Collapse downward when scrolling past 25% of the result card
      const collapseThreshold = containerTop + expandedHeight * 0.25;
      setIsCollapsed(window.scrollY >= collapseThreshold);

      // 2. Turn sticky when the collapsed card (at bottom of container) reaches top-3 (12px)
      const collapsedCardTop = containerTop + expandedHeight - collapsedHeight;
      const stickyThreshold = collapsedCardTop - 12;
      setIsSticky(window.scrollY >= stickyThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [cardHeights]);

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
    <div className="min-h-screen bg-bg-canvas flex flex-col items-center text-text-primary">
      <div className="w-full max-w-[393px] flex-1 flex flex-col items-center px-4 pt-6 pb-4 gap-4">
        {/* App Title Header */}
        <div ref={headerRef} className="w-full">
          <Header />
        </div>

        {/* Morphing Result Card (Expanded in-flow -> Collapsed sticky on scroll) */}
        <ResultCard
          summary={result.summary}
          yearly={result.yearly}
          horizonYears={plan.horizonYears}
          hasWithdrawals={plan.withdrawals.length > 0}
          plan={plan}
          isCollapsed={isCollapsed}
          isSticky={isSticky}
          onOpenDetails={handleOpenDetails}
          onHeightsChange={setCardHeights}
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
      </div>

      {/* Full-width Footer */}
      <Footer />

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
      <TipListSheet
        isOpen={isYearsInfoOpen}
        onClose={() => setIsYearsInfoOpen(false)}
        title="運用年数の目安"
        tips={YEARS_TIPS}
      />

      {/* Purchase Settings Educational Bottom Sheet */}
      <TipListSheet
        isOpen={isPurchaseInfoOpen}
        onClose={() => setIsPurchaseInfoOpen(false)}
        title="購入設定の目安とルール"
        tips={PURCHASE_SETTINGS_TIPS}
      />
    </div>
  );
};

export default App;
