import { Navigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { dividendRecords } from '@/data/dividends'
import { toast } from '@/stores/toast.store'
import { formatCurrency, formatPercent } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function DividendDetailPage() {
  const { id } = useParams<{ id: string }>()
  const record = dividendRecords.find((item) => item.id === id)

  if (!record) return <Navigate to="/dividends/history" replace />

  const perShare = Math.round(record.personalDividend / record.sharesHeld)

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={`FY${record.year} Dividend`}
        description="Calculation breakdown and statement."
        breadcrumbs={[
          { label: 'Dividends', to: '/dividends' },
          { label: 'History', to: '/dividends/history' },
          { label: `FY${record.year}` },
        ]}
        actions={
          <Button
            variant="secondary"
            onClick={() => toast('Dividend statement downloaded.')}
          >
            Download Statement
          </Button>
        }
      />

      <Card className="mb-5 p-6 text-center">
        <p className="text-text-muted text-xs font-medium tracking-wide uppercase">
          Your Dividend
        </p>
        <p className="text-text mt-2 text-4xl font-bold">
          {formatCurrency(record.personalDividend)}
        </p>
        <p className="mt-2">
          <StatusBadge status={record.status} />
        </p>
      </Card>

      <Card>
        <CardHeader title="Calculation Breakdown" />
        <dl className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3">
          <div>
            <dt className="text-text-muted text-xs">Cooperative Profit</dt>
            <dd className="text-text text-sm font-semibold">
              {formatCurrency(record.cooperativeProfit)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Dividend Pool</dt>
            <dd className="text-text text-sm font-semibold">
              {formatCurrency(record.dividendPool)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Distribution Rate</dt>
            <dd className="text-text text-sm font-semibold">
              {formatPercent(record.distributionRate)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Eligible Members</dt>
            <dd className="text-text text-sm font-semibold">
              {record.eligibleMembers.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Your Shares</dt>
            <dd className="text-text text-sm font-semibold">
              {record.sharesHeld} shares
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Per-Share Amount</dt>
            <dd className="text-text text-sm font-semibold">
              {formatCurrency(perShare)}
            </dd>
          </div>
          {record.paidOn && (
            <div>
              <dt className="text-text-muted text-xs">Paid On</dt>
              <dd className="text-text text-sm font-semibold">
                {formatDate(record.paidOn)}
              </dd>
            </div>
          )}
        </dl>
      </Card>
    </div>
  )
}
