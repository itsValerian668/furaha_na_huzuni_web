import { DataTable } from '@/components/tables/DataTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { welfareContributions } from '@/data/welfare'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function WelfareHistoryPage() {
  return (
    <div>
      <PageHeader
        title="Support History"
        description="Recent contributions to the welfare fund by members."
        breadcrumbs={[
          { label: 'Welfare & Support', to: '/welfare' },
          { label: 'History' },
        ]}
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/welfare', end: true },
          { label: 'Requests', to: '/welfare/requests' },
          { label: 'History', to: '/welfare/history' },
        ]}
      />

      <DataTable
        data={welfareContributions}
        keyField={(row) => row.id}
        searchFields={(row) => [row.memberName]}
        searchPlaceholder="Search by member…"
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (row) => formatDate(row.date),
          },
          { key: 'member', header: 'Member', render: (row) => row.memberName },
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
