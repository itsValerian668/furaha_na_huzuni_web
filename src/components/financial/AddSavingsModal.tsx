import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { toast } from '@/stores/toast.store'

export function AddSavingsModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [amount, setAmount] = useState('50000')
  const [method, setMethod] = useState('MOBILE_MONEY')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
      toast('Contribution recorded successfully.')
    }, 600)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a savings contribution"
      description="This is a demo action — no real payment is processed."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} isLoading={isSubmitting}>
            Record contribution
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Amount (TSh)"
          type="number"
          min={1000}
          step={1000}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="savings-method"
            className="text-text text-sm font-medium"
          >
            Payment method
          </label>
          <Select
            id="savings-method"
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            options={[
              { value: 'MOBILE_MONEY', label: 'Mobile Money' },
              { value: 'CASH', label: 'Cash' },
              { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
            ]}
            className="w-full"
          />
        </div>
      </div>
    </Modal>
  )
}
