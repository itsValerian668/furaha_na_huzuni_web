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
import { currentDividendCycle, dividendRecords } from '@/data/dividends'
import { formatCurrency, formatCurrencyCompact } from '@/utils/currency'

export function AdminReportsDividendsPage() {
  return (
    <ReportShell
      title="Dividend Report"
      description="Distribution history and this year's projection."
      breadcrumbs={[
        { label: 'Administration', to: '/admin' },
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Dividends' },
      ]}
      stats={[
        {
          label: 'Dividend Pool (FY2026)',
          amount: currentDividendCycle.dividendPool,
          compact: true,
        },
        {
          label: 'Eligible Members',
          amount: currentDividendCycle.eligibleMembers,
          format: 'count',
        },
        {
          label: 'Distribution Rate',
          amount: currentDividendCycle.distributionRate,
          format: 'percent',
        },
        {
          label: 'Cooperative Profit',
          amount: currentDividendCycle.cooperativeProfit,
          compact: true,
        },
      ]}
    >
      <ChartCard
        title="Dividend Pool by Year"
        description="Total pool distributed per financial year"
        className="mb-6"
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={[...dividendRecords].reverse()}
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
            <Bar
              dataKey="dividendPool"
              fill="#C9A45C"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <DataTable
        data={dividendRecords}
        keyField={(row) => row.id}
        columns={[
          {
            key: 'year',
            header: 'Financial Year',
            render: (row) => `FY${row.year}`,
          },
          {
            key: 'pool',
            header: 'Dividend Pool',
            align: 'right',
            render: (row) => formatCurrency(row.dividendPool),
          },
          {
            key: 'eligible',
            header: 'Eligible Members',
            align: 'right',
            render: (row) => row.eligibleMembers.toLocaleString(),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
        ]}
      />
    </ReportShell>
  )
}
