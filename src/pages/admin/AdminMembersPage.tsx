import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DataTable } from '@/components/tables/DataTable'
import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Select } from '@/components/ui/Select'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MoreHorizontal } from 'lucide-react'
import { members } from '@/data/members'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'INACTIVE', label: 'Inactive' },
]

export function AdminMembersPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('ALL')

  const filtered =
    status === 'ALL'
      ? members
      : members.filter((member) => member.status === status)

  return (
    <div>
      <PageHeader
        title="Member Management"
        description="View, verify and manage cooperative members."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Members' },
        ]}
      />

      <DataTable
        data={filtered}
        keyField={(row) => row.id}
        searchFields={(row) => [
          row.name,
          row.memberNumber,
          row.email,
          row.branch,
        ]}
        searchPlaceholder="Search members by name, ID, email…"
        filters={
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={STATUS_OPTIONS}
          />
        }
        pageSize={10}
        rowActions={(row) => (
          <Dropdown
            align="end"
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                aria-label="Row actions"
                className="text-text-muted hover:bg-surface-hover rounded-md p-1.5"
              >
                <MoreHorizontal className="size-4" aria-hidden="true" />
              </button>
            )}
          >
            {(close) => (
              <>
                <DropdownItem
                  onClick={() => {
                    navigate(`/admin/members/${row.id}`)
                    close()
                  }}
                >
                  View Financial Profile
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    toast(`${row.name}'s profile opened for editing.`)
                    close()
                  }}
                >
                  Edit
                </DropdownItem>
                {row.status === 'SUSPENDED' ? (
                  <DropdownItem
                    onClick={() => {
                      toast(`${row.name} reactivated.`)
                      close()
                    }}
                  >
                    Activate
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    danger
                    onClick={() => {
                      toast(`${row.name} suspended.`, 'error')
                      close()
                    }}
                  >
                    Suspend
                  </DropdownItem>
                )}
              </>
            )}
          </Dropdown>
        )}
        columns={[
          {
            key: 'name',
            header: 'Member',
            render: (row) => (
              <button
                type="button"
                onClick={() => navigate(`/admin/members/${row.id}`)}
                className="flex items-center gap-2.5 text-left"
              >
                <MemberAvatar
                  name={row.name}
                  color={row.avatarColor}
                  size={32}
                />
                <span>
                  <span className="text-text block font-medium">
                    {row.name}
                  </span>
                  <span className="text-text-muted block text-xs">
                    {row.memberNumber}
                  </span>
                </span>
              </button>
            ),
          },
          { key: 'branch', header: 'Branch', render: (row) => row.branch },
          {
            key: 'joined',
            header: 'Joined',
            render: (row) => formatDate(row.joinedOn),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: 'savings',
            header: 'Savings',
            align: 'right',
            render: (row) => formatCurrency(row.totalSavings),
          },
          {
            key: 'loan',
            header: 'Loan',
            align: 'right',
            render: (row) => (
              <span className="text-text font-semibold">
                {formatCurrency(row.outstandingLoan)}
              </span>
            ),
          },
        ]}
        toolbar={
          <Button
            variant="secondary"
            onClick={() => toast('Member directory exported.')}
          >
            Export
          </Button>
        }
      />
    </div>
  )
}
