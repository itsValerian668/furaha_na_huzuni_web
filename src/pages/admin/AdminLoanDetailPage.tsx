import { Check } from 'lucide-react'
import { Navigate, useParams } from 'react-router-dom'

import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getLoanById } from '@/data/loans'
import { toast } from '@/stores/toast.store'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

const WORKFLOW = ['PENDING', 'APPROVED', 'DISBURSED', 'ACTIVE', 'COMPLETED']

export function AdminLoanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const loan = id ? getLoanById(id) : undefined

  if (!loan) return <Navigate to="/admin/loans" replace />

  const effectiveStage =
    loan.status === 'UNDER_REVIEW'
      ? 'PENDING'
      : loan.status === 'OVERDUE'
        ? 'ACTIVE'
        : loan.status
  const stageIndex =
    loan.status === 'REJECTED' ? -1 : WORKFLOW.indexOf(effectiveStage)
  const paidAmount = loan.principal - loan.outstandingBalance

  return (
    <div>
      <PageHeader
        title={`${loan.type} — ${loan.memberName}`}
        description={loan.purpose}
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Loans', to: '/admin/loans' },
          { label: loan.reference },
        ]}
        actions={
          loan.status === 'PENDING' || loan.status === 'UNDER_REVIEW' ? (
            <>
              <Button
                variant="danger"
                onClick={() =>
                  toast(`Loan ${loan.reference} rejected.`, 'error')
                }
              >
                Reject
              </Button>
              <Button
                onClick={() =>
                  toast(`Loan ${loan.reference} approved successfully.`)
                }
              >
                Approve
              </Button>
            </>
          ) : loan.status === 'APPROVED' ? (
            <Button
              onClick={() =>
                toast(`Loan ${loan.reference} disbursed successfully.`)
              }
            >
              Disburse
            </Button>
          ) : undefined
        }
      />

      {loan.status !== 'REJECTED' && (
        <Card className="mb-6 p-5">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-medium">
            {WORKFLOW.map((stage, index) => (
              <li key={stage} className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1.5',
                    index <= stageIndex
                      ? 'bg-brand text-on-brand'
                      : 'bg-surface-sunken text-text-muted',
                  )}
                >
                  {index < stageIndex && (
                    <Check className="size-3" aria-hidden="true" />
                  )}
                  {stage.charAt(0) + stage.slice(1).toLowerCase()}
                </span>
                {index < WORKFLOW.length - 1 && (
                  <span className="bg-border h-px w-4" />
                )}
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <div className="flex items-center gap-3">
            <MemberAvatar name={loan.memberName} size={44} />
            <div>
              <p className="text-text text-sm font-semibold">
                {loan.memberName}
              </p>
              <p className="text-text-muted text-xs">{loan.memberId}</p>
            </div>
          </div>
          <dl className="border-border mt-4 flex flex-col gap-3 border-t pt-4">
            <div className="flex justify-between">
              <dt className="text-text-muted text-xs">Status</dt>
              <dd>
                <StatusBadge status={loan.status} />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted text-xs">Applied On</dt>
              <dd className="text-text text-sm font-medium">
                {formatDate(loan.appliedOn)}
              </dd>
            </div>
            {loan.approvedOn && (
              <div className="flex justify-between">
                <dt className="text-text-muted text-xs">Approved On</dt>
                <dd className="text-text text-sm font-medium">
                  {formatDate(loan.approvedOn)}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className="text-text-muted text-xs">Principal</dt>
              <dd className="text-text text-sm font-semibold">
                {formatCurrency(loan.principal)}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted text-xs">Interest Rate</dt>
              <dd className="text-text text-sm font-semibold">
                {loan.interestRate}% p.a.
              </dd>
            </div>
            <div>
              <dt className="text-text-muted text-xs">Term</dt>
              <dd className="text-text text-sm font-semibold">
                {loan.termMonths} months
              </dd>
            </div>
            <div>
              <dt className="text-text-muted text-xs">Outstanding</dt>
              <dd className="text-text text-sm font-semibold">
                {formatCurrency(loan.outstandingBalance)}
              </dd>
            </div>
          </dl>
          {loan.installments.length > 0 && (
            <div className="mt-4">
              <ProgressBar
                value={paidAmount}
                max={loan.principal}
                tone={loan.status === 'OVERDUE' ? 'negative' : 'brand'}
              />
              <p className="text-text-muted mt-1.5 text-xs">
                {formatCurrency(paidAmount)} repaid of{' '}
                {formatCurrency(loan.principal)}
              </p>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader title="Payment Schedule" />
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-border text-text-muted border-b text-xs uppercase">
                <th className="py-2 text-left font-semibold">Due Date</th>
                <th className="py-2 text-right font-semibold">Amount</th>
                <th className="py-2 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loan.installments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-text-muted py-6 text-center">
                    No schedule yet — pending disbursement.
                  </td>
                </tr>
              ) : (
                loan.installments.map((installment) => (
                  <tr
                    key={installment.id}
                    className="border-border border-b last:border-b-0"
                  >
                    <td className="text-text py-3">
                      {formatDate(installment.dueDate)}
                    </td>
                    <td className="text-text py-3 text-right font-medium">
                      {formatCurrency(installment.amount)}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={installment.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
