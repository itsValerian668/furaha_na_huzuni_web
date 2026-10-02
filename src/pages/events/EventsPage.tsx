import { Clock, MapPin, Pin, Plus } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/stores/auth.store'
import { useEventsStore } from '@/stores/events.store'
import { toast } from '@/stores/toast.store'
import type { Role } from '@/types/coop'

const TYPE_COLORS: Record<string, string> = {
  Meeting: 'bg-brand-soft text-brand-strong',
  Savings: 'bg-positive-soft text-positive',
  Training: 'bg-accent-soft text-accent',
  Community: 'bg-warning-soft text-warning',
  Election: 'bg-negative-soft text-negative',
}

const GLOBAL_PIN_ROLES: Role[] = [
  'COOPERATIVE_LEADER',
  'ADMIN',
  'SUPER_ADMIN',
]

export function EventsPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const events = useEventsStore(
    (state) => state.events,
  )

  const toggleGlobalPin = useEventsStore(
    (state) => state.toggleGlobalPin,
  )

  const togglePersonalPin = useEventsStore(
    (state) => state.togglePersonalPin,
  )

  const user = useAuthStore(
    (state) => state.user,
  )

  const canGlobalPin =
    user !== null &&
    GLOBAL_PIN_ROLES.includes(user.role)

  const sorted = [...events].sort((a, b) => {
    const aPersonalPinned =
      user !== null &&
      (a.personalPinnedBy ?? []).includes(user.id)

    const bPersonalPinned =
      user !== null &&
      (b.personalPinnedBy ?? []).includes(user.id)

    const aPinned =
      Boolean(a.globalPinned) ||
      aPersonalPinned

    const bPinned =
      Boolean(b.globalPinned) ||
      bPersonalPinned

    if (aPinned !== bPinned) {
      return Number(bPinned) - Number(aPinned)
    }

    return a.date.localeCompare(b.date)
  })

  function handlePersonalPin(eventId: string) {
    if (user === null) {
      toast('Please sign in to pin an event.')
      return
    }

    togglePersonalPin(eventId, user.id)
  }

  return (
    <div>
      <PageHeader
        title="Events"
        description="Cooperative meetings, trainings and community gatherings."
        breadcrumbs={[{ label: 'Events' }]}
        actions={
          canGlobalPin ? (
            <Button
              onClick={() => setModalOpen(true)}
            >
              <Plus
                className="size-4"
                aria-hidden="true"
              />
              Create Event
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-4">
        {sorted.map((event) => {
          const date = new Date(event.date)

          const personallyPinned =
            user !== null &&
            (event.personalPinnedBy ?? []).includes(
              user.id,
            )

          return (
            <Card
              key={event.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
            >
              <div className="bg-surface-sunken flex w-16 shrink-0 flex-col items-center rounded-xl py-2.5">
                <span className="text-text-muted text-xs font-semibold uppercase">
                  {date.toLocaleDateString('en-GB', {
                    month: 'short',
                  })}
                </span>

                <span className="text-text text-xl font-bold">
                  {date.getDate()}
                </span>
              </div>

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

                  {!event.globalPinned &&
                    personallyPinned && (
                      <span className="text-text-muted text-xs">
                        • Pinned by you
                      </span>
                    )}
                </div>

                <p className="text-text mt-1.5 text-sm font-semibold">
                  {event.title}
                </p>

                <p className="text-text-muted text-xs">
                  {event.description}
                </p>

                <div className="text-text-muted mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock
                      className="size-3.5"
                      aria-hidden="true"
                    />
                    {event.time}
                  </span>

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
                {/* Personal pin */}
                <button
                  type="button"
                  onClick={() =>
                    handlePersonalPin(event.id)
                  }
                  aria-label={
                    personallyPinned
                      ? 'Unpin event'
                      : 'Pin event'
                  }
                  title={
                    personallyPinned
                      ? 'Unpin'
                      : 'Pin for me'
                  }
                  className="text-text-muted hover:bg-surface-sunken hover:text-brand rounded-lg p-2 transition"
                >
                  <Pin
                    className="size-4"
                    fill={
                      personallyPinned
                        ? 'currentColor'
                        : 'none'
                    }
                    aria-hidden="true"
                  />
                </button>

                {/* Global pin */}
                {canGlobalPin && (
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
                )}

                <Button
                  variant="secondary"
                  onClick={() =>
                    toast(
                      `Added "${event.title}" to your calendar.`,
                    )
                  }
                >
                  Add to calendar
                </Button>
              </div>
            </Card>
          )
        })}

        {sorted.length === 0 && (
          <Card className="p-5">
            <p className="text-text-muted text-sm">
              No events available.
            </p>
          </Card>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create an event"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                setModalOpen(false)

                toast(
                  'Event created and published to members.',
                )
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
            <Input
              label="Date"
              type="date"
            />

            <Input
              label="Time"
              type="time"
            />
          </div>

          <Input
            label="Location"
            placeholder="e.g. Kinondoni Community Hall"
          />
        </div>
      </Modal>
    </div>
  )
}