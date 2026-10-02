import {
  Edit,
  MapPin,
  Pin,
  Plus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useEventsStore } from '@/stores/events.store'
import { toast } from '@/stores/toast.store'
import type { CooperativeEvent } from '@/types/coop'

const EVENT_TYPES: CooperativeEvent['type'][] = [
  'Meeting',
  'Savings',
  'Training',
  'Community',
  'Election',
]

const TYPE_COLORS: Record<
  CooperativeEvent['type'],
  string
> = {
  Meeting: 'bg-brand-soft text-brand-strong',
  Savings: 'bg-positive-soft text-positive',
  Training: 'bg-accent-soft text-accent',
  Community: 'bg-warning-soft text-warning',
  Election: 'bg-negative-soft text-negative',
}

interface EventForm {
  title: string
  type: CooperativeEvent['type']
  date: string
  time: string
  location: string
  description: string
}

const EMPTY_FORM: EventForm = {
  title: '',
  type: 'Meeting',
  date: '',
  time: '',
  location: '',
  description: '',
}

export function AdminEventsPage() {
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleGlobalPin,
  } = useEventsStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] =
    useState<CooperativeEvent | null>(null)
  const [form, setForm] =
    useState<EventForm>(EMPTY_FORM)

  const sortedEvents = [...events].sort((a, b) => {
    if (
      Boolean(a.globalPinned) !==
      Boolean(b.globalPinned)
    ) {
      return (
        Number(Boolean(b.globalPinned)) -
        Number(Boolean(a.globalPinned))
      )
    }

    return a.date.localeCompare(b.date)
  })

  function openCreateModal() {
    setEditingEvent(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEditModal(event: CooperativeEvent) {
    setEditingEvent(event)

    setForm({
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
    })

    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingEvent(null)
    setForm(EMPTY_FORM)
  }

  function updateForm(
    field: keyof EventForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSave() {
    if (!form.title.trim()) {
      toast('Please enter an event title.')
      return
    }

    if (!form.date) {
      toast('Please select an event date.')
      return
    }

    if (!form.time) {
      toast('Please select an event time.')
      return
    }

    if (!form.location.trim()) {
      toast('Please enter the event location.')
      return
    }

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: form.title.trim(),
        type: form.type,
        date: form.date,
        time: form.time,
        location: form.location.trim(),
        description: form.description.trim(),
      })

      toast('Event updated successfully.')
    } else {
      const newEvent: CooperativeEvent = {
        id: `EV-${Date.now()}`,
        title: form.title.trim(),
        type: form.type,
        date: form.date,
        time: form.time,
        location: form.location.trim(),
        description: form.description.trim(),
        globalPinned: false,
        personalPinnedBy: [],
      }

      addEvent(newEvent)

      toast(
        'Event created and published to members.',
      )
    }

    closeModal()
  }

  function handleDelete(event: CooperativeEvent) {
    const confirmed = window.confirm(
      `Delete "${event.title}"? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    deleteEvent(event.id)
    toast('Event deleted.')
  }

  return (
    <div>
      <PageHeader
        title="Event Management"
        description="Create, edit, publish and manage cooperative events."
        breadcrumbs={[
          { label: 'Admin' },
          { label: 'Events' },
        ]}
        actions={
          <Button onClick={openCreateModal}>
            <Plus
              className="size-4"
              aria-hidden="true"
            />
            Create Event
          </Button>
        }
      />

      <div className="mt-6 flex flex-col gap-4">
        {sortedEvents.map((event) => {
          const eventDate = new Date(event.date)

          return (
            <Card
              key={event.id}
              className="p-5"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[event.type]}`}
                    >
                      {event.type}
                    </span>

                    {event.globalPinned && (
                      <span className="text-text-muted text-xs">
                        • Pinned for everyone
                      </span>
                    )}
                  </div>

                  <p className="text-text mt-1.5 text-base font-semibold">
                    {event.title}
                  </p>

                  {event.description && (
                    <p className="text-text-muted mt-1 text-sm">
                      {event.description}
                    </p>
                  )}

                  <div className="text-text-muted mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span>
                      {eventDate.toLocaleDateString(
                        'en-GB',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        },
                      )}
                    </span>

                    <span>{event.time}</span>

                    <span className="flex items-center gap-1">
                      <MapPin
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      {event.location}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {/* Global pin */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleGlobalPin(event.id)
                    }
                    aria-label={
                      event.globalPinned
                        ? 'Unpin event globally'
                        : 'Pin event globally'
                    }
                    title={
                      event.globalPinned
                        ? 'Unpin globally'
                        : 'Pin globally'
                    }
                    className="text-text-muted hover:bg-surface-sunken hover:text-brand rounded-lg p-2 transition"
                  >
                    <Pin
                      className="size-4"
                      fill={
                        event.globalPinned
                          ? 'currentColor'
                          : 'none'
                      }
                      aria-hidden="true"
                    />
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(event)
                    }
                    aria-label="Edit event"
                    title="Edit"
                    className="text-text-muted hover:bg-surface-sunken hover:text-brand rounded-lg p-2 transition"
                  >
                    <Edit
                      className="size-4"
                      aria-hidden="true"
                    />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(event)
                    }
                    aria-label="Delete event"
                    title="Delete"
                    className="text-text-muted hover:bg-surface-sunken hover:text-negative rounded-lg p-2 transition"
                  >
                    <Trash2
                      className="size-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </Card>
          )
        })}

        {sortedEvents.length === 0 && (
          <Card className="p-5">
            <p className="text-text-muted text-sm">
              No events have been created yet.
            </p>
          </Card>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingEvent
            ? 'Edit Event'
            : 'Create Event'
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button onClick={handleSave}>
              {editingEvent
                ? 'Save Changes'
                : 'Create Event'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Event title"
            value={form.title}
            onChange={(event) =>
              updateForm(
                'title',
                event.target.value,
              )
            }
            placeholder="e.g. Financial Literacy Session"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-text text-sm font-medium">
                Event type
              </span>

              <select
                value={form.type}
                onChange={(event) =>
                  updateForm(
                    'type',
                    event.target.value,
                  )
                }
                className="border-border bg-surface text-text focus:border-brand focus:ring-brand rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              >
                {EVENT_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(event) =>
                updateForm(
                  'date',
                  event.target.value,
                )
              }
            />
          </div>

          <Input
            label="Time"
            type="time"
            value={form.time}
            onChange={(event) =>
              updateForm(
                'time',
                event.target.value,
              )
            }
          />

          <Input
            label="Location"
            value={form.location}
            onChange={(event) =>
              updateForm(
                'location',
                event.target.value,
              )
            }
            placeholder="e.g. Kinondoni Community Hall"
          />

          <label className="flex flex-col gap-1.5">
            <span className="text-text text-sm font-medium">
              Description
            </span>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateForm(
                  'description',
                  event.target.value,
                )
              }
              placeholder="Describe the event..."
              rows={4}
              className="border-border bg-surface text-text placeholder:text-text-muted focus:border-brand focus:ring-brand resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
            />
          </label>
        </div>
      </Modal>
    </div>
  )
}
