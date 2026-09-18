import { useNavigate } from 'react-router-dom'

import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { getMemberLoans } from '@/data/loans'
import { currentMember } from '@/data/members'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function LoanHistoryPage() {
  const navigate = useNavigate()
  const loans = getMemberLoans(currentMember.id)

  return (
    <div>
      <PageHeader
        title="Loan History"
        description="Every loan you've applied for, past and present."
        breadcrumbs={[{ label: 'Loans', to: '/loans' }, { label: 'History' }]}
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/loans', end: true },
          { label: 'Repayments', to: '/loans/repayments' },
          { label: 'History', to: '/loans/history' },
        ]}
      />

      <DataTable
        data={loans}
        keyField={(row) => row.id}
        searchFields={(row) => [row.reference, row.type, row.purpose]}
        searchPlaceholder="Search loans…"
        rowActions={(row) => (
          <button
            type="button"
            onClick={() => navigate(`/loans/${row.id}`)}
            className="text-brand-strong text-sm font-medium hover:underline"
          >
            View
          </button>
        )}
        columns={[
          {
            key: 'type',
            header: 'Loan',
            render: (row) => (
              <div>
                <p className="text-text font-medium">{row.type}</p>
                <p className="text-text-muted text-xs">{row.reference}</p>
              </div>
            ),
          },
          {
            key: 'appliedOn',
            header: 'Applied',
            render: (row) => formatDate(row.appliedOn),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: 'principal',
            header: 'Principal',
            align: 'right',
            render: (row) => formatCurrency(row.principal),
          },
          {
            key: 'outstanding',
            header: 'Outstanding',
            align: 'right',
            render: (row) => (
              <span className="text-text font-semibold">
                {formatCurrency(row.outstandingBalance)}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
