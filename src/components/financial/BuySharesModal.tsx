import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { shareOverview } from '@/data/shares'
import { toast } from '@/stores/toast.store'
import { formatCurrency } from '@/utils/currency'

export function BuySharesModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [shares, setShares] = useState('4')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const shareCount = Number(shares) || 0
  const amount = shareCount * shareOverview.shareValue

  const submit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onClose()
      toast('Share purchase submitted for confirmation.')
    }, 600)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Buy shares"
      description="This is a demo action — no real payment is processed."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            isLoading={isSubmitting}
            disabled={shareCount <= 0}
          >
            Buy {shareCount || 0} shares
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Number of shares"
          type="number"
          min={1}
          value={shares}
          onChange={(event) => setShares(event.target.value)}
          helperText={`Share value: ${formatCurrency(shareOverview.shareValue)} per share`}
          required
        />
        <div className="bg-surface-sunken rounded-lg px-4 py-3">
          <p className="text-text-muted text-xs">Total cost</p>
          <p className="text-text text-lg font-bold">
            {formatCurrency(amount)}
          </p>
        </div>
      </div>
    </Modal>
  )
}
