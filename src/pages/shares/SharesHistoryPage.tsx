import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { sharePurchases } from '@/data/shares'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function SharesHistoryPage() {
  return (
    <div>
      <PageHeader
        title="Share History"
        description="Every share purchase you've made."
        breadcrumbs={[{ label: 'Shares', to: '/shares' }, { label: 'History' }]}
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/shares', end: true },
          { label: 'History', to: '/shares/history' },
        ]}
      />

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
    </div>
  )
}
