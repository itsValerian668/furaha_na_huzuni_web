import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

import { ChartCard } from '@/components/financial/ChartCard'
import { ReportShell } from '@/components/financial/ReportShell'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { adminOverview, savingsGrowthSeries } from '@/data/admin'
import { members } from '@/data/members'
import { formatCurrency } from '@/utils/currency'

export function AdminReportsSavingsPage() {
  const activeSavers = members.filter(
    (member) => member.totalSavings > 0,
  ).length

  return (
    <ReportShell
      title="Savings Report"
      description="Cooperative-wide savings performance and contribution trends."
      breadcrumbs={[
        { label: 'Administration', to: '/admin' },
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Savings' },
      ]}
      stats={[
        {
          label: 'Total Savings',
          amount: adminOverview.totalSavings,
          compact: true,
        },
        { label: 'Active Savers', amount: activeSavers, format: 'count' },
        {
          label: 'Missed Contributions',
          amount: adminOverview.missedContributionsThisWeek,
          format: 'count',
          helperText: 'this week',
        },
        {
          label: 'Avg. Balance',
          amount: Math.round(adminOverview.totalSavings / activeSavers),
          compact: true,
        },
      ]}
    >
      <ChartCard
        title="Savings Growth"
        description="Cooperative-wide balance, last 9 months"
        className="mb-6"
      >
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={savingsGrowthSeries}
            margin={{ left: 4, right: 12, top: 8 }}
          >
            <defs>
              <linearGradient
                id="reportSavingsFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#0B6655" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0B6655" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: 13,
              }}
            />
            <Area
              dataKey="amount"
              stroke="#0B6655"
              strokeWidth={2.5}
              fill="url(#reportSavingsFill)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <DataTable
        data={members}
        keyField={(row) => row.id}
        searchFields={(row) => [row.name, row.branch]}
        searchPlaceholder="Search by member or branch…"
        columns={[
          { key: 'name', header: 'Member', render: (row) => row.name },
          { key: 'branch', header: 'Branch', render: (row) => row.branch },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: 'savings',
            header: 'Savings',
            align: 'right',
            render: (row) => (
              <span className="text-text font-semibold">
                {formatCurrency(row.totalSavings)}
              </span>
            ),
          },
        ]}
      />
    </ReportShell>
  )
}
