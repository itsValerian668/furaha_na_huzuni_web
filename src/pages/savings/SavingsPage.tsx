import { Plus, Target } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

import { AddSavingsModal } from '@/components/financial/AddSavingsModal'
import { ChartCard } from '@/components/financial/ChartCard'
import { StatCard } from '@/components/financial/StatCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { savingsGoals, savingsOverview } from '@/data/savings'
import { formatCurrency } from '@/utils/currency'

export function SavingsPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <PageHeader
        title="Savings"
        description="Your regular contributions, growth and savings goals."
        breadcrumbs={[{ label: 'Savings' }]}
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Add Contribution
          </Button>
        }
      />

      <SectionTabs
        items={[
          { label: 'Overview', to: '/savings', end: true },
          { label: 'History', to: '/savings/history' },
          { label: 'Goals', to: '/savings/goals' },
          { label: 'Contributions', to: '/savings/contributions' },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Savings"
          amount={savingsOverview.totalSavings}
          change={savingsOverview.growthThisCycle}
        />
        <StatCard
          label="Weekly Target"
          amount={savingsOverview.weeklyTarget}
          tone="neutral"
          helperText={savingsOverview.currentCycle}
        />
        <StatCard
          label="Missed Contributions"
          amount={
            savingsOverview.missedContributions * savingsOverview.weeklyTarget
          }
          tone="neutral"
          helperText={`${savingsOverview.missedContributions} missed this cycle`}
        />
        <StatCard
          label="Savings Goals"
          amount={savingsGoals.reduce((sum, goal) => sum + goal.savedAmount, 0)}
          tone="gold"
          helperText={`${savingsGoals.length} active goals`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard
          title="Savings Growth"
          description="Your balance over the last 9 months"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={savingsOverview.monthlyGrowth}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <defs>
                <linearGradient
                  id="savingsPageFill"
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
                fill="url(#savingsPageFill)"
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

        <Card className="p-5">
          <p className="text-text mb-4 flex items-center gap-2 text-sm font-semibold">
            <Target className="text-brand size-4" aria-hidden="true" /> Savings
            Goals
          </p>
          <div className="flex flex-col gap-5">
            {savingsGoals.map((goal) => {
              const percent = Math.round(
                (goal.savedAmount / goal.targetAmount) * 100,
              )
              return (
                <div key={goal.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-text font-medium">{goal.name}</span>
                    <span className="text-text-muted">{percent}%</span>
                  </div>
                  <ProgressBar
                    value={goal.savedAmount}
                    max={goal.targetAmount}
                  />
                  <p className="text-text-muted mt-1.5 text-xs">
                    {formatCurrency(goal.savedAmount)} of{' '}
                    {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <AddSavingsModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
