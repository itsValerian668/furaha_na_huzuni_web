import { useState } from 'react'
import type { FormEvent } from 'react'
import { Edit, Pin, Plus, Trash2 } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useMeetingsStore } from '@/stores/meetings.store'
import type { Meeting } from '@/types/coop'
import { formatDate } from '@/utils/date'

const MEETING_TYPES: Meeting['type'][] = [
  'AGM',
  'Committee',
  'Emergency',
  'Regular',
]

export function AdminMeetingsPage() {
  const {
    meetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    toggleGlobalPin,
  } = useMeetingsStore()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [type, setType] = useState<Meeting['type']>('Regular')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [agenda, setAgenda] = useState('')

  function resetForm() {
    setTitle('')
    setType('Regular')
    setDate('')
    setLocation('')
    setAgenda('')
    setEditingId(null)
    setShowForm(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      !title.trim() ||
      !date ||
      !location.trim() ||
      !agenda.trim()
    ) {
      return
    }

    const meetingData = {
      title: title.trim(),
      type,
      date,
      location: location.trim(),
      status: 'UPCOMING' as const,
      minutesAvailable: false,
      agenda: agenda
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    if (editingId) {
      updateMeeting(editingId, meetingData)
    } else {
      addMeeting({
        id: `MT-${Date.now()}`,
        ...meetingData,
        globalPinned: false,
        personalPinnedBy: [],
      })
    }

    resetForm()
  }

  function handleEdit(meeting: Meeting) {
    setEditingId(meeting.id)
    setTitle(meeting.title)
    setType(meeting.type)
    setDate(meeting.date)
    setLocation(meeting.location)
    setAgenda(meeting.agenda.join('\n'))
    setShowForm(true)
  }

  function handleDelete(meeting: Meeting) {
    const confirmed = window.confirm(
      `Delete "${meeting.title}"?`,
    )

    if (confirmed) {
      deleteMeeting(meeting.id)
    }
  }

  const upcomingMeetings = meetings
    .filter((meeting) => meeting.status === 'UPCOMING')
    .sort(
      (a, b) =>
        Number(Boolean(b.globalPinned)) -
        Number(Boolean(a.globalPinned)),
    )

  const pastMeetings = meetings
    .filter((meeting) => meeting.status === 'PAST')
    .sort(
      (a, b) =>
        Number(Boolean(b.globalPinned)) -
        Number(Boolean(a.globalPinned)),
    )

  function MeetingActions({ meeting }: { meeting: Meeting }) {
    return (
      <div className="flex shrink-0 items-start gap-1">
        <button
          type="button"
          onClick={() => toggleGlobalPin(meeting.id)}
          aria-label={
            meeting.globalPinned
              ? 'Unpin meeting globally'
              : 'Pin meeting globally'
          }
          title={
            meeting.globalPinned
              ? 'Unpin globally'
              : 'Pin globally'
          }
          className="text-text-muted hover:bg-surface-sunken hover:text-brand rounded-lg p-2 transition"
        >
          <Pin
            size={18}
            fill={
              meeting.globalPinned
                ? 'currentColor'
                : 'none'
            }
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={() => handleEdit(meeting)}
          aria-label="Edit meeting"
          title="Edit"
          className="text-text-muted hover:bg-surface-sunken hover:text-brand rounded-lg p-2 transition"
        >
          <Edit size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => handleDelete(meeting)}
          aria-label="Delete meeting"
          title="Delete"
          className="text-text-muted hover:bg-surface-sunken hover:text-negative rounded-lg p-2 transition"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Meeting Management"
        description="Create, edit, and manage cooperative meetings."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Meeting Management' },
        ]}
      />

      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          <Plus size={18} />
          Add Meeting
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 p-5">
          <div className="mb-5">
            <h2 className="text-text text-base font-semibold">
              {editingId ? 'Edit Meeting' : 'Add Meeting'}
            </h2>

            <p className="text-text-muted mt-1 text-sm">
              Enter the meeting details and agenda.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <Input
              label="Meeting Title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Annual General Meeting 2026"
              required
            />

            <div>
              <label className="text-text mb-1.5 block text-sm font-medium">
                Meeting Type
              </label>

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value as Meeting['type'],
                  )
                }
                className="border-border bg-surface text-text focus:border-brand w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
              >
                {MEETING_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
              required
            />

            <Input
              label="Location"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="Enter meeting location"
              required
            />

            <div className="md:col-span-2">
              <label className="text-text mb-1.5 block text-sm font-medium">
                Agenda
              </label>

              <textarea
                value={agenda}
                onChange={(event) =>
                  setAgenda(event.target.value)
                }
                placeholder="Enter one agenda item per line"
                rows={5}
                required
                className="border-border bg-surface text-text focus:border-brand w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              <Button type="submit">
                {editingId ? 'Save Changes' : 'Add Meeting'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-text mb-3 text-sm font-semibold">
            Upcoming Meetings
          </h2>

          <div className="flex flex-col gap-4">
            {upcomingMeetings.map((meeting) => (
              <Card key={meeting.id} className="p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-brand-strong text-xs font-semibold uppercase">
                        {meeting.type}
                      </p>

                      {meeting.globalPinned && (
                        <span className="text-text-muted text-xs">
                          • Globally pinned
                        </span>
                      )}
                    </div>

                    <h3 className="text-text mt-1 text-base font-semibold">
                      {meeting.title}
                    </h3>

                    <p className="text-text-muted mt-1 text-sm">
                      {formatDate(meeting.date)} ·{' '}
                      {meeting.location}
                    </p>

                    <ul className="text-text-muted mt-3 list-inside list-disc text-sm">
                      {meeting.agenda.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <MeetingActions meeting={meeting} />
                </div>
              </Card>
            ))}

            {upcomingMeetings.length === 0 && (
              <Card className="p-5">
                <p className="text-text-muted text-sm">
                  No upcoming meetings.
                </p>
              </Card>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-text mb-3 text-sm font-semibold">
            Past Meetings
          </h2>

          <div className="flex flex-col gap-4">
            {pastMeetings.map((meeting) => (
              <Card key={meeting.id} className="p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-brand-strong text-xs font-semibold uppercase">
                        {meeting.type}
                      </p>

                      {meeting.globalPinned && (
                        <span className="text-text-muted text-xs">
                          • Globally pinned
                        </span>
                      )}
                    </div>

                    <h3 className="text-text mt-1 text-base font-semibold">
                      {meeting.title}
                    </h3>

                    <p className="text-text-muted mt-1 text-sm">
                      {formatDate(meeting.date)} ·{' '}
                      {meeting.location}
                    </p>

                    {meeting.attendance !== undefined && (
                      <p className="text-text-muted mt-2 text-xs">
                        Attendance: {meeting.attendance}
                      </p>
                    )}
                  </div>

                  <MeetingActions meeting={meeting} />
                </div>
              </Card>
            ))}

            {pastMeetings.length === 0 && (
              <Card className="p-5">
                <p className="text-text-muted text-sm">
                  No past meetings.
                </p>
              </Card>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}