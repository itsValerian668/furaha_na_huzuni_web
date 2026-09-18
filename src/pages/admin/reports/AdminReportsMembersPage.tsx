import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartCard } from '@/components/financial/ChartCard'
import { ReportShell } from '@/components/financial/ReportShell'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { adminOverview, memberGrowthSeries } from '@/data/admin'
import { members } from '@/data/members'
import { formatDate } from '@/utils/date'

export function AdminReportsMembersPage() {
  const active = members.filter((member) => member.status === 'ACTIVE').length
  const pending = members.filter((member) => member.status === 'PENDING').length

  return (
    <ReportShell
      title="Member Report"
      description="Membership growth, status mix and branch distribution."
      breadcrumbs={[
        { label: 'Administration', to: '/admin' },
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Members' },
      ]}
      stats={[
        {
          label: 'Total Members',
          amount: adminOverview.totalMembers,
          format: 'count',
        },
        { label: 'Active Members', amount: active, format: 'count' },
        { label: 'Pending Applications', amount: pending, format: 'count' },
        {
          label: 'New This Month',
          amount: adminOverview.newMembersThisMonth,
          format: 'count',
        },
      ]}
    >
      <ChartCard
        title="Member Growth"
        description="Total registered members, monthly"
        className="mb-6"
      >
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={memberGrowthSeries}
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
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="members"
              stroke="#159A78"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
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
            key: 'joined',
            header: 'Joined',
            render: (row) => formatDate(row.joinedOn),
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
