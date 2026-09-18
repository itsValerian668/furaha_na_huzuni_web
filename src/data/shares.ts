import type { SharePurchase } from '@/types/coop'

export const shareOverview = {
  totalShares: 245,
  shareValue: 5_000,
  totalValue: 1_225_000,
  ownershipPercent: 0.31,
  currentCycle: 'FY2026 — Cycle 3',
  sharesThisYear: 44,
  growth: [
    { month: 'Jan', shares: 190 },
    { month: 'Feb', shares: 198 },
    { month: 'Mar', shares: 206 },
    { month: 'Apr', shares: 212 },
    { month: 'May', shares: 220 },
    { month: 'Jun', shares: 228 },
    { month: 'Jul', shares: 234 },
    { month: 'Aug', shares: 241 },
    { month: 'Sep', shares: 245 },
  ],
}

export const sharePurchases: SharePurchase[] = [
  {
    id: 'SP-01',
    date: '2026-09-01',
    shares: 4,
    amount: 20_000,
    status: 'CONFIRMED',
  },
  {
    id: 'SP-02',
    date: '2026-08-01',
    shares: 4,
    amount: 20_000,
    status: 'CONFIRMED',
  },
  {
    id: 'SP-03',
    date: '2026-07-01',
    shares: 6,
    amount: 30_000,
    status: 'CONFIRMED',
  },
  {
    id: 'SP-04',
    date: '2026-06-01',
    shares: 4,
    amount: 20_000,
    status: 'CONFIRMED',
  },
  {
    id: 'SP-05',
    date: '2026-05-01',
    shares: 8,
    amount: 40_000,
    status: 'CONFIRMED',
  },
  {
    id: 'SP-06',
    date: '2026-04-01',
    shares: 6,
    amount: 30_000,
    status: 'CONFIRMED',
  },
  {
    id: 'SP-07',
    date: '2026-03-01',
    shares: 8,
    amount: 40_000,
    status: 'CONFIRMED',
  },
  {
    id: 'SP-08',
    date: '2026-02-01',
    shares: 4,
    amount: 20_000,
    status: 'CONFIRMED',
  },
]
