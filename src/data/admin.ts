export const adminOverview = {
  totalMembers: 1_248,
  newMembersThisMonth: 24,
  totalSavings: 482_600_000,
  welfareFund: 38_400_000,
  annualProfit: 64_800_000,
  pendingMemberApplications: 9,
  pendingWelfareRequests: 8,
  missedContributionsThisWeek: 12,
}

export const savingsGrowthSeries = [
  { month: 'Jan', amount: 396_000_000 },
  { month: 'Feb', amount: 408_500_000 },
  { month: 'Mar', amount: 419_200_000 },
  { month: 'Apr', amount: 431_800_000 },
  { month: 'May', amount: 444_600_000 },
  { month: 'Jun', amount: 456_100_000 },
  { month: 'Jul', amount: 465_900_000 },
  { month: 'Aug', amount: 474_300_000 },
  { month: 'Sep', amount: 482_600_000 },
]

export const memberGrowthSeries = [
  { month: 'Jan', members: 1_082 },
  { month: 'Feb', members: 1_101 },
  { month: 'Mar', members: 1_124 },
  { month: 'Apr', members: 1_148 },
  { month: 'May', members: 1_169 },
  { month: 'Jun', members: 1_190 },
  { month: 'Jul', members: 1_209 },
  { month: 'Aug', members: 1_224 },
  { month: 'Sep', members: 1_248 },
]

export const profitTrendSeries = [
  { year: '2022', profit: 41_300_000 },
  { year: '2023', profit: 49_600_000 },
  { year: '2024', profit: 58_200_000 },
  { year: '2025', profit: 58_200_000 },
  { year: '2026', profit: 64_800_000 },
]

export const incomeExpenseSeries = [
  { month: 'Jan', income: 18_200_000, expenses: 11_400_000 },
  { month: 'Feb', income: 19_100_000, expenses: 11_900_000 },
  { month: 'Mar', income: 20_400_000, expenses: 12_600_000 },
  { month: 'Apr', income: 21_800_000, expenses: 13_100_000 },
  { month: 'May', income: 22_600_000, expenses: 13_400_000 },
  { month: 'Jun', income: 23_900_000, expenses: 13_900_000 },
  { month: 'Jul', income: 24_700_000, expenses: 14_200_000 },
  { month: 'Aug', income: 25_600_000, expenses: 14_800_000 },
  { month: 'Sep', income: 26_400_000, expenses: 15_100_000 },
]

export const financialSummary = {
  revenue: 26_400_000,
  expenses: 15_100_000,
  netProfit: 11_300_000,
  cashPosition: 58_900_000,
  assets: 612_400_000,
  liabilities: 148_200_000,
  capital: 464_200_000,
}

export const systemAlerts = [
  {
    id: 'AL-2',
    severity: 'medium' as const,
    message: '12 members missed this week’s savings contribution.',
  },
]