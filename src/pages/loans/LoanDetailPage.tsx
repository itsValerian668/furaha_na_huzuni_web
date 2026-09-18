import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { getLoanById } from '@/data/loans'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'

export function LoanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [payModalOpen, setPayModalOpen] = useState(false)
  const loan = id ? getLoanById(id) : undefined

  if (!loan) return <Navigate to="/loans" replace />

  const paidAmount = loan.principal - loan.outstandingBalance
  const canPay = loan.status === 'ACTIVE' || loan.status === 'OVERDUE'

  return (
    <div>
      <PageHeader
        title={loan.type}
        description={loan.purpose}
        breadcrumbs={[
          { label: 'Loans', to: '/loans' },
          {
            label:
              loan.status === 'COMPLETED' ? 'Loan History' : 'Active Loans',
            to: loan.status === 'COMPLETED' ? '/loans/history' : '/loans',
          },
          { label: loan.reference },
        ]}
        actions={
          canPay ? (
            <Button onClick={() => setPayModalOpen(true)}>
              Make a Payment
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <p className="text-text-muted text-xs">Original Amount</p>
          <p className="text-text mt-1 text-lg font-bold">
            {formatCurrency(loan.principal)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs">Outstanding</p>
          <p className="text-text mt-1 text-lg font-bold">
            {formatCurrency(loan.outstandingBalance)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs">Interest Rate</p>
          <p className="text-text mt-1 text-lg font-bold">
            {loan.interestRate}% p.a.
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-text-muted text-xs">Status</p>
          <p className="mt-1.5">
            <StatusBadge status={loan.status} />
          </p>
        </Card>
      </div>

      <Card className="mb-6 p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-text font-medium">Repayment progress</span>
          <span className="text-text-muted">
            {formatCurrency(paidAmount)} of {formatCurrency(loan.principal)}
          </span>
        </div>
        <ProgressBar
          value={paidAmount}
          max={loan.principal}
          tone={loan.status === 'OVERDUE' ? 'negative' : 'brand'}
        />
      </Card>

      <Card>
        <CardHeader
          title="Payment Schedule"
          description={`${loan.termMonths}-month repayment plan`}
        />
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-border text-text-muted border-b text-xs uppercase">
                <th className="py-2 text-left font-semibold">Due Date</th>
                <th className="py-2 text-right font-semibold">Principal</th>
                <th className="py-2 text-right font-semibold">Interest</th>
                <th className="py-2 text-right font-semibold">Amount</th>
                <th className="py-2 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loan.installments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-text-muted py-6 text-center">
                    No schedule yet — this loan hasn't been disbursed.
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
                    <td className="text-text py-3 text-right">
                      {formatCurrency(installment.principal)}
                    </td>
                    <td className="text-text py-3 text-right">
                      {formatCurrency(installment.interest)}
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

      <Modal
        open={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Make a loan payment"
        description="This is a demo action — no real payment is processed."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPayModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setPayModalOpen(false)
                toast('Loan repayment recorded successfully.')
              }}
            >
              Confirm payment
            </Button>
          </>
        }
      >
        <Input
          label="Amount (TSh)"
          type="number"
          defaultValue={loan.monthlyPayment}
          min={1000}
          step={1000}
        />
      </Modal>
    </div>
  )
}
