import { create } from 'zustand';
import { NisaPlanState } from '../types/state';
import { MilestoneWithdrawal, SimulationResult } from '../types/nisa';
import { DEFAULT_PLAN_STATE } from '../engine/constants';
import { simulateNisaPlan } from '../engine/ledger';
import { readPlanFromUrl } from '../url/urlUtils';

interface PlanStore {
  plan: NisaPlanState;
  result: SimulationResult;

  setPlan: (plan: NisaPlanState) => void;
  updatePlan: (updates: Partial<NisaPlanState>) => void;
  addWithdrawal: (withdrawal: Omit<MilestoneWithdrawal, 'id'>) => void;
  updateWithdrawal: (id: string, updates: Partial<MilestoneWithdrawal>) => void;
  removeWithdrawal: (id: string) => void;
  resetToDefault: () => void;
}

function getInitialPlan(): NisaPlanState {
  if (typeof window === 'undefined') return DEFAULT_PLAN_STATE;
  return readPlanFromUrl(window.location.hash) ?? DEFAULT_PLAN_STATE;
}

const initialPlan = getInitialPlan();

export const usePlanStore = create<PlanStore>((set) => ({
  plan: initialPlan,
  result: simulateNisaPlan(initialPlan),

  setPlan: (plan) => {
    set({ plan, result: simulateNisaPlan(plan) });
  },

  updatePlan: (updates) => {
    set((state) => {
      const plan = { ...state.plan, ...updates };
      return { plan, result: simulateNisaPlan(plan) };
    });
  },

  addWithdrawal: (withdrawal) => {
    set((state) => {
      const plan = {
        ...state.plan,
        withdrawals: [
          ...state.plan.withdrawals,
          { ...withdrawal, id: crypto.randomUUID() },
        ],
      };
      return { plan, result: simulateNisaPlan(plan) };
    });
  },

  updateWithdrawal: (id, updates) => {
    set((state) => {
      const plan = {
        ...state.plan,
        withdrawals: state.plan.withdrawals.map((w) =>
          w.id === id ? { ...w, ...updates } : w
        ),
      };
      return { plan, result: simulateNisaPlan(plan) };
    });
  },

  removeWithdrawal: (id) => {
    set((state) => {
      const plan = {
        ...state.plan,
        withdrawals: state.plan.withdrawals.filter((w) => w.id !== id),
      };
      return { plan, result: simulateNisaPlan(plan) };
    });
  },

  resetToDefault: () => {
    set({
      plan: DEFAULT_PLAN_STATE,
      result: simulateNisaPlan(DEFAULT_PLAN_STATE),
    });
  },
}));
