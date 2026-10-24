import { Plus } from 'lucide-react'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartCard } from '@/components/financial/ChartCard'
import { StatCard } from '@/components/financial/StatCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { incomeExpenseSeries, profitTrendSeries } from '@/data/admin'
import {
  calculateFinancialSummary,
  useFinanceStore,
} from '@/stores/finance.store'
import { toast } from '@/stores/toast.store'
import { formatCurrency, formatCurrencyCompact } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function AdminFinancePage() {
  const expenses = useFinanceStore((state) => state.expenses)
  const recordExpense = useFinanceStore((state) => state.recordExpense)
  const summary = calculateFinancialSummary(expenses)
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(getLocalDateValue())
  const amountValue = Number(amount)
  const canPreviewAmount =
    Number.isSafeInteger(amountValue) && amountValue > 0

  function closeExpenseModal() {
    setExpenseModalOpen(false)
    setDescription('')
    setAmount('')
    setDate(getLocalDateValue())
  }

  function handleRecordExpense() {
    if (!description.trim()) {
      toast('Please enter an expense description.')
      return
    }

    if (!canPreviewAmount) {
      toast('Enter a valid whole-number amount greater than zero.')
      return
    }

    if (!date) {
      toast('Please select the expense date.')
      return
    }

    if (amountValue > summary.cashPosition) {
      toast('The expense cannot exceed the available cash balance.')
      return
    }

    const recorded = recordExpense(description, amountValue, date)
    if (!recorded) {
      toast('The expense could not be recorded. Check the amount and date.')
      return
    }

    toast(
      `Expense recorded. Remaining cash: ${formatCurrency(summary.cashPosition - amountValue)}.`,
    )
    closeExpenseModal()
  }

  return (
    <div>
      <PageHeader
        title="Financial Management"
        description="Income, expenses, cash flow and the cooperative's balance sheet."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Finance' },
        ]}
        actions={
          <Button onClick={() => setExpenseModalOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Record Expense
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" amount={summary.revenue} compact />
        <StatCard
          label="Expenses"
          amount={summary.expenses}
          compact
          tone="neutral"
        />
        <StatCard
          label="Net Profit"
          amount={summary.netProfit}
          compact
          tone="gold"
        />
        <StatCard
          label="Cash Position"
          amount={summary.cashPosition}
          compact
          tone="neutral"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Income vs. Expenses"
          description="Monthly performance"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={incomeExpenseSeries}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatCurrencyCompact(v)}
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: 13,
                }}
              />
              <Bar
                dataKey="income"
                fill="#0B6655"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="expenses"
                fill="#C9A45C"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Profit Trend"
          description="Net profit by financial year"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={profitTrendSeries}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatCurrencyCompact(v)}
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: 13,
                }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#159A78"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="mb-6 p-6">
        <div className="mb-4">
          <h2 className="text-text text-sm font-semibold">
            Recorded Group Expenses
          </h2>
          <p className="text-text-muted mt-1 text-sm">
            Expenses reduce cooperative cash and profit, not members’ savings.
          </p>
        </div>
        {expenses.length === 0 ? (
          <p className="text-text-muted text-sm">
            No additional group expenses have been recorded.
          </p>
        ) : (
          <ul className="divide-border divide-y">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-text text-sm font-medium">
                    {expense.description}
                  </p>
                  <p className="text-text-muted text-xs">
                    {formatDate(expense.date)} · Cash after expense:{' '}
                    {formatCurrency(expense.balanceAfter)}
                  </p>
                </div>
                <span className="text-text text-sm font-semibold">
                  −{formatCurrency(expense.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-6">
        <p className="text-text mb-4 text-sm font-semibold">
          Balance Sheet Summary
        </p>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-text-muted text-xs">Assets</dt>
            <dd className="text-text text-lg font-bold">
              {formatCurrency(summary.assets)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Liabilities</dt>
            <dd className="text-text text-lg font-bold">
              {formatCurrency(summary.liabilities)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Capital</dt>
            <dd className="text-text text-lg font-bold">
              {formatCurrency(summary.capital)}
            </dd>
          </div>
        </dl>
      </Card>

      <Modal
        open={expenseModalOpen}
        onClose={closeExpenseModal}
        dialogLabel="Record expense form"
        footer={
          <>
            <Button variant="secondary" onClick={closeExpenseModal}>
              Cancel
            </Button>
            <Button onClick={handleRecordExpense}>Record expense</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Expense description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Meeting hall hire"
            required
          />
          <Input
            label="Amount (TSh)"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={amount}
            onChange={(event) => {
              const value = event.target.value
              if (/^\d*$/.test(value)) {
                setAmount(value)
              }
            }}
            required
          />
          <Input
            label="Date"
            type="date"
            max={getLocalDateValue()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
          <div
            className="bg-surface-sunken rounded-lg p-3"
            aria-live="polite"
          >
            <p className="text-text-muted text-xs">Cash after this expense</p>
            {canPreviewAmount && amountValue > summary.cashPosition ? (
              <p className="text-negative mt-1 text-sm font-semibold">
                Amount exceeds available cash (
                {formatCurrency(summary.cashPosition)}).
              </p>
            ) : (
              <p className="text-text mt-1 text-base font-semibold">
                {formatCurrency(
                  summary.cashPosition -
                    (canPreviewAmount ? amountValue : 0),
                )}
              </p>
            )}
          </div>
          <p className="text-text-muted text-xs">
            This demo saves expenses in this browser; it does not send them to
            a backend.
          </p>
        </div>
      </Modal>
    </div>
  )
}

function getLocalDateValue() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${today.getFullYear()}-${month}-${day}`
}
