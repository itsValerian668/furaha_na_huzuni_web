import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { resolutions } from '@/data/governance'
import { formatDate } from '@/utils/date'

export function ResolutionsPage() {
  return (
    <div>
      <PageHeader
        title="Resolutions"
        description="Decisions passed at cooperative meetings."
        breadcrumbs={[
          { label: 'Governance', to: '/governance' },
          { label: 'Resolutions' },
        ]}
      />

      <DataTable
        data={resolutions}
        keyField={(row) => row.id}
        searchFields={(row) => [row.title, row.meeting]}
        searchPlaceholder="Search resolutions…"
        columns={[
          {
            key: 'title',
            header: 'Resolution',
            render: (row) => (
              <div>
                <p className="text-text font-medium">{row.title}</p>
                <p className="text-text-muted text-xs">{row.summary}</p>
              </div>
            ),
          },
          { key: 'meeting', header: 'Meeting', render: (row) => row.meeting },
          {
            key: 'date',
            header: 'Date',
            render: (row) => formatDate(row.date),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
        ]}
      />
    </div>
  )
}
