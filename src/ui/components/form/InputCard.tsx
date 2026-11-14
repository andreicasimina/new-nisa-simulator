import React, { useState } from 'react';
import { AccountSelector, AccountMode } from './AccountSelector';
import { InfoBanner } from './InfoBanner';
import { InitialHoldingsSection } from './InitialHoldingsSection';
import { SimulationSettings } from './SimulationSettings';
import { PurchaseSettings } from './PurchaseSettings';
import { WithdrawalHeader } from '@/ui/components/withdrawal/WithdrawalHeader';
import { WithdrawalList } from '@/ui/components/withdrawal/WithdrawalList';
import { AddWithdrawalButton } from '@/ui/components/withdrawal/AddWithdrawalButton';
import { NisaPlanState } from '@/core/types/state';
import { MilestoneWithdrawal, Holdings } from '@/core/types/nisa';
import { sumHoldings } from '@/ui/utils/holdings';
import { cn } from '@/ui/lib/utils';

interface InputCardProps {
  plan: NisaPlanState;
  onPlanUpdate: (updates: Partial<NisaPlanState>) => void;
  onAddWithdrawalClick: () => void;
  onEditWithdrawalClick: (withdrawal: MilestoneWithdrawal) => void;
  onOpenReturnInfo?: () => void;
  onOpenYearsInfo?: () => void;
  onOpenPurchaseInfo?: () => void;
  className?: string;
}

export const InputCard: React.FC<InputCardProps> = ({
  plan,
  onPlanUpdate,
  onAddWithdrawalClick,
  onEditWithdrawalClick,
  onOpenReturnInfo,
  onOpenYearsInfo,
  onOpenPurchaseInfo,
  className,
}) => {
  // Determine initial account mode based on whether holdings exist
  const { marketValue: initialMarketValue, principal: initialPrincipal } =
    sumHoldings(plan.initialHoldings);
  const hasExistingHoldings = initialMarketValue > 0 || initialPrincipal > 0;

  const [accountMode, setAccountMode] = useState<AccountMode>(
    hasExistingHoldings ? 'existing' : 'fresh'
  );

  const [isWithdrawalExpanded, setIsWithdrawalExpanded] = useState<boolean>(
    plan.withdrawals.length > 0
  );

  const handleModeChange = (mode: AccountMode) => {
    setAccountMode(mode);
    if (mode === 'fresh') {
      // Clear holdings for fresh start
      onPlanUpdate({
        initialHoldings: {
          tsumitate: { principal: 0, marketValue: 0 },
          growth: { principal: 0, marketValue: 0 },
        },
      });
    }
  };

  const handleHoldingsChange = (holdings: Holdings) => {
    onPlanUpdate({ initialHoldings: holdings });
  };

  return (
    <div
      className={cn(
        'w-full max-w-[361px] card p-4 flex flex-col gap-3',
        className
      )}
    >
      {/* Account Selector (Fresh Start vs Existing Account) */}
      <AccountSelector mode={accountMode} onChange={handleModeChange} />

      {/* Info Hint Banner */}
      <div className="w-full flex flex-col items-center">
        <InfoBanner />
      </div>

      {/* Initial Holdings (Only shown when 'existing' account is active) */}
      {accountMode === 'existing' && (
        <InitialHoldingsSection
          holdings={plan.initialHoldings}
          onChange={handleHoldingsChange}
        />
      )}

      {/* Basic Simulation Settings */}
      <SimulationSettings
        plan={plan}
        onPlanUpdate={onPlanUpdate}
        onOpenReturnInfo={onOpenReturnInfo}
        onOpenYearsInfo={onOpenYearsInfo}
      />

      {/* Purchase Settings */}
      <PurchaseSettings
        plan={plan}
        onPlanUpdate={onPlanUpdate}
        onOpenPurchaseInfo={onOpenPurchaseInfo}
      />

      {/* Withdrawal List Section */}
      <div className="flex flex-col gap-3 w-full">
        <WithdrawalHeader
          isExpanded={isWithdrawalExpanded}
          onToggle={() => setIsWithdrawalExpanded(!isWithdrawalExpanded)}
          count={plan.withdrawals.length}
        />

        {isWithdrawalExpanded && (
          <>
            <WithdrawalList
              withdrawals={plan.withdrawals}
              onEdit={onEditWithdrawalClick}
            />
            <AddWithdrawalButton onClick={onAddWithdrawalClick} />
          </>
        )}
      </div>
    </div>
  );
};
