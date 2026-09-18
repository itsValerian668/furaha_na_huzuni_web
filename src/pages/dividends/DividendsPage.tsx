import { Gift, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { StatCard } from '@/components/financial/StatCard'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { currentDividendCycle } from '@/data/dividends'
import { formatCurrency, formatPercent } from '@/utils/currency'

export function DividendsPage() {
  const navigate = useNavigate()

  return (
    <div>
      <PageHeader
        title="Dividends"
        description="Your share of the cooperative's annual profit."
        breadcrumbs={[{ label: 'Dividends' }]}
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate('/dividends/history')}
          >
            View History
          </Button>
        }
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/dividends', end: true },
          { label: 'History', to: '/dividends/history' },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Cooperative Profit"
          amount={currentDividendCycle.cooperativeProfit}
          compact
          icon={Gift}
        />
        <StatCard
          label="Dividend Pool"
          amount={currentDividendCycle.dividendPool}
          compact
          tone="gold"
        />
        <StatCard
          label="Eligible Members"
          amount={currentDividendCycle.eligibleMembers}
          format="count"
          tone="neutral"
        />
        <StatCard
          label="Estimated Personal Dividend"
          amount={currentDividendCycle.personalDividend}
          tone="gold"
          helperText="Projected, not yet paid"
        />
      </div>

      <Alert variant="info" className="mb-6">
        <Info className="mr-1 inline size-3.5" aria-hidden="true" />
        This figure is an <strong>estimated / projected</strong> dividend for
        FY2026 — it becomes an actual balance only once the Annual General
        Meeting approves distribution.
      </Alert>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-text text-sm font-semibold">
            FY{currentDividendCycle.year} Distribution
          </p>
          <StatusBadge status={currentDividendCycle.status} />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-text-muted text-xs">Distribution Rate</p>
            <p className="text-text text-sm font-semibold">
              {formatPercent(currentDividendCycle.distributionRate)}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Your Shares</p>
            <p className="text-text text-sm font-semibold">
              {currentDividendCycle.sharesHeld} shares
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Per-Share Rate</p>
            <p className="text-text text-sm font-semibold">
              {formatCurrency(
                Math.round(
                  currentDividendCycle.personalDividend /
                    currentDividendCycle.sharesHeld,
                ),
              )}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-xs">Your Estimated Dividend</p>
            <p className="text-text text-sm font-semibold">
              {formatCurrency(currentDividendCycle.personalDividend)}
            </p>
          </div>
        </div>

        <div className="bg-surface-sunken text-text-muted mt-6 rounded-xl p-4 text-sm leading-relaxed">
          Original shares remain as cooperative capital for the next cycle.
          Accumulated profits are distributed according to the cooperative's
          approved rules, in proportion to the shares each member holds.
        </div>
      </Card>
    </div>
  )
}
