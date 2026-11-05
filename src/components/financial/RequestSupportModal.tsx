import { useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { welfareCategories } from '@/data/welfare'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from '@/stores/toast.store'
import { useWelfareStore } from '@/stores/welfare.store'
import type { WelfareRequest } from '@/types/coop'

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]

export function RequestSupportModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const user = useAuthStore((state) => state.user)
  const addRequest = useWelfareStore((state) => state.addRequest)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [category, setCategory] = useState<string>(welfareCategories[0])
  const [amount, setAmount] = useState('200000')
  const [reason, setReason] = useState('')
  const [supportingDocument, setSupportingDocument] =
    useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast(
        'Please upload a PDF, JPG, PNG, or WEBP document.',
        'error',
      )

      event.target.value = ''
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast('The supporting document must be 5 MB or smaller.', 'error')

      event.target.value = ''
      return
    }

    setSupportingDocument(file)
  }

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Unable to read the selected file.'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Unable to read the selected file.'))
      }

      reader.readAsDataURL(file)
    })

  const resetForm = () => {
    setCategory(welfareCategories[0])
    setAmount('200000')
    setReason('')
    setSupportingDocument(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const submit = async () => {
    if (!reason.trim()) {
      return
    }

    if (!user) {
      toast('You must be logged in to submit a support request.', 'error')
      return
    }

    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount) || numericAmount < 10_000) {
      toast('Please enter a valid amount of at least TSh 10,000.', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      let documentData:
        | WelfareRequest['supportingDocument']
        | undefined

      if (supportingDocument) {
        const dataUrl = await readFileAsDataUrl(supportingDocument)

        documentData = {
          name: supportingDocument.name,
          type: supportingDocument.type,
          size: supportingDocument.size,
          dataUrl,
        }
      }

      const request: WelfareRequest = {
        id: `WR-${Date.now()}`,
        reference: `WEL-${Date.now()}`,
        memberId: String(user.id),
        memberName: user.name,
        category: category as WelfareRequest['category'],
        amountRequested: numericAmount,
        reason: reason.trim(),
        status: 'PENDING',
        submittedOn: new Date().toISOString(),
        supportingDocument: documentData,
      }

      addRequest(request)

      onClose()
      resetForm()

      toast('Welfare support request submitted for review.')
    } catch {
      toast(
        'The supporting document could not be uploaded. Please try again.',
        'error',
      )
    } finally {
      setIsSubmitting(false)
    }
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
            disabled={!reason.trim() || !amount}
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

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="welfare-supporting-document"
            className="text-text text-sm font-medium"
          >
            Supporting document
            <span className="text-text-muted ml-1 font-normal">
              (optional)
            </span>
          </label>

          <input
            ref={fileInputRef}
            id="welfare-supporting-document"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleDocumentChange}
            className="border-border bg-surface text-text file:bg-brand-soft file:text-brand-strong hover:file:bg-brand-soft rounded-lg border px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />

          <p className="text-text-muted text-xs">
            Upload a medical report, wedding document, graduation
            document, accident report, or other relevant evidence.
            PDF, JPG, PNG, or WEBP up to 5 MB.
          </p>

          {supportingDocument && (
            <div className="bg-surface-sunken text-text-muted rounded-lg px-3 py-2 text-xs">
              Selected:{' '}
              <span className="text-text font-medium">
                {supportingDocument.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}