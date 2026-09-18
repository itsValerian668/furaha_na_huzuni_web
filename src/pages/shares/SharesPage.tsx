import { Download, PieChart as PieChartIcon, Plus } from 'lucide-react'
import { useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

import { BuySharesModal } from '@/components/financial/BuySharesModal'
import { ChartCard } from '@/components/financial/ChartCard'
import { StatCard } from '@/components/financial/StatCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { currentMember } from '@/data/members'
import { shareOverview } from '@/data/shares'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'

export function SharesPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <PageHeader
        title="Shares"
        description="Your ownership stake in the cooperative."
        breadcrumbs={[{ label: 'Shares' }]}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => toast('Share statement downloaded.')}
            >
              <Download className="size-4" aria-hidden="true" /> Download
              Statement
            </Button>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="size-4" aria-hidden="true" /> Buy Shares
            </Button>
          </>
        }
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/shares', end: true },
          { label: 'History', to: '/shares/history' },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Shares"
          amount={currentMember.totalShares}
          format="count"
          tone="gold"
          helperText="shares held"
        />
        <StatCard
          label="Share Value"
          amount={shareOverview.totalValue}
          helperText={`${formatCurrency(shareOverview.shareValue)} per share`}
        />
        <StatCard
          label="Ownership"
          amount={shareOverview.ownershipPercent}
          format="percent"
          tone="neutral"
        />
        <StatCard
          label="Shares This Year"
          amount={shareOverview.sharesThisYear}
          format="count"
          tone="neutral"
          helperText={shareOverview.currentCycle}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ChartCard
          title="Share Growth"
          description="Shares held over the last 9 months"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={shareOverview.growth}
              margin={{ left: 4, right: 12, top: 8 }}
            >
              <defs>
                <linearGradient id="sharesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A45C" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C9A45C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                formatter={(value) => `${value} shares`}
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: 13,
                }}
              />
              <Area
                dataKey="shares"
                stroke="#C9A45C"
                strokeWidth={2.5}
                fill="url(#sharesFill)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="text-text-muted mt-2 flex justify-between px-2 text-xs">
            {shareOverview.growth.map((point) => (
              <span key={point.month}>{point.month}</span>
            ))}
          </div>
        </ChartCard>

        <Card className="p-5">
          <p className="text-text mb-3 flex items-center gap-2 text-sm font-semibold">
            <PieChartIcon className="text-accent size-4" aria-hidden="true" />{' '}
            Why shares matter
          </p>
          <p className="text-text-muted text-sm leading-relaxed">
            Shares represent your ownership stake in the cooperative and form
            part of its permanent capital. They remain invested while you're an
            active member and are the basis for your annual dividend.
          </p>
          <p className="text-text-muted mt-3 text-sm leading-relaxed">
            Original shares remain as cooperative capital for the next cycle —
            accumulated profits are distributed as dividends according to the
            cooperative's approved rules.
          </p>
        </Card>
      </div>

      <BuySharesModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
