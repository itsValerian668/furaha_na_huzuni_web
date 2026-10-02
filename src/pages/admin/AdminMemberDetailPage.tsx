import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { TransactionRow } from '@/components/financial/TransactionRow'
import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { EditMemberModal } from '@/components/members/EditMemberModal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs } from '@/components/ui/Tabs'
import { getMemberTransactions } from '@/data/transactions'
import { welfareRequests } from '@/data/welfare'
import { useMembersStore } from '@/stores/members.store'
import { toast } from '@/stores/toast.store'
import { ROLE_LABELS, type Member } from '@/types/coop'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function AdminMemberDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState('overview')
  const [editMember, setEditMember] = useState<Member | null>(null)
  const [statusActionOpen, setStatusActionOpen] = useState(false)

  const members = useMembersStore((state) => state.members)

  const updateMemberStatus = useMembersStore(
    (state) => state.updateMemberStatus,
  )

  const member = id
    ? members.find((item) => item.id === id)
    : undefined

  if (!member) {
    return <Navigate to="/admin/members" replace />
  }

  const transactions = getMemberTransactions(member.id)

  const requests = welfareRequests.filter(
    (request) => request.memberId === member.id,
  )

  const canActivate =
    member.status === 'SUSPENDED' ||
    member.status === 'INACTIVE'

  const handleStatusConfirm = () => {
    const newStatus = canActivate ? 'ACTIVE' : 'SUSPENDED'

    updateMemberStatus(member.id, newStatus)

    if (newStatus === 'ACTIVE') {
      toast(`${member.name} reactivated.`)
    } else {
      toast(`${member.name} suspended.`, 'error')
    }

    setStatusActionOpen(false)
  }

  return (
    <div>
      <PageHeader
        title={member.name}
        description={`${member.memberNumber} · ${ROLE_LABELS[member.role]}`}
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Members', to: '/admin/members' },
          { label: member.name },
        ]}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditMember(member)}
            >
              Edit
            </Button>

            {canActivate ? (
              <Button
                onClick={() => setStatusActionOpen(true)}
              >
                Activate
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={() => setStatusActionOpen(true)}
              >
                Suspend
              </Button>
            )}
          </>
        }
      />

      <Card className="mb-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <MemberAvatar
          name={member.name}
          color={member.avatarColor}
          size={64}
        />

        <div className="flex-1">
          <p className="text-text text-lg font-bold">
            {member.name}
          </p>

          <p className="text-text-muted text-sm">
            {member.email} · {member.phone}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={member.status} />
            <StatusBadge status={member.welfareStatus} />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-text-muted text-xs">
              Savings
            </dt>

            <dd className="text-text text-sm font-semibold">
              {formatCurrency(member.totalSavings)}
            </dd>
          </div>

          <div>
            <dt className="text-text-muted text-xs">
              Joined
            </dt>

            <dd className="text-text text-sm font-semibold">
              {formatDate(member.joinedOn)}
            </dd>
          </div>
        </dl>
      </Card>

      <Tabs
        items={[
          {
            value: 'overview',
            label: 'Overview',
          },
          {
            value: 'transactions',
            label: 'Transactions',
            count: transactions.length,
          },
          {
            value: 'welfare',
            label: 'Welfare',
            count: requests.length,
          },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-6">
        {tab === 'overview' && (
          <Card className="p-6">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-text-muted text-xs">
                  Branch
                </dt>

                <dd className="text-text text-sm font-semibold">
                  {member.branch}
                </dd>
              </div>

              <div>
                <dt className="text-text-muted text-xs">
                  Occupation
                </dt>

                <dd className="text-text text-sm font-semibold">
                  {member.occupation}
                </dd>
              </div>

              <div>
                <dt className="text-text-muted text-xs">
                  Address
                </dt>

                <dd className="text-text text-sm font-semibold">
                  {member.address}
                </dd>
              </div>

              <div>
                <dt className="text-text-muted text-xs">
                  Next of Kin
                </dt>

                <dd className="text-text text-sm font-semibold">
                  —
                </dd>
              </div>

              <div>
                <dt className="text-text-muted text-xs">
                  Role
                </dt>

                <dd className="text-text text-sm font-semibold">
                  {ROLE_LABELS[member.role]}
                </dd>
              </div>

              <div>
                <dt className="text-text-muted text-xs">
                  Member Since
                </dt>

                <dd className="text-text text-sm font-semibold">
                  {formatDate(member.joinedOn)}
                </dd>
              </div>
            </dl>
          </Card>
        )}

        {tab === 'transactions' && (
          <Card className="divide-border divide-y p-0">
            {transactions.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="No transactions"
                  description="This member has no recorded transactions."
                />
              </div>
            ) : (
              <div className="px-5">
                {transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </div>
            )}
          </Card>
        )}

        {tab === 'welfare' && (
          <div className="flex flex-col gap-3">
            {requests.length === 0 ? (
              <EmptyState
                title="No welfare requests"
                description="This member has not requested welfare support."
              />
            ) : (
              requests.map((request) => (
                <Card
                  key={request.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="text-text text-sm font-medium">
                      {request.category}
                    </p>

                    <p className="text-text-muted text-xs">
                      {request.reference} ·{' '}
                      {formatDate(request.submittedOn)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-text text-sm font-semibold">
                      {formatCurrency(
                        request.amountApproved ??
                          request.amountRequested,
                      )}
                    </span>

                    <StatusBadge status={request.status} />
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {editMember && (
        <EditMemberModal
          open
          member={editMember}
          onClose={() => setEditMember(null)}
        />
      )}

      <ConfirmModal
        open={statusActionOpen}
        onClose={() => setStatusActionOpen(false)}
        onConfirm={handleStatusConfirm}
        title={
          canActivate
            ? 'Activate member?'
            : 'Suspend member?'
        }
        description={
          canActivate
            ? `Are you sure you want to reactivate ${member.name}?`
            : `Are you sure you want to suspend ${member.name}?`
        }
        confirmLabel={
          canActivate
            ? 'Activate Member'
            : 'Suspend Member'
        }
        variant={canActivate ? 'primary' : 'danger'}
      />
    </div>
  )
}