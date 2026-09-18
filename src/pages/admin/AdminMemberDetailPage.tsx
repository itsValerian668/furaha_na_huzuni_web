import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { TransactionRow } from '@/components/financial/TransactionRow'
import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/feedback/EmptyState'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Tabs } from '@/components/ui/Tabs'
import { getMemberById } from '@/data/members'
import { getMemberLoans } from '@/data/loans'
import { getMemberTransactions } from '@/data/transactions'
import { welfareRequests } from '@/data/welfare'
import { toast } from '@/stores/toast.store'
import { ROLE_LABELS } from '@/types/coop'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function AdminMemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [tab, setTab] = useState('overview')
  const member = id ? getMemberById(id) : undefined

  if (!member) return <Navigate to="/admin/members" replace />

  const transactions = getMemberTransactions(member.id)
  const loans = getMemberLoans(member.id)
  const requests = welfareRequests.filter(
    (request) => request.memberId === member.id,
  )

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
              onClick={() =>
                toast(`${member.name}'s profile opened for editing.`)
              }
            >
              Edit
            </Button>
            {member.status === 'SUSPENDED' ? (
              <Button onClick={() => toast(`${member.name} reactivated.`)}>
                Activate
              </Button>
            ) : (
              <Button
                variant="danger"
                onClick={() => toast(`${member.name} suspended.`, 'error')}
              >
                Suspend
              </Button>
            )}
          </>
        }
      />

      <Card className="mb-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <MemberAvatar name={member.name} color={member.avatarColor} size={64} />
        <div className="flex-1">
          <p className="text-text text-lg font-bold">{member.name}</p>
          <p className="text-text-muted text-sm">
            {member.email} · {member.phone}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={member.status} />
            <StatusBadge status={member.welfareStatus} />
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <dt className="text-text-muted text-xs">Savings</dt>
            <dd className="text-text text-sm font-semibold">
              {formatCurrency(member.totalSavings)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Shares</dt>
            <dd className="text-text text-sm font-semibold">
              {formatCurrency(member.shareValue)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Loan</dt>
            <dd className="text-text text-sm font-semibold">
              {formatCurrency(member.outstandingLoan)}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs">Joined</dt>
            <dd className="text-text text-sm font-semibold">
              {formatDate(member.joinedOn)}
            </dd>
          </div>
        </dl>
      </Card>

      <Tabs
        items={[
          { value: 'overview', label: 'Overview' },
          {
            value: 'transactions',
            label: 'Transactions',
            count: transactions.length,
          },
          { value: 'loans', label: 'Loans', count: loans.length },
          { value: 'welfare', label: 'Welfare', count: requests.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-6">
        {tab === 'overview' && (
          <Card className="p-6">
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-text-muted text-xs">Branch</dt>
                <dd className="text-text text-sm font-semibold">
                  {member.branch}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Occupation</dt>
                <dd className="text-text text-sm font-semibold">
                  {member.occupation}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Address</dt>
                <dd className="text-text text-sm font-semibold">
                  {member.address}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Next of Kin</dt>
                <dd className="text-text text-sm font-semibold">
                  {member.nextOfKin}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Total Shares</dt>
                <dd className="text-text text-sm font-semibold">
                  {member.totalShares} shares
                </dd>
              </div>
              <div>
                <dt className="text-text-muted text-xs">Role</dt>
                <dd className="text-text text-sm font-semibold">
                  {ROLE_LABELS[member.role]}
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

        {tab === 'loans' && (
          <div className="flex flex-col gap-3">
            {loans.length === 0 ? (
              <EmptyState
                title="No loans"
                description="This member has no loan history."
              />
            ) : (
              loans.map((loan) => (
                <Card
                  key={loan.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="text-text text-sm font-medium">{loan.type}</p>
                    <p className="text-text-muted text-xs">{loan.reference}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text text-sm font-semibold">
                      {formatCurrency(loan.outstandingBalance)}
                    </span>
                    <StatusBadge status={loan.status} />
                  </div>
                </Card>
              ))
            )}
          </div>
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
                      {request.reference} · {formatDate(request.submittedOn)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text text-sm font-semibold">
                      {formatCurrency(
                        request.amountApproved ?? request.amountRequested,
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
    </div>
  )
}
