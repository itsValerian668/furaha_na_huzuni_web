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
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { adminOverview, loanPortfolioSeries } from '@/data/admin'
import { loans } from '@/data/loans'
import { formatCurrency, formatCurrencyCompact } from '@/utils/currency'

export function AdminReportsLoansPage() {
  return (
    <ReportShell
      title="Loan Report"
      description="Portfolio performance, repayment and overdue analysis."
      breadcrumbs={[
        { label: 'Administration', to: '/admin' },
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Loans' },
      ]}
      stats={[
        {
          label: 'Active Loans',
          amount: adminOverview.activeLoans,
          compact: true,
        },
        {
          label: 'Outstanding',
          amount: adminOverview.outstandingLoans,
          compact: true,
        },
        {
          label: 'Overdue Loans',
          amount: adminOverview.overdueLoans,
          format: 'count',
        },
        {
          label: 'Pending Approvals',
          amount: adminOverview.pendingLoanApprovals,
          format: 'count',
        },
      ]}
    >
      <ChartCard
        title="Loan Portfolio"
        description="Disbursed vs. repaid, monthly"
        className="mb-6"
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={loanPortfolioSeries}
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
              dataKey="disbursed"
              fill="#0B6655"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="repaid"
              fill="#C9A45C"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <DataTable
        data={loans}
        keyField={(row) => row.id}
        searchFields={(row) => [row.memberName, row.reference, row.type]}
        searchPlaceholder="Search loans…"
        columns={[
          { key: 'member', header: 'Member', render: (row) => row.memberName },
          { key: 'type', header: 'Type', render: (row) => row.type },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: 'outstanding',
            header: 'Outstanding',
            align: 'right',
            render: (row) => (
              <span className="text-text font-semibold">
                {formatCurrency(row.outstandingBalance)}
              </span>
            ),
          },
        ]}
      />
    </ReportShell>
  )
}
