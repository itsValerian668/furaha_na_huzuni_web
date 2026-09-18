import { useNavigate } from 'react-router-dom'

import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { getMemberLoans } from '@/data/loans'
import { currentMember } from '@/data/members'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

interface RepaymentRow {
  id: string
  loanId: string
  loanReference: string
  loanType: string
  dueDate: string
  amount: number
  status: string
}

export function LoanRepaymentsPage() {
  const navigate = useNavigate()
  const rows: RepaymentRow[] = getMemberLoans(currentMember.id).flatMap(
    (loan) =>
      loan.installments.map((installment) => ({
        id: `${loan.id}-${installment.id}`,
        loanId: loan.id,
        loanReference: loan.reference,
        loanType: loan.type,
        dueDate: installment.dueDate,
        amount: installment.amount,
        status: installment.status,
      })),
  )

  return (
    <div>
      <PageHeader
        title="Repayments"
        description="Every installment across all your loans."
        breadcrumbs={[
          { label: 'Loans', to: '/loans' },
          { label: 'Repayments' },
        ]}
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/loans', end: true },
          { label: 'Repayments', to: '/loans/repayments' },
          { label: 'History', to: '/loans/history' },
        ]}
      />

      <DataTable
        data={rows}
        keyField={(row) => row.id}
        searchFields={(row) => [row.loanReference, row.loanType]}
        searchPlaceholder="Search by loan reference…"
        rowActions={(row) => (
          <button
            type="button"
            onClick={() => navigate(`/loans/${row.loanId}`)}
            className="text-brand-strong text-sm font-medium hover:underline"
          >
            View loan
          </button>
        )}
        columns={[
          {
            key: 'loan',
            header: 'Loan',
            render: (row) => (
              <div>
                <p className="text-text font-medium">{row.loanType}</p>
                <p className="text-text-muted text-xs">{row.loanReference}</p>
              </div>
            ),
          },
          {
            key: 'dueDate',
            header: 'Due Date',
            render: (row) => formatDate(row.dueDate),
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
