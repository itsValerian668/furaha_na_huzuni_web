import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { StatCard } from '@/components/financial/StatCard'
import { DataTable } from '@/components/tables/DataTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs } from '@/components/ui/Tabs'
import { adminOverview } from '@/data/admin'
import { loans } from '@/data/loans'
import { toast } from '@/stores/toast.store'
import type { Loan } from '@/types/coop'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

const TAB_STATUSES: Record<string, Loan['status'][]> = {
  pending: ['PENDING', 'UNDER_REVIEW'],
  active: ['ACTIVE'],
  overdue: ['OVERDUE'],
  completed: ['COMPLETED'],
}

export function AdminLoansPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('pending')
  const [confirmLoan, setConfirmLoan] = useState<{
    loan: Loan
    action: 'approve' | 'reject'
  } | null>(null)

  const filtered = loans.filter((loan) =>
    TAB_STATUSES[tab]?.includes(loan.status),
  )

  return (
    <div>
      <PageHeader
        title="Loan Management"
        description="Review applications and monitor the active loan book."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Loans' },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending Applications"
          amount={adminOverview.pendingLoanApprovals}
          format="count"
          tone="neutral"
        />
        <StatCard
          label="Active Loans"
          amount={adminOverview.activeLoans}
          compact
        />
        <StatCard
          label="Outstanding Balance"
          amount={adminOverview.outstandingLoans}
          compact
          tone="neutral"
        />
        <StatCard
          label="Overdue Loans"
          amount={adminOverview.overdueLoans}
          format="count"
          tone="gold"
        />
      </div>

      <Tabs
        items={[
          {
            value: 'pending',
            label: 'Applications',
            count: loans.filter((l) =>
              TAB_STATUSES['pending']!.includes(l.status),
            ).length,
          },
          {
            value: 'active',
            label: 'Active',
            count: loans.filter((l) => l.status === 'ACTIVE').length,
          },
          {
            value: 'overdue',
            label: 'Overdue',
            count: loans.filter((l) => l.status === 'OVERDUE').length,
          },
          {
            value: 'completed',
            label: 'Completed',
            count: loans.filter((l) => l.status === 'COMPLETED').length,
          },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-6">
        <DataTable
          data={filtered}
          keyField={(row) => row.id}
          searchFields={(row) => [row.reference, row.memberName, row.type]}
          searchPlaceholder="Search loans by member or reference…"
          rowActions={(row) => (
            <div className="flex justify-end gap-3">
              {(row.status === 'PENDING' || row.status === 'UNDER_REVIEW') && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmLoan({ loan: row, action: 'approve' })
                    }
                    className="text-positive text-sm font-medium hover:underline"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmLoan({ loan: row, action: 'reject' })
                    }
                    className="text-negative text-sm font-medium hover:underline"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => navigate(`/admin/loans/${row.id}`)}
                className="text-brand-strong text-sm font-medium hover:underline"
              >
                View
              </button>
            </div>
          )}
          columns={[
            {
              key: 'member',
              header: 'Member',
              render: (row) => (
                <div>
                  <p className="text-text font-medium">{row.memberName}</p>
                  <p className="text-text-muted text-xs">{row.reference}</p>
                </div>
              ),
            },
            { key: 'type', header: 'Loan Type', render: (row) => row.type },
            {
              key: 'applied',
              header: 'Applied',
              render: (row) => formatDate(row.appliedOn),
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
                  {formatCurrency(row.principal)}
                </span>
              ),
            },
          ]}
        />
      </div>

      <ConfirmDialog
        open={confirmLoan !== null}
        onClose={() => setConfirmLoan(null)}
        onConfirm={() => {
          if (confirmLoan) {
            toast(
              confirmLoan.action === 'approve'
                ? `Loan ${confirmLoan.loan.reference} approved successfully.`
                : `Loan ${confirmLoan.loan.reference} rejected.`,
              confirmLoan.action === 'approve' ? 'success' : 'error',
            )
          }
          setConfirmLoan(null)
        }}
        title={
          confirmLoan?.action === 'approve'
            ? 'Approve this loan?'
            : 'Reject this loan?'
        }
        description={`${confirmLoan?.loan.memberName ?? ''} — ${confirmLoan?.loan.reference ?? ''} for ${confirmLoan ? formatCurrency(confirmLoan.loan.principal) : ''}.`}
        confirmLabel={
          confirmLoan?.action === 'approve' ? 'Approve loan' : 'Reject loan'
        }
        confirmVariant={
          confirmLoan?.action === 'approve' ? 'primary' : 'danger'
        }
      />
    </div>
  )
}
