import { useState } from 'react'

import { DataTable } from '@/components/tables/DataTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { Select } from '@/components/ui/Select'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { auditLog } from '@/data/audit'
import { formatDateTime } from '@/utils/date'

const MODULE_OPTIONS = [
  { value: 'ALL', label: 'All modules' },
  ...Array.from(new Set(auditLog.map((entry) => entry.module))).map(
    (module) => ({ value: module, label: module }),
  ),
]

export function AdminAuditPage() {
  const [module, setModule] = useState('ALL')
  const filtered =
    module === 'ALL'
      ? auditLog
      : auditLog.filter((entry) => entry.module === module)

  return (
    <div>
      <PageHeader
        title="Audit Trail"
        description="A tamper-evident record of every sensitive action taken in the system."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Audit Trail' },
        ]}
      />

      <DataTable
        data={filtered}
        keyField={(row) => row.id}
        searchFields={(row) => [row.user, row.action, row.reference]}
        searchPlaceholder="Search by user, action or reference…"
        filters={
          <Select
            value={module}
            onChange={(event) => setModule(event.target.value)}
            options={MODULE_OPTIONS}
          />
        }
        pageSize={10}
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (row) => formatDateTime(row.date),
          },
          {
            key: 'user',
            header: 'User',
            render: (row) => (
              <div>
                <p className="text-text font-medium">{row.user}</p>
                <p className="text-text-muted text-xs">
                  {row.role.replace('_', ' ')}
                </p>
              </div>
            ),
          },
          { key: 'action', header: 'Action', render: (row) => row.action },
          { key: 'module', header: 'Module', render: (row) => row.module },
          {
            key: 'device',
            header: 'Device',
            render: (row) => (
              <span className="text-text-muted text-xs">{row.device}</span>
            ),
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
