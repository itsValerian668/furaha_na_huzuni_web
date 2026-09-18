import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { savingsContributions } from '@/data/savings'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

const METHOD_LABEL: Record<string, string> = {
  CASH: 'Cash',
  MOBILE_MONEY: 'Mobile Money',
  BANK_TRANSFER: 'Bank Transfer',
}

export function SavingsHistoryPage() {
  return (
    <div>
      <PageHeader
        title="Savings History"
        description="Every contribution you've made, in order."
        breadcrumbs={[
          { label: 'Savings', to: '/savings' },
          { label: 'History' },
        ]}
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/savings', end: true },
          { label: 'History', to: '/savings/history' },
          { label: 'Goals', to: '/savings/goals' },
          { label: 'Contributions', to: '/savings/contributions' },
        ]}
      />

      <DataTable
        data={savingsContributions}
        keyField={(row) => row.id}
        searchFields={(row) => [
          row.cycle,
          METHOD_LABEL[row.method] ?? row.method,
        ]}
        searchPlaceholder="Search by cycle or method…"
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (row) => formatDate(row.date),
          },
          { key: 'cycle', header: 'Cycle', render: (row) => row.cycle },
          {
            key: 'method',
            header: 'Method',
            render: (row) => METHOD_LABEL[row.method] ?? row.method,
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
