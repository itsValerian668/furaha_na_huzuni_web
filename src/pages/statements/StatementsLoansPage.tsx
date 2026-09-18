import { StatementDocument } from '@/components/financial/StatementDocument'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { currentMember } from '@/data/members'
import { getMemberLoans } from '@/data/loans'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function StatementsLoansPage() {
  const loans = getMemberLoans(currentMember.id)
  const totalOutstanding = loans.reduce(
    (sum, loan) => sum + loan.outstandingBalance,
    0,
  )
  const totalBorrowed = loans.reduce((sum, loan) => sum + loan.principal, 0)

  return (
    <StatementDocument
      title="Loan Statement"
      breadcrumbs={[
        { label: 'Statements', to: '/statements' },
        { label: 'Loans' },
      ]}
      summary={[
        { label: 'Total Borrowed', value: formatCurrency(totalBorrowed) },
        { label: 'Outstanding', value: formatCurrency(totalOutstanding) },
        { label: 'Loans on Record', value: `${loans.length}` },
        {
          label: 'Active Loans',
          value: `${loans.filter((loan) => loan.status === 'ACTIVE' || loan.status === 'OVERDUE').length}`,
        },
      ]}
    >
      <DataTable
        data={loans}
        keyField={(row) => row.id}
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
    </StatementDocument>
  )
}
