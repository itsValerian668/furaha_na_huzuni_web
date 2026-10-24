import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

interface RescheduleModalProps {
  open: boolean
  title: string
  date: string
  time?: string
  onClose: () => void
  onSave: (date: string, time?: string) => void
}

export function RescheduleModal({
  open,
  title,
  date,
  time,
  onClose,
  onSave,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState(date)
  const [newTime, setNewTime] = useState(time ?? '')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!newDate || (time !== undefined && !newTime)) {
      return
    }

    onSave(newDate, time === undefined ? undefined : newTime)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Reschedule ${title}`}
      description="Choose the updated date and time. The change will appear in the schedule."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="reschedule-form">
            Save new schedule
          </Button>
        </>
      }
    >
      <form
        id="reschedule-form"
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2"
      >
        <Input
          label="New date"
          type="date"
          value={newDate}
          onChange={(event) => setNewDate(event.target.value)}
          required
        />
        {time !== undefined && (
          <Input
            label="New time"
            type="time"
            value={newTime}
            onChange={(event) => setNewTime(event.target.value)}
            required
          />
        )}
      </form>
    </Modal>
  )
}
