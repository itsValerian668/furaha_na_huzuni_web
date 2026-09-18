import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartCard } from '@/components/financial/ChartCard'
import { ReportShell } from '@/components/financial/ReportShell'
import { Card } from '@/components/ui/Card'
import { financialSummary, incomeExpenseSeries } from '@/data/admin'
import { formatCurrency, formatCurrencyCompact } from '@/utils/currency'

export function AdminReportsFinancialPage() {
  return (
    <ReportShell
      title="Financial Report"
      description="Cooperative-wide income, expenses and profitability."
      breadcrumbs={[
        { label: 'Administration', to: '/admin' },
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Financial' },
      ]}
      stats={[
        { label: 'Revenue', amount: financialSummary.revenue, compact: true },
        { label: 'Expenses', amount: financialSummary.expenses, compact: true },
        {
          label: 'Net Profit',
          amount: financialSummary.netProfit,
          compact: true,
        },
        {
          label: 'Cash Position',
          amount: financialSummary.cashPosition,
          compact: true,
        },
      ]}
    >
      <ChartCard
        title="Income vs. Expenses"
        description="Monthly performance"
        className="mb-6"
      >
        <ResponsiveContainer width="100%" height={260}>
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
    </ReportShell>
  )
}
