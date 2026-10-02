import {
  CalendarDays,
  FileText,
  MapPin,
  Pin,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { useAuthStore } from '@/stores/auth.store'
import { useMeetingsStore } from '@/stores/meetings.store'
import { toast } from '@/stores/toast.store'
import { formatDate } from '@/utils/date'

export function MeetingsPage() {
  const [tab, setTab] = useState('upcoming')

  const meetings = useMeetingsStore(
    (state) => state.meetings,
  )

  const togglePersonalPin = useMeetingsStore(
    (state) => state.togglePersonalPin,
  )

  const userId = useAuthStore(
    (state) => state.user?.id,
  )

  const filtered = meetings
    .filter((meeting) =>
      tab === 'upcoming'
        ? meeting.status === 'UPCOMING'
        : meeting.status === 'PAST',
    )
    .sort((a, b) => {
      const aPinned =
        Boolean(a.globalPinned) ||
        (userId !== undefined &&
          (a.personalPinnedBy ?? []).includes(userId))

      const bPinned =
        Boolean(b.globalPinned) ||
        (userId !== undefined &&
          (b.personalPinnedBy ?? []).includes(userId))

      return Number(bPinned) - Number(aPinned)
    })

  function handlePersonalPin(meetingId: string) {
    if (userId === undefined) {
      toast('Please sign in to pin a meeting.')
      return
    }

    togglePersonalPin(meetingId, userId)
  }

  return (
    <div>
      <PageHeader
        title="Meetings"
        description="Cooperative meetings, agendas and minutes."
        breadcrumbs={[
          { label: 'Governance', to: '/governance' },
          { label: 'Meetings' },
        ]}
      />

      <Tabs
        items={[
          {
            value: 'upcoming',
            label: 'Upcoming',
            count: meetings.filter(
              (meeting) => meeting.status === 'UPCOMING',
            ).length,
          },
          {
            value: 'past',
            label: 'Past',
            count: meetings.filter(
              (meeting) => meeting.status === 'PAST',
            ).length,
          },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-6 flex flex-col gap-4">
        {filtered.map((meeting) => {
          const personallyPinned =
            userId !== undefined &&
            (meeting.personalPinnedBy ?? []).includes(userId)

          return (
            <Card
              key={meeting.id}
              className="p-5"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-brand-strong text-xs font-semibold tracking-wide uppercase">
                      {meeting.type}
                    </p>

                    {meeting.globalPinned && (
                      <span className="text-text-muted text-xs">
                        • Pinned for everyone
                      </span>
                    )}

                    {!meeting.globalPinned &&
                      personallyPinned && (
                        <span className="text-text-muted text-xs">
                          • Pinned by you
                        </span>
                      )}
                  </div>

                  <p className="text-text mt-1 text-base font-semibold">
                    {meeting.title}
                  </p>

                  <div className="text-text-muted mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="flex items-center gap-1">
                      <CalendarDays
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      {formatDate(meeting.date)}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      {meeting.location}
                    </span>

                    {meeting.attendance !== undefined && (
                      <span className="flex items-center gap-1">
                        <Users
                          className="size-3.5"
                          aria-hidden="true"
                        />
                        {meeting.attendance} attended
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      handlePersonalPin(meeting.id)
                    }
                    aria-label={
                      personallyPinned
                        ? 'Unpin meeting'
                        : 'Pin meeting'
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

                  {meeting.minutesAvailable && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        toast(
                          'Meeting minutes downloaded.',
                        )
                      }
                    >
                      <FileText
                        className="size-4"
                        aria-hidden="true"
                      />
                      Minutes
                    </Button>
                  )}
                </div>
              </div>

              <div className="border-border mt-4 border-t pt-3">
                <p className="text-text-muted mb-1.5 text-xs font-semibold uppercase">
                  Agenda
                </p>

                <ul className="text-text-muted marker:text-brand list-inside list-disc text-sm">
                  {meeting.agenda.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <Card className="p-5">
            <p className="text-text-muted text-sm">
              No {tab === 'upcoming' ? 'upcoming' : 'past'} meetings.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}