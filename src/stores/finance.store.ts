import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { financialSummary } from '@/data/admin'

export interface FinanceExpense {
  id: string
  date: string
  description: string
  amount: number
  balanceAfter: number
}

export function calculateFinancialSummary(expenses: FinanceExpense[]) {
  const recordedExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  )

  return {
    ...financialSummary,
    expenses: financialSummary.expenses + recordedExpenses,
    netProfit: financialSummary.netProfit - recordedExpenses,
    cashPosition: financialSummary.cashPosition - recordedExpenses,
    assets: financialSummary.assets - recordedExpenses,
    capital: financialSummary.capital - recordedExpenses,
    recordedExpenses,
  }
}

interface FinanceState {
  expenses: FinanceExpense[]
  recordExpense: (
    description: string,
    amount: number,
    date: string,
  ) => boolean
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      expenses: [],

      recordExpense: (description, amount, date) => {
        const currentSummary = calculateFinancialSummary(get().expenses)
        if (
          !Number.isSafeInteger(amount) ||
          amount <= 0 ||
          amount > currentSummary.cashPosition ||
          !description.trim() ||
          !date
        ) {
          return false
        }

        set((state) => ({
          expenses: [
            {
              id: `EXP-${Date.now()}`,
              date,
              description: description.trim(),
              amount,
              balanceAfter: currentSummary.cashPosition - amount,
            },
            ...state.expenses,
          ],
        }))

        return true
      },
    }),
    {
      name: 'coop-finance-expenses',
    },
  ),
)
