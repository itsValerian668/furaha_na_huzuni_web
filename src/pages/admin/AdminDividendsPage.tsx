import { useState } from 'react'

import { StatCard } from '@/components/financial/StatCard'
import { DataTable } from '@/components/tables/DataTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { currentDividendCycle, dividendRecords } from '@/data/dividends'
import { members } from '@/data/members'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'

export function AdminDividendsPage() {
  const [approveOpen, setApproveOpen] = useState(false)
  const preview = members.slice(0, 8).map((member) => ({
    ...member,
    dividend: Math.round(
      member.totalShares *
        (currentDividendCycle.personalDividend /
          currentDividendCycle.sharesHeld),
    ),
  }))

  return (
    <div>
      <PageHeader
        title="Dividend Management"
        description="Calculate and approve the annual dividend distribution."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Dividends' },
        ]}
        actions={
          currentDividendCycle.status === 'CALCULATED' ? (
            <Button onClick={() => setApproveOpen(true)}>
              Approve Distribution
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Cooperative Profit"
          amount={currentDividendCycle.cooperativeProfit}
          compact
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
          label="Distribution Rate"
          amount={currentDividendCycle.distributionRate}
          format="percent"
          tone="neutral"
        />
      </div>

      <Card className="mb-6 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-text text-sm font-semibold">
            FY{currentDividendCycle.year} Calculation Preview
          </p>
          <StatusBadge status={currentDividendCycle.status} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-border text-text-muted border-b text-xs uppercase">
                <th className="py-2 text-left font-semibold">Member</th>
                <th className="py-2 text-right font-semibold">Shares</th>
                <th className="py-2 text-right font-semibold">Dividend</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((member) => (
                <tr
                  key={member.id}
                  className="border-border border-b last:border-b-0"
                >
                  <td className="text-text py-2.5">{member.name}</td>
                  <td className="text-text py-2.5 text-right">
                    {member.totalShares}
                  </td>
                  <td className="text-text py-2.5 text-right font-medium">
                    {formatCurrency(member.dividend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
        toolbar={
          <Button
            variant="secondary"
            onClick={() => toast('Distribution history exported.')}
          >
            Export
          </Button>
        }
      />

      <ConfirmDialog
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        onConfirm={() => {
          setApproveOpen(false)
          toast(
            `FY${currentDividendCycle.year} dividend distribution approved.`,
          )
        }}
        title="Approve dividend distribution?"
        description={`This will approve distribution of ${formatCurrency(currentDividendCycle.dividendPool)} to ${currentDividendCycle.eligibleMembers.toLocaleString()} eligible members.`}
        confirmLabel="Approve distribution"
      />
    </div>
  )
}
