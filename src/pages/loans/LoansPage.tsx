import { HandCoins, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { StatCard } from '@/components/financial/StatCard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/feedback/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { SectionTabs } from '@/components/layout/SectionTabs'
import { availableCredit, getMemberLoans } from '@/data/loans'
import { currentMember } from '@/data/members'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function LoansPage() {
  const navigate = useNavigate()
  const memberLoans = getMemberLoans(currentMember.id)
  const activeLoan = memberLoans.find(
    (loan) => loan.status === 'ACTIVE' || loan.status === 'OVERDUE',
  )
  const paidInstallments =
    activeLoan?.installments.filter(
      (installment) => installment.status === 'PAID',
    ).length ?? 0
  const totalInstallments = activeLoan?.installments.length ?? 0
  const paidAmount = activeLoan
    ? activeLoan.principal - activeLoan.outstandingBalance
    : 0

  return (
    <div>
      <PageHeader
        title="Loans"
        description="Your credit with the cooperative and repayment progress."
        breadcrumbs={[{ label: 'Loans' }]}
        actions={
          <Button onClick={() => navigate('/loans/apply')}>
            <Plus className="size-4" aria-hidden="true" /> Apply for Loan
          </Button>
        }
      />
      <SectionTabs
        items={[
          { label: 'Overview', to: '/loans', end: true },
          { label: 'Repayments', to: '/loans/repayments' },
          { label: 'History', to: '/loans/history' },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Outstanding Loan"
          amount={currentMember.outstandingLoan}
          tone="neutral"
          icon={HandCoins}
        />
        <StatCard label="Available Credit" amount={availableCredit} />
        <StatCard
          label="Monthly Payment"
          amount={activeLoan?.monthlyPayment ?? 0}
          tone="neutral"
        />
        <StatCard
          label="Interest Rate"
          amount={activeLoan?.interestRate ?? 0}
          format="percent"
          tone="gold"
          helperText={activeLoan ? 'per annum' : 'No active loan'}
        />
      </div>

      {activeLoan ? (
        <Card className="p-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-text-muted text-xs">{activeLoan.reference}</p>
              <p className="text-text text-lg font-semibold">
                {activeLoan.type}
              </p>
            </div>
            <StatusBadge status={activeLoan.status} />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-text-muted text-xs">Original Amount</p>
              <p className="text-text text-sm font-semibold">
                {formatCurrency(activeLoan.principal)}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Outstanding</p>
              <p className="text-text text-sm font-semibold">
                {formatCurrency(activeLoan.outstandingBalance)}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Next Payment</p>
              <p className="text-text text-sm font-semibold">
                {activeLoan.nextPaymentDate
                  ? formatDate(activeLoan.nextPaymentDate)
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Remaining Term</p>
              <p className="text-text text-sm font-semibold">
                {totalInstallments - paidInstallments} of {totalInstallments}{' '}
                payments
              </p>
            </div>
          </div>
          <ProgressBar
            value={paidAmount}
            max={activeLoan.principal}
            tone={activeLoan.status === 'OVERDUE' ? 'negative' : 'brand'}
          />
          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={() => navigate(`/loans/${activeLoan.id}`)}
            >
              View full details
            </Button>
          </div>
        </Card>
      ) : (
        <EmptyState
          title="No active loans"
          description="You don't have an active loan right now."
          action={
            <Button onClick={() => navigate('/loans/apply')}>
              Apply for a loan
            </Button>
          }
        />
      )}

      {memberLoans.length > 1 && (
        <div className="mt-6">
          <p className="text-text mb-3 text-sm font-semibold">All your loans</p>
          <div className="flex flex-col gap-3">
            {memberLoans.map((loan) => (
              <button
                key={loan.id}
                type="button"
                onClick={() => navigate(`/loans/${loan.id}`)}
                className="border-border bg-surface hover:bg-surface-hover flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors"
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
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
