import { Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PageHeader } from '@/components/layout/PageHeader'
import { loanTypes } from '@/data/loans'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'
import type { LoanType } from '@/types/coop'

export function LoanApplyPage() {
  const navigate = useNavigate()
  const [type, setType] = useState<LoanType>(loanTypes[0]!.type)
  const [amount, setAmount] = useState('500000')
  const [purpose, setPurpose] = useState('')
  const [termMonths, setTermMonths] = useState('6')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedType = loanTypes.find((item) => item.type === type)!

  const monthlyPayment = useMemo(() => {
    const principal = Number(amount) || 0
    const months = Number(termMonths) || 1
    const totalInterest = principal * (selectedType.interestRate / 100)
    return Math.round((principal + totalInterest) / months)
  }, [amount, termMonths, selectedType])

  const submit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast('Loan application submitted for review.')
      navigate('/loans')
    }, 700)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Apply for a Loan"
        description="Fill in the details below — the loan committee will review your application."
        breadcrumbs={[{ label: 'Loans', to: '/loans' }, { label: 'Apply' }]}
      />

      <Card className="p-6">
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {loanTypes.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => setType(item.type)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                type === item.type
                  ? 'border-brand bg-brand-soft'
                  : 'border-border hover:bg-surface-hover'
              }`}
            >
              <p className="text-text text-sm font-semibold">{item.type}</p>
              <p className="text-text-muted mt-1 text-xs">{item.description}</p>
              <p className="text-brand-strong mt-2 text-xs font-medium">
                {item.interestRate}% p.a. · up to{' '}
                {formatCurrency(item.maxAmount)}
              </p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Amount requested (TSh)"
            type="number"
            min={10_000}
            max={selectedType.maxAmount}
            step={10_000}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            helperText={`Maximum for ${selectedType.type}: ${formatCurrency(selectedType.maxAmount)}`}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="loan-term"
              className="text-text text-sm font-medium"
            >
              Repayment period (months)
            </label>
            <Select
              id="loan-term"
              value={termMonths}
              onChange={(event) => setTermMonths(event.target.value)}
              options={Array.from(
                { length: selectedType.maxTermMonths },
                (_, index) => index + 1,
              )
                .filter(
                  (month) =>
                    month % (selectedType.maxTermMonths > 12 ? 6 : 1) === 0 ||
                    month === selectedType.maxTermMonths,
                )
                .map((month) => ({
                  value: String(month),
                  label: `${month} months`,
                }))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <label
            htmlFor="loan-purpose"
            className="text-text text-sm font-medium"
          >
            Purpose
          </label>
          <textarea
            id="loan-purpose"
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
            rows={3}
            placeholder="What will this loan be used for?"
            className="border-border bg-surface text-text focus-visible:border-brand rounded-lg border px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="bg-surface-sunken mt-5 rounded-xl p-4">
          <p className="text-text-muted text-xs">Expected monthly payment</p>
          <p className="text-text text-2xl font-bold">
            {formatCurrency(monthlyPayment)}
          </p>
        </div>

        <Alert variant="info" className="mt-4">
          <Info className="mr-1 inline size-3.5" aria-hidden="true" />
          This is a demo estimate for illustration only — final terms are
          confirmed once the loan committee approves your application.
        </Alert>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate('/loans')}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            isLoading={isSubmitting}
            disabled={!purpose.trim()}
          >
            Submit application
          </Button>
        </div>
      </Card>
    </div>
  )
}
