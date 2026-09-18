import { Clock, MapPin, Plus } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useIsAdminRole } from '@/hooks/useActiveRole'
import { cooperativeEvents } from '@/data/events'
import { toast } from '@/stores/toast.store'

const TYPE_COLORS: Record<string, string> = {
  Meeting: 'bg-brand-soft text-brand-strong',
  Savings: 'bg-positive-soft text-positive',
  Training: 'bg-accent-soft text-accent',
  Community: 'bg-warning-soft text-warning',
  Election: 'bg-negative-soft text-negative',
}

export function EventsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const isAdmin = useIsAdminRole()
  const sorted = [...cooperativeEvents].sort((a, b) =>
    a.date.localeCompare(b.date),
  )

  return (
    <div>
      <PageHeader
        title="Events"
        description="Cooperative meetings, trainings and community gatherings."
        breadcrumbs={[{ label: 'Events' }]}
        actions={
          isAdmin ? (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="size-4" aria-hidden="true" /> Create Event
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-4">
        {sorted.map((event) => {
          const date = new Date(event.date)
          return (
            <Card
              key={event.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
            >
              <div className="bg-surface-sunken flex w-16 shrink-0 flex-col items-center rounded-xl py-2.5">
                <span className="text-text-muted text-xs font-semibold uppercase">
                  {date.toLocaleDateString('en-GB', { month: 'short' })}
                </span>
                <span className="text-text text-xl font-bold">
                  {date.getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[event.type]}`}
                >
                  {event.type}
                </span>
                <p className="text-text mt-1.5 text-sm font-semibold">
                  {event.title}
                </p>
                <p className="text-text-muted text-xs">{event.description}</p>
                <div className="text-text-muted mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" aria-hidden="true" />{' '}
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden="true" />{' '}
                    {event.location}
                  </span>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() =>
                  toast(`Added "${event.title}" to your calendar.`)
                }
              >
                Add to calendar
              </Button>
            </Card>
          )
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create an event"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setModalOpen(false)
                toast('Event created and published to members.')
              }}
            >
              Create event
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Event title"
            placeholder="e.g. Financial Literacy Session"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
          </div>
          <Input label="Location" placeholder="e.g. Kinondoni Community Hall" />
        </div>
      </Modal>
    </div>
  )
}
