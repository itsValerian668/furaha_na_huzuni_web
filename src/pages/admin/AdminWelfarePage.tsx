import { useState } from 'react'

import { StatCard } from '@/components/financial/StatCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { welfareOverview } from '@/data/welfare'
import { toast } from '@/stores/toast.store'
import { useWelfareStore } from '@/stores/welfare.store'
import type { WelfareRequest } from '@/types/coop'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function AdminWelfarePage() {
  const requests = useWelfareStore((state) => state.requests)
  const updateRequest = useWelfareStore((state) => state.updateRequest)

  const [confirm, setConfirm] = useState<{
    request: WelfareRequest
    action: 'approve' | 'reject'
  } | null>(null)

  const handleDocumentView = (request: WelfareRequest) => {
    const document = request.supportingDocument

    if (!document) {
      toast('No supporting document was attached to this request.', 'error')
      return
    }

    const newWindow = window.open()

    if (!newWindow) {
      toast(
        'Your browser blocked the document window. Please allow pop-ups and try again.',
        'error',
      )
      return
    }

    newWindow.document.title = document.name

    if (document.type.startsWith('image/')) {
      newWindow.document.body.style.margin = '0'
      newWindow.document.body.style.display = 'flex'
      newWindow.document.body.style.justifyContent = 'center'
      newWindow.document.body.style.alignItems = 'center'
      newWindow.document.body.style.background = '#111'

      const image = newWindow.document.createElement('img')

      image.src = document.dataUrl
      image.alt = document.name
      image.style.maxWidth = '100%'
      image.style.maxHeight = '100vh'
      image.style.objectFit = 'contain'

      newWindow.document.body.appendChild(image)
      return
    }

    const iframe = newWindow.document.createElement('iframe')

    iframe.src = document.dataUrl
    iframe.title = document.name
    iframe.style.width = '100%'
    iframe.style.height = '100vh'
    iframe.style.border = '0'

    newWindow.document.body.style.margin = '0'
    newWindow.document.body.appendChild(iframe)
  }

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
            requests.filter(
              (request) =>
                request.status === 'PENDING' ||
                request.status === 'UNDER_REVIEW',
            ).length
          }
          format="count"
          tone="neutral"
        />
      </div>

      <DataTable
        data={requests}
        keyField={(row) => row.id}
        searchFields={(row) => [
          row.memberName,
          row.reference,
          row.category,
        ]}
        searchPlaceholder="Search by member or category…"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-4">
            {row.supportingDocument && (
              <button
                type="button"
                onClick={() => handleDocumentView(row)}
                className="text-brand-strong text-sm font-medium hover:underline"
              >
                View document
              </button>
            )}

            {/* Fixed positions for Approve / Reject / Disburse */}
            <div className="grid w-[150px] grid-cols-2 items-center gap-x-6">
              {/* Approve position */}
              <div>
                {(row.status === 'PENDING' ||
                  row.status === 'UNDER_REVIEW') && (
                  <button
                    type="button"
                    onClick={() =>
                      setConfirm({
                        request: row,
                        action: 'approve',
                      })
                    }
                    className="text-positive text-sm font-medium whitespace-nowrap hover:underline"
                  >
                    Approve
                  </button>
                )}
              </div>

              {/* Reject / Disburse position */}
              <div>
                {(row.status === 'PENDING' ||
                  row.status === 'UNDER_REVIEW') && (
                  <button
                    type="button"
                    onClick={() =>
                      setConfirm({
                        request: row,
                        action: 'reject',
                      })
                    }
                    className="text-negative text-sm font-medium whitespace-nowrap hover:underline"
                  >
                    Reject
                  </button>
                )}

                {row.status === 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => {
                      updateRequest(row.id, {
                        status: 'DISBURSED',
                        decidedOn: new Date().toISOString(),
                      })

                      toast(
                        `${formatCurrency(
                          row.amountApproved ?? row.amountRequested,
                        )} disbursed to ${row.memberName}.`,
                      )
                    }}
                    className="text-brand-strong text-sm font-medium whitespace-nowrap hover:underline"
                  >
                    Disburse
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        columns={[
          {
            key: 'member',
            header: 'Member',
            render: (row) => (
              <div>
                <p className="text-text font-medium">
                  {row.memberName}
                </p>
                <p className="text-text-muted text-xs">
                  {row.reference}
                </p>
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
            key: 'document',
            header: 'Document',
            render: (row) =>
              row.supportingDocument ? (
                <span className="text-positive text-xs font-medium">
                  Attached
                </span>
              ) : (
                <span className="text-text-muted text-xs">
                  None
                </span>
              ),
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
                {formatCurrency(
                  row.amountApproved ?? row.amountRequested,
                )}
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
            updateRequest(confirm.request.id, {
              status:
                confirm.action === 'approve'
                  ? 'APPROVED'
                  : 'REJECTED',
              amountApproved:
                confirm.action === 'approve'
                  ? confirm.request.amountRequested
                  : undefined,
              decidedOn: new Date().toISOString(),
            })

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
        description={`${confirm?.request.memberName ?? ''} — ${
          confirm?.request.category ?? ''
        } support request.`}
        confirmLabel={
          confirm?.action === 'approve'
            ? 'Approve request'
            : 'Reject request'
        }
        confirmVariant={
          confirm?.action === 'approve' ? 'primary' : 'danger'
        }
      />
    </div>
  )
}