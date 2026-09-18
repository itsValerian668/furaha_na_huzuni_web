import { StatementDocument } from '@/components/financial/StatementDocument'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { currentMember } from '@/data/members'
import { shareOverview, sharePurchases } from '@/data/shares'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function StatementsSharesPage() {
  return (
    <StatementDocument
      title="Share Statement"
      breadcrumbs={[
        { label: 'Statements', to: '/statements' },
        { label: 'Shares' },
      ]}
      summary={[
        { label: 'Total Shares', value: `${currentMember.totalShares} shares` },
        {
          label: 'Share Value',
          value: formatCurrency(shareOverview.shareValue),
        },
        {
          label: 'Total Worth',
          value: formatCurrency(currentMember.shareValue),
        },
        { label: 'Shares This Year', value: `${shareOverview.sharesThisYear}` },
      ]}
    >
      <DataTable
        data={sharePurchases}
        keyField={(row) => row.id}
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (row) => formatDate(row.date),
          },
          {
            key: 'shares',
            header: 'Shares',
            render: (row) => `${row.shares} shares`,
          },
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
