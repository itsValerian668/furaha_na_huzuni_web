import {
  AlertTriangle,
  HandCoins,
  Landmark,
  PieChart,
  PiggyBank,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
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
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  adminOverview,
  loanPortfolioSeries,
  memberGrowthSeries,
  profitTrendSeries,
  savingsGrowthSeries,
  systemAlerts,
} from '@/data/admin'
import { getMemberTransactions } from '@/data/transactions'
import { currentMember } from '@/data/members'
import { TransactionRow } from '@/components/financial/TransactionRow'
import { formatCurrency, formatCurrencyCompact } from '@/utils/currency'

const ALERT_TONE: Record<string, string> = {
  high: 'border-negative/25 bg-negative-soft text-negative',
  medium: 'border-warning/25 bg-warning-soft text-warning',
  low: 'border-brand/20 bg-brand-soft text-brand-strong',
}

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const recentTransactions = getMemberTransactions(currentMember.id).slice(0, 4)

  return (
    <div>
      <PageHeader
        title="Cooperative Administration"
        description="Monitor financial performance, members, lending and community activity."
        breadcrumbs={[{ label: 'Administration' }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Members"
          amount={adminOverview.totalMembers}
          format="count"
          icon={Users}
          helperText={`+${adminOverview.newMembersThisMonth} this month`}
        />
        <StatCard
          label="Total Savings"
          amount={adminOverview.totalSavings}
          compact
          icon={PiggyBank}
        />
        <StatCard
          label="Active Loans"
          amount={adminOverview.activeLoans}
          compact
          icon={HandCoins}
          tone="neutral"
        />
        <StatCard
          label="Outstanding Loans"
          amount={adminOverview.outstandingLoans}
          compact
          tone="neutral"
          helperText={`${adminOverview.overdueLoans} overdue`}
        />
        <StatCard
          label="Share Capital"
          amount={adminOverview.shareCapital}
          compact
          icon={PieChart}
          tone="gold"
        />
        <StatCard
          label="Welfare Fund"
          amount={adminOverview.welfareFund}
          compact
          tone="neutral"
        />
        <StatCard
          label="Annual Profit"
          amount={adminOverview.annualProfit}
          compact
          icon={Landmark}
          tone="gold"
        />
        <StatCard
          label="Missed Contributions"
          amount={adminOverview.missedContributionsThisWeek}
          format="count"
          tone="neutral"
          helperText="this week"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard
          title="Savings Growth"
          description="Cooperative-wide balance, last 9 months"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={savingsGrowthSeries}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <defs>
                <linearGradient
                  id="adminSavingsFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#0B6655" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0B6655" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
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
              <Area
                dataKey="amount"
                stroke="#0B6655"
                strokeWidth={2.5}
                fill="url(#adminSavingsFill)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-5">
          <p className="text-text mb-3 flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="text-warning size-4" aria-hidden="true" />{' '}
            System Alerts
          </p>
          <div className="flex flex-col gap-2.5">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border px-3 py-2.5 text-xs font-medium ${ALERT_TONE[alert.severity]}`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Loan Portfolio"
          description="Disbursed vs. repaid, monthly"
        >
          <ResponsiveContainer width="100%" height={220}>
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

        <ChartCard
          title="Member Growth"
          description="Total registered members, monthly"
        >
          <ResponsiveContainer width="100%" height={220}>
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
      </div>

      <div className="mb-6">
        <ChartCard
          title="Profit Trend"
          description="Cooperative net profit, by financial year"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
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
              <Bar
                dataKey="profit"
                fill="#C9A45C"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <p className="text-text mb-2 text-sm font-semibold">
            Pending Loan Approvals
          </p>
          <p className="text-text text-3xl font-bold">
            {adminOverview.pendingLoanApprovals}
          </p>
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={() => navigate('/admin/loans')}
          >
            Review loans
          </Button>
        </Card>
        <Card className="p-5">
          <p className="text-text mb-2 text-sm font-semibold">
            Pending Member Applications
          </p>
          <p className="text-text text-3xl font-bold">
            {adminOverview.pendingMemberApplications}
          </p>
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={() => navigate('/admin/members')}
          >
            Review members
          </Button>
        </Card>
        <Card className="p-5">
          <p className="text-text mb-2 text-sm font-semibold">
            Pending Welfare Requests
          </p>
          <p className="text-text text-3xl font-bold">
            {adminOverview.pendingWelfareRequests}
          </p>
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={() => navigate('/admin/welfare')}
          >
            Review requests
          </Button>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between px-5 pt-5">
          <p className="text-text text-sm font-semibold">Recent transactions</p>
          <Button variant="ghost" onClick={() => navigate('/transactions')}>
            View all
          </Button>
        </div>
        <div className="divide-border divide-y px-5">
          {recentTransactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              showMember
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
