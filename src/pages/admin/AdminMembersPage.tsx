import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AddMemberModal } from '@/components/members/AddMemberModal'
import { DataTable } from '@/components/tables/DataTable'
import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Select } from '@/components/ui/Select'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { MoreHorizontal, Plus } from 'lucide-react'
import { useMembersStore } from '@/stores/members.store'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import type { Member } from '@/types/coop'

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
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [statusActionMember, setStatusActionMember] =
    useState<Member | null>(null)

  const members = useMembersStore((state) => state.members)

  const updateMemberStatus = useMembersStore(
    (state) => state.updateMemberStatus,
  )

  const filtered =
    status === 'ALL'
      ? members
      : members.filter((member) => member.status === status)

  const isSuspendedOrInactive =
    statusActionMember?.status === 'SUSPENDED' ||
    statusActionMember?.status === 'INACTIVE'

  const handleStatusConfirm = () => {
    if (!statusActionMember) return

    const newStatus = isSuspendedOrInactive
      ? 'ACTIVE'
      : 'SUSPENDED'

    updateMemberStatus(statusActionMember.id, newStatus)

    if (newStatus === 'ACTIVE') {
      toast(`${statusActionMember.name} activated.`)
    } else {
      toast(
        `${statusActionMember.name} suspended.`,
        'error',
      )
    }

    setStatusActionMember(null)
  }

  return (
    <div>
      <PageHeader
        title="Member Management"
        description="Register, view, edit, and manage cooperative members."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Members' },
        ]}
        actions={
          <Button onClick={() => setAddMemberOpen(true)}>
            <Plus className="size-4" aria-hidden="true" />
            Add Member
          </Button>
        }
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
                <MoreHorizontal
                  className="size-4"
                  aria-hidden="true"
                />
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
                  View Profile
                </DropdownItem>

                <DropdownItem
                  onClick={() => {
                    navigate(`/admin/members/${row.id}`)
                    close()
                  }}
                >
                  Edit
                </DropdownItem>

                {row.status === 'SUSPENDED' ||
                row.status === 'INACTIVE' ? (
                  <DropdownItem
                    onClick={() => {
                      setStatusActionMember(row)
                      close()
                    }}
                  >
                    Activate
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    danger
                    onClick={() => {
                      setStatusActionMember(row)
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
                onClick={() =>
                  navigate(`/admin/members/${row.id}`)
                }
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
          {
            key: 'branch',
            header: 'Branch',
            render: (row) => row.branch,
          },
          {
            key: 'joined',
            header: 'Joined',
            render: (row) => formatDate(row.joinedOn),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <StatusBadge status={row.status} />
            ),
          },
          {
            key: 'savings',
            header: 'Savings',
            align: 'right',
            render: (row) =>
              formatCurrency(row.totalSavings),
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

      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
      />

      {statusActionMember && (
        <ConfirmModal
          open
          onClose={() => setStatusActionMember(null)}
          onConfirm={handleStatusConfirm}
          title={
            isSuspendedOrInactive
              ? 'Activate member?'
              : 'Suspend member?'
          }
          description={
            isSuspendedOrInactive
              ? `Are you sure you want to activate ${statusActionMember.name}?`
              : `Are you sure you want to suspend ${statusActionMember.name}?`
          }
          confirmLabel={
            isSuspendedOrInactive
              ? 'Activate Member'
              : 'Suspend Member'
          }
          variant={
            isSuspendedOrInactive ? 'primary' : 'danger'
          }
        />
      )}
    </div>
  )
}