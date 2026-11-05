import { afterEach, describe, expect, it } from 'vitest'

import {
  calculateFinancialSummary,
  useFinanceStore,
} from '@/stores/finance.store'

describe('finance store', () => {
  afterEach(() => {
    useFinanceStore.setState({ expenses: [] })
    localStorage.removeItem('coop-finance-expenses')
  })

  it('deducts a recorded expense from cash, profit, assets and capital', () => {
    expect(
      useFinanceStore
        .getState()
        .recordExpense('Venue hire', 1_250_000, '2026-10-21'),
    ).toBe(true)

    const expenses = useFinanceStore.getState().expenses
    expect(expenses.map((expense) => expense.balanceAfter)).toEqual([
      57_650_000,
    ])
    expect(calculateFinancialSummary(expenses)).toMatchObject({
      expenses: 16_350_000,
      netProfit: 10_050_000,
      cashPosition: 57_650_000,
      assets: 611_150_000,
      liabilities: 148_200_000,
      capital: 462_950_000,
      recordedExpenses: 1_250_000,
    })
  })

  it('rejects expenses that exceed available cash', () => {
    expect(
      useFinanceStore
        .getState()
        .recordExpense('Over budget', 58_900_001, '2026-10-21'),
    ).toBe(false)
    expect(useFinanceStore.getState().expenses).toHaveLength(0)
  })
})
