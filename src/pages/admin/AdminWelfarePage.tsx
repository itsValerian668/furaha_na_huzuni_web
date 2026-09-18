import { useState } from 'react'

import { StatCard } from '@/components/financial/StatCard'
import { DataTable } from '@/components/tables/DataTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { welfareOverview, welfareRequests } from '@/data/welfare'
import { toast } from '@/stores/toast.store'
import type { WelfareRequest } from '@/types/coop'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function AdminWelfarePage() {
  const [confirm, setConfirm] = useState<{
    request: WelfareRequest
    action: 'approve' | 'reject'
  } | null>(null)

  return (
    <div>
      <PageHeader
        title="Welfare Management"
        description="Review and disburse community support requests."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Welfare' },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Welfare Fund"
          amount={welfareOverview.fundBalance}
          compact
        />
        <StatCard
          label="Available Balance"
          amount={welfareOverview.available}
          compact
          tone="neutral"
        />
        <StatCard
          label="Approved Support"
          amount={welfareOverview.supportThisYear}
          compact
          tone="gold"
        />
        <StatCard
          label="Pending Support"
          amount={
            welfareRequests.filter(
              (r) => r.status === 'PENDING' || r.status === 'UNDER_REVIEW',
            ).length
          }
          format="count"
          tone="neutral"
        />
      </div>

      <DataTable
        data={welfareRequests}
        keyField={(row) => row.id}
        searchFields={(row) => [row.memberName, row.reference, row.category]}
        searchPlaceholder="Search by member or category…"
        rowActions={(row) => (
          <div className="flex justify-end gap-3">
            {(row.status === 'PENDING' || row.status === 'UNDER_REVIEW') && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setConfirm({ request: row, action: 'approve' })
                  }
                  className="text-positive text-sm font-medium hover:underline"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm({ request: row, action: 'reject' })}
                  className="text-negative text-sm font-medium hover:underline"
                >
                  Reject
                </button>
              </>
            )}
            {row.status === 'APPROVED' && (
              <button
                type="button"
                onClick={() =>
                  toast(
                    `${formatCurrency(row.amountApproved ?? row.amountRequested)} disbursed to ${row.memberName}.`,
                  )
                }
                className="text-brand-strong text-sm font-medium hover:underline"
              >
                Disburse
              </button>
            )}
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
          {
            key: 'category',
            header: 'Category',
            render: (row) => row.category,
          },
          {
            key: 'submitted',
            header: 'Submitted',
            render: (row) => formatDate(row.submittedOn),
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
                {formatCurrency(row.amountApproved ?? row.amountRequested)}
              </span>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) {
            toast(
              confirm.action === 'approve'
                ? `Welfare request ${confirm.request.reference} approved.`
                : `Welfare request ${confirm.request.reference} rejected.`,
              confirm.action === 'approve' ? 'success' : 'error',
            )
          }
          setConfirm(null)
        }}
        title={
          confirm?.action === 'approve'
            ? 'Approve this request?'
            : 'Reject this request?'
        }
        description={`${confirm?.request.memberName ?? ''} — ${confirm?.request.category ?? ''} support request.`}
        confirmLabel={
          confirm?.action === 'approve' ? 'Approve request' : 'Reject request'
        }
        confirmVariant={confirm?.action === 'approve' ? 'primary' : 'danger'}
      />
    </div>
  )
}
