import type { DividendRecord } from '@/types/coop'

export const dividendRecords: DividendRecord[] = [
  {
    id: 'DV-2026',
    year: 2026,
    cooperativeProfit: 64_800_000,
    dividendPool: 38_880_000,
    eligibleMembers: 1_212,
    personalDividend: 195_000,
    sharesHeld: 245,
    status: 'CALCULATED',
    distributionRate: 15.9,
  },
  {
    id: 'DV-2025',
    year: 2025,
    cooperativeProfit: 58_200_000,
    dividendPool: 34_920_000,
    eligibleMembers: 1_140,
    personalDividend: 185_000,
    sharesHeld: 201,
    status: 'PAID',
    paidOn: '2026-08-22',
    distributionRate: 15.5,
  },
  {
    id: 'DV-2024',
    year: 2024,
    cooperativeProfit: 49_600_000,
    dividendPool: 29_760_000,
    eligibleMembers: 1_020,
    personalDividend: 142_000,
    sharesHeld: 158,
    status: 'PAID',
    paidOn: '2025-08-19',
    distributionRate: 14.8,
  },
  {
    id: 'DV-2023',
    year: 2023,
    cooperativeProfit: 41_300_000,
    dividendPool: 24_780_000,
    eligibleMembers: 890,
    personalDividend: 108_000,
    sharesHeld: 122,
    status: 'PAID',
    paidOn: '2024-08-15',
    distributionRate: 14.1,
  },
]

/** Non-empty by construction. */
export const currentDividendCycle = dividendRecords[0]!
