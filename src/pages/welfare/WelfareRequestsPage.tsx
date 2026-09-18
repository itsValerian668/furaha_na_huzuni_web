import { useState } from 'react'

import { RequestSupportModal } from '@/components/financial/RequestSupportModal'
import { DataTable } from '@/components/tables/DataTable'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { welfareRequests } from '@/data/welfare'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function WelfareRequestsPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <PageHeader
        title="Welfare Requests"
        description="All support requests submitted by cooperative members."
        breadcrumbs={[
          { label: 'Welfare & Support', to: '/welfare' },
          { label: 'Requests' },
        ]}
        actions={
          <Button onClick={() => setModalOpen(true)}>Request Support</Button>
        }
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/welfare', end: true },
          { label: 'Requests', to: '/welfare/requests' },
          { label: 'History', to: '/welfare/history' },
        ]}
      />

      <DataTable
        data={welfareRequests}
        keyField={(row) => row.id}
        searchFields={(row) => [row.reference, row.memberName, row.category]}
        searchPlaceholder="Search by member or category…"
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
            key: 'submittedOn',
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

      <RequestSupportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
