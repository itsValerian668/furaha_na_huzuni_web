import {
  FileText,
  HandCoins,
  HeartHandshake,
  PiggyBank,
  Plus,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { AddSavingsModal } from '@/components/financial/AddSavingsModal'
import { BuySharesModal } from '@/components/financial/BuySharesModal'
import { ChartCard } from '@/components/financial/ChartCard'
import { RequestSupportModal } from '@/components/financial/RequestSupportModal'
import { StatCard } from '@/components/financial/StatCard'
import { TransactionRow } from '@/components/financial/TransactionRow'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { currentMember } from '@/data/members'
import { savingsGoals, savingsOverview } from '@/data/savings'
import { getActiveLoan, availableCredit } from '@/data/loans'
import { currentDividendCycle } from '@/data/dividends'
import { welfareOverview } from '@/data/welfare'
import { getMemberTransactions } from '@/data/transactions'
import { useAuthStore } from '@/stores/auth.store'
import {
  formatCurrency,
  formatCurrencyCompact,
  formatPercent,
} from '@/utils/currency'
import { formatDate } from '@/utils/date'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const DISTRIBUTION_COLORS = ['#0B6655', '#C9A45C', '#159A78', '#7A817C']

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const [savingsModalOpen, setSavingsModalOpen] = useState(false)
  const [sharesModalOpen, setSharesModalOpen] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false)

  const firstName = (user?.name ?? currentMember.name).split(' ')[0]
  const activeLoan = getActiveLoan(currentMember.id)
  const recentTransactions = getMemberTransactions(currentMember.id).slice(0, 5)
  const primaryGoal = savingsGoals[0]! // seeded with at least one goal
  const goalProgress = Math.round(
    (primaryGoal.savedAmount / primaryGoal.targetAmount) * 100,
  )

  const welfareContributedByMember = 120_000
  const distribution = [
    { name: 'Savings', value: currentMember.totalSavings },
    { name: 'Shares', value: currentMember.shareValue },
    { name: 'Loan', value: currentMember.outstandingLoan },
    { name: 'Welfare', value: welfareContributedByMember },
  ].filter((item) => item.value > 0)

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${firstName}`}
        description="Here's your cooperative financial overview."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setSavingsModalOpen(true)}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add Savings
            </Button>
            <Button onClick={() => navigate('/loans/apply')}>
              Apply for Loan
            </Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total Savings"
          amount={currentMember.totalSavings}
          change={savingsOverview.growthThisCycle}
          icon={PiggyBank}
        />
        <StatCard
          label="Shares"
          amount={currentMember.shareValue}
          icon={Wallet}
          tone="gold"
          helperText={`${currentMember.totalShares} shares`}
        />
        <StatCard
          label="Outstanding Loan"
          amount={currentMember.outstandingLoan}
          icon={HandCoins}
          tone="neutral"
          helperText={
            activeLoan
              ? `Next: ${formatDate(activeLoan.nextPaymentDate!)}`
              : 'No active loan'
          }
        />
        <StatCard
          label="Available Credit"
          amount={availableCredit}
          icon={Wallet}
          tone="neutral"
        />
        <StatCard
          label="Estimated Dividend"
          amount={currentDividendCycle.personalDividend}
          icon={HeartHandshake}
          tone="gold"
          helperText="Projected — FY2026"
        />
      </div>

      <div className="border-brand/15 bg-brand-soft mb-6 rounded-2xl border p-5">
        <p className="text-brand-strong text-sm font-medium">
          You're building steadily. Your savings grew{' '}
          {formatPercent(savingsOverview.growthThisCycle, { signed: true })}{' '}
          this cycle, and together, members have supported{' '}
          {welfareOverview.membersSupportedTotal} people this year through the
          welfare fund.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard
          title="Savings Growth"
          description="Balance over the last 9 months"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart
              data={savingsOverview.monthlyGrowth}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <defs>
                <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
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
                fill="url(#savingsFill)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="text-text-muted mt-2 flex justify-between px-2 text-xs">
            {savingsOverview.monthlyGrowth.map((point) => (
              <span key={point.month}>{point.month}</span>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Financial Distribution"
          description="How your position breaks down"
        >
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={distribution}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                isAnimationActive={false}
              >
                {distribution.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 flex flex-col gap-1.5">
            {distribution.map((entry, index) => (
              <li
                key={entry.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-text-muted flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor:
                        DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length],
                    }}
                  />
                  {entry.name}
                </span>
                <span className="text-text font-medium">
                  {formatCurrencyCompact(entry.value)}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <p className="text-text mb-3 text-sm font-semibold">Savings goal</p>
          <p className="text-text-muted text-xs">{primaryGoal.name}</p>
          <p className="text-text mt-1 text-xl font-bold">
            {goalProgress}% complete
          </p>
          <ProgressBar
            value={primaryGoal.savedAmount}
            max={primaryGoal.targetAmount}
            className="mt-3"
          />
          <p className="text-text-muted mt-2 text-xs">
            {formatCurrency(primaryGoal.savedAmount)} of{' '}
            {formatCurrency(primaryGoal.targetAmount)}
          </p>

          <div className="border-border mt-5 border-t pt-4">
            <p className="text-text mb-3 text-sm font-semibold">
              Upcoming obligations
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-text-muted">Weekly savings</span>
                <span className="text-text font-medium">Fri, 12 Sep</span>
              </li>
              {activeLoan && (
                <li className="flex items-center justify-between">
                  <span className="text-text-muted">Loan repayment</span>
                  <span className="text-text font-medium">
                    {formatDate(activeLoan.nextPaymentDate!)}
                  </span>
                </li>
              )}
              <li className="flex items-center justify-between">
                <span className="text-text-muted">Share contribution</span>
                <span className="text-text font-medium">Mon, 1 Oct</span>
              </li>
            </ul>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent transactions"
            description="Your latest cooperative activity"
            action={
              <Button variant="ghost" onClick={() => navigate('/transactions')}>
                View all
              </Button>
            }
          />
          <div className="divide-border divide-y px-5">
            {recentTransactions.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="Your activity will show up here."
              />
            ) : (
              recentTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setSavingsModalOpen(true)}>
          <PiggyBank className="size-4" aria-hidden="true" /> Add Savings
        </Button>
        <Button variant="secondary" onClick={() => setSharesModalOpen(true)}>
          <Wallet className="size-4" aria-hidden="true" /> Buy Shares
        </Button>
        <Button variant="secondary" onClick={() => navigate('/loans/apply')}>
          <HandCoins className="size-4" aria-hidden="true" /> Apply for Loan
        </Button>
        <Button variant="secondary" onClick={() => setSupportModalOpen(true)}>
          <HeartHandshake className="size-4" aria-hidden="true" /> Request
          Support
        </Button>
        <Button variant="secondary" onClick={() => navigate('/statements')}>
          <FileText className="size-4" aria-hidden="true" /> View Statement
        </Button>
      </div>

      <AddSavingsModal
        open={savingsModalOpen}
        onClose={() => setSavingsModalOpen(false)}
      />
      <BuySharesModal
        open={sharesModalOpen}
        onClose={() => setSharesModalOpen(false)}
      />
      <RequestSupportModal
        open={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  )
}
