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
  const hasExistingHoldings =
    plan.initialHoldings.tsumitate.principal > 0 ||
    plan.initialHoldings.tsumitate.marketValue > 0 ||
    plan.initialHoldings.growth.principal > 0 ||
    plan.initialHoldings.growth.marketValue > 0;

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
        'w-full max-w-[361px] bg-bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col gap-4 shadow-sm',
        className
      )}
    >
      {/* Account Selector (Fresh Start vs Existing Account) */}
      <AccountSelector mode={accountMode} onChange={handleModeChange} />

      {/* Info Hint Banner */}
      <InfoBanner />

      {/* Initial Holdings (Only shown when 'existing' account is active) */}
      {accountMode === 'existing' && (
        <div className="border-b border-border-subtle pb-4">
          <InitialHoldingsSection
            holdings={plan.initialHoldings}
            onChange={handleHoldingsChange}
          />
        </div>
      )}

      {/* Basic Simulation Settings */}
      <div className="border-b border-border-subtle pb-4">
        <SimulationSettings
          expectedReturnRate={plan.expectedReturnRate}
          horizonYears={plan.horizonYears}
          onReturnRateChange={(expectedReturnRate) =>
            onPlanUpdate({ expectedReturnRate })
          }
          onHorizonYearsChange={(horizonYears) =>
            onPlanUpdate({ horizonYears })
          }
          onOpenReturnInfo={onOpenReturnInfo}
          onOpenYearsInfo={onOpenYearsInfo}
        />
      </div>

      {/* Purchase Settings */}
      <div className="border-b border-border-subtle pb-4">
        <PurchaseSettings
          tsumitateMonthly={plan.tsumitateMonthly}
          growthMonthly={plan.growthMonthly}
          growthAnnualLumpSum={plan.growthAnnualLumpSum}
          onTsumitateMonthlyChange={(tsumitateMonthly) =>
            onPlanUpdate({ tsumitateMonthly })
          }
          onGrowthMonthlyChange={(growthMonthly) =>
            onPlanUpdate({ growthMonthly })
          }
          onGrowthAnnualLumpSumChange={(growthAnnualLumpSum) =>
            onPlanUpdate({ growthAnnualLumpSum })
          }
          onOpenPurchaseInfo={onOpenPurchaseInfo}
        />
      </div>

      {/* Withdrawal List Section */}
      <div className="flex flex-col gap-3">
        <WithdrawalHeader
          isExpanded={isWithdrawalExpanded}
          onToggle={() => setIsWithdrawalExpanded(!isWithdrawalExpanded)}
          count={plan.withdrawals.length}
        />

        {isWithdrawalExpanded && (
          <div className="flex flex-col gap-3 pt-1">
            <WithdrawalList
              withdrawals={plan.withdrawals}
              onEdit={onEditWithdrawalClick}
            />
            <AddWithdrawalButton onClick={onAddWithdrawalClick} />
          </div>
        )}
      </div>
    </div>
  );
};
