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
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  financialSummary,
  incomeExpenseSeries,
  profitTrendSeries,
} from '@/data/admin'
import { formatCurrency, formatCurrencyCompact } from '@/utils/currency'

export function AdminFinancePage() {
  return (
    <div>
      <PageHeader
        title="Financial Management"
        description="Income, expenses, cash flow and the cooperative's balance sheet."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Finance' },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" amount={financialSummary.revenue} compact />
        <StatCard
          label="Expenses"
          amount={financialSummary.expenses}
          compact
          tone="neutral"
        />
        <StatCard
          label="Net Profit"
          amount={financialSummary.netProfit}
          compact
          tone="gold"
        />
        <StatCard
          label="Cash Position"
          amount={financialSummary.cashPosition}
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

      <Card className="p-6">
        <p className="text-text mb-4 text-sm font-semibold">
          Balance Sheet Summary
        </p>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-text-muted text-xs">Assets</dt>
            <dd className="text-text text-lg font-bold">
              {formatCurrency(financialSummary.assets)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Liabilities</dt>
            <dd className="text-text text-lg font-bold">
              {formatCurrency(financialSummary.liabilities)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Capital</dt>
            <dd className="text-text text-lg font-bold">
              {formatCurrency(financialSummary.capital)}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
