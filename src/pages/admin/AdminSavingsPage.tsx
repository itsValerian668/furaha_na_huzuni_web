import { Plus } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

import { ChartCard } from '@/components/financial/ChartCard'
import { StatCard } from '@/components/financial/StatCard'
import { DataTable } from '@/components/tables/DataTable'
import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { adminOverview, savingsGrowthSeries } from '@/data/admin'
import { members } from '@/data/members'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function AdminSavingsPage() {
  const activeSavers = members.filter((member) => member.totalSavings > 0)

  return (
    <div>
      <PageHeader
        title="Savings Management"
        description="Monitor cooperative-wide savings and member contributions."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Savings' },
        ]}
        actions={
          <Button onClick={() => toast('Contribution recorded successfully.')}>
            <Plus className="size-4" aria-hidden="true" /> Record Contribution
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Savings"
          amount={adminOverview.totalSavings}
          compact
        />
        <StatCard
          label="Active Savers"
          amount={activeSavers.length}
          format="count"
          tone="neutral"
        />
        <StatCard
          label="Missed Contributions"
          amount={adminOverview.missedContributionsThisWeek}
          format="count"
          tone="neutral"
          helperText="this week"
        />
        <StatCard
          label="Weekly Contributions"
          amount={activeSavers.length * 50_000}
          compact
          tone="gold"
        />
      </div>

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
                id="adminSavingsPageFill"
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
              fill="url(#adminSavingsPageFill)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <DataTable
        data={members}
        keyField={(row) => row.id}
        searchFields={(row) => [row.name, row.memberNumber]}
        searchPlaceholder="Search members…"
        toolbar={
          <Button
            variant="secondary"
            onClick={() => toast('Savings register exported.')}
          >
            Export
          </Button>
        }
        rowActions={() => (
          <button
            type="button"
            onClick={() => toast('Contribution approved.')}
            className="text-brand-strong text-sm font-medium hover:underline"
          >
            Approve
          </button>
        )}
        columns={[
          {
            key: 'name',
            header: 'Member',
            render: (row) => (
              <span className="flex items-center gap-2.5">
                <MemberAvatar
                  name={row.name}
                  color={row.avatarColor}
                  size={28}
                />
                <span className="text-text font-medium">{row.name}</span>
              </span>
            ),
          },
          {
            key: 'joined',
            header: 'Joined',
            render: (row) => formatDate(row.joinedOn),
          },
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
    </div>
  )
}
