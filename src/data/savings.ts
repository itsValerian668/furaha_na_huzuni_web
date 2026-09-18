import type { SavingsContribution, SavingsGoal } from '@/types/coop'

export const savingsOverview = {
  totalSavings: 2_450_000,
  currentCycle: 'FY2026 — Cycle 3',
  weeklyTarget: 50_000,
  growthThisCycle: 8.4,
  missedContributions: 1,
  monthlyGrowth: [
    { month: 'Jan', amount: 1_680_000 },
    { month: 'Feb', amount: 1_780_000 },
    { month: 'Mar', amount: 1_890_000 },
    { month: 'Apr', amount: 1_950_000 },
    { month: 'May', amount: 2_040_000 },
    { month: 'Jun', amount: 2_160_000 },
    { month: 'Jul', amount: 2_260_000 },
    { month: 'Aug', amount: 2_355_000 },
    { month: 'Sep', amount: 2_450_000 },
  ],
}

export const savingsGoals: SavingsGoal[] = [
  {
    id: 'SG-01',
    name: 'Emergency Buffer',
    targetAmount: 3_000_000,
    savedAmount: 2_280_000,
    targetDate: '2026-12-31',
  },
  {
    id: 'SG-02',
    name: 'Land Purchase Fund',
    targetAmount: 8_000_000,
    savedAmount: 1_500_000,
    targetDate: '2027-06-30',
  },
]

export const savingsContributions: SavingsContribution[] = [
  {
    id: 'SC-01',
    date: '2026-09-08',
    amount: 50_000,
    method: 'MOBILE_MONEY',
    status: 'CONFIRMED',
    cycle: 'FY2026 — Cycle 3',
  },
  {
    id: 'SC-02',
    date: '2026-08-15',
    amount: 50_000,
    method: 'MOBILE_MONEY',
    status: 'CONFIRMED',
    cycle: 'FY2026 — Cycle 3',
  },
  {
    id: 'SC-03',
    date: '2026-08-01',
    amount: 50_000,
    method: 'CASH',
    status: 'CONFIRMED',
    cycle: 'FY2026 — Cycle 3',
  },
  {
    id: 'SC-04',
    date: '2026-07-18',
    amount: 50_000,
    method: 'MOBILE_MONEY',
    status: 'CONFIRMED',
    cycle: 'FY2026 — Cycle 2',
  },
  {
    id: 'SC-05',
    date: '2026-07-04',
    amount: 50_000,
    method: 'BANK_TRANSFER',
    status: 'CONFIRMED',
    cycle: 'FY2026 — Cycle 2',
  },
  {
    id: 'SC-06',
    date: '2026-06-20',
    amount: 40_000,
    method: 'MOBILE_MONEY',
    status: 'CONFIRMED',
    cycle: 'FY2026 — Cycle 2',
  },
  {
    id: 'SC-07',
    date: '2026-06-06',
    amount: 50_000,
    method: 'CASH',
    status: 'CONFIRMED',
    cycle: 'FY2026 — Cycle 2',
  },
  {
    id: 'SC-08',
    date: '2026-05-23',
    amount: 50_000,
    method: 'MOBILE_MONEY',
    status: 'CONFIRMED',
    cycle: 'FY2026 — Cycle 1',
  },
]
