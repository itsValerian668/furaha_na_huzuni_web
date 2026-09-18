import { StatementDocument } from '@/components/financial/StatementDocument'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { currentMember } from '@/data/members'
import { savingsContributions, savingsOverview } from '@/data/savings'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function StatementsSavingsPage() {
  return (
    <StatementDocument
      title="Savings Statement"
      breadcrumbs={[
        { label: 'Statements', to: '/statements' },
        { label: 'Savings' },
      ]}
      summary={[
        {
          label: 'Current Balance',
          value: formatCurrency(currentMember.totalSavings),
        },
        { label: 'Current Cycle', value: savingsOverview.currentCycle },
        {
          label: 'Weekly Target',
          value: formatCurrency(savingsOverview.weeklyTarget),
        },
        { label: 'Cycle Growth', value: `${savingsOverview.growthThisCycle}%` },
      ]}
    >
      <DataTable
        data={savingsContributions}
        keyField={(row) => row.id}
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (row) => formatDate(row.date),
          },
          { key: 'cycle', header: 'Cycle', render: (row) => row.cycle },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: 'amount',
            header: 'Amount',
            align: 'right',
            render: (row) => (
              <span className="text-text font-semibold">
                {formatCurrency(row.amount)}
              </span>
            ),
          },
        ]}
      />
    </StatementDocument>
  )
}
