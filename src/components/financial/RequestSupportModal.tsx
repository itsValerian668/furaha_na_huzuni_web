import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { welfareCategories } from '@/data/welfare'
import { toast } from '@/stores/toast.store'

export function RequestSupportModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [category, setCategory] = useState<string>(welfareCategories[0])
  const [amount, setAmount] = useState('200000')
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
      toast('Welfare support request submitted for review.')
    }, 600)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request community support"
      description="Your request will be reviewed by the Welfare Committee."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            isLoading={isSubmitting}
            disabled={!reason.trim()}
          >
            Submit request
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="welfare-category"
            className="text-text text-sm font-medium"
          >
            Support category
          </label>
          <Select
            id="welfare-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            options={welfareCategories.map((item) => ({
              value: item,
              label: item,
            }))}
            className="w-full"
          />
        </div>
        <Input
          label="Amount requested (TSh)"
          type="number"
          min={10_000}
          step={10_000}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="welfare-reason"
            className="text-text text-sm font-medium"
          >
            Reason for request
          </label>
          <textarea
            id="welfare-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            placeholder="Briefly describe your situation…"
            className="border-border bg-surface text-text focus-visible:border-brand rounded-lg border px-3 py-2 text-sm"
            required
          />
        </div>
      </div>
    </Modal>
  )
}
