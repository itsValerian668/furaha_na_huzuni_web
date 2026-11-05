import { DataTable } from '@/components/tables/DataTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { welfareContributions } from '@/data/welfare'
import { useAuthStore } from '@/stores/auth.store'
import { useWelfareStore } from '@/stores/welfare.store'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function WelfareHistoryPage() {
  const user = useAuthStore((state) => state.user)
  const requests = useWelfareStore((state) => state.requests)

  const myRequests = requests.filter(
    (request) => String(request.memberId) === String(user?.id),
  )

  return (
    <div>
      <PageHeader
        title="Support History"
        description="Your welfare support requests and recent contributions to the welfare fund."
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

      <div className="mb-8">
        <h2 className="text-text mb-4 text-lg font-semibold">
          My Support Requests
        </h2>

        <DataTable
          data={myRequests}
          keyField={(row) => row.id}
          searchFields={(row) => [
            row.reference,
            row.category,
            row.status,
          ]}
          searchPlaceholder="Search my requests…"
          columns={[
            {
              key: 'reference',
              header: 'Reference',
              render: (row) => (
                <span className="text-text font-medium">
                  {row.reference}
                </span>
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
              render: (row) => (
                <StatusBadge status={row.status} />
              ),
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
          ]}
        />
      </div>

      <div>
        <h2 className="text-text mb-4 text-lg font-semibold">
          Welfare Contributions
        </h2>

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
            {
              key: 'member',
              header: 'Member',
              render: (row) => row.memberName,
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
    </div>
  )
}