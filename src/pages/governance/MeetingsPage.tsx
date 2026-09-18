import { CalendarDays, FileText, MapPin, Users } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { meetings } from '@/data/governance'
import { toast } from '@/stores/toast.store'
import { formatDate } from '@/utils/date'

export function MeetingsPage() {
  const [tab, setTab] = useState('upcoming')
  const filtered = meetings.filter((meeting) =>
    tab === 'upcoming'
      ? meeting.status === 'UPCOMING'
      : meeting.status === 'PAST',
  )

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
            count: meetings.filter((m) => m.status === 'UPCOMING').length,
          },
          {
            value: 'past',
            label: 'Past',
            count: meetings.filter((m) => m.status === 'PAST').length,
          },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="mt-6 flex flex-col gap-4">
        {filtered.map((meeting) => (
          <Card key={meeting.id} className="p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-brand-strong text-xs font-semibold tracking-wide uppercase">
                  {meeting.type}
                </p>
                <p className="text-text mt-1 text-base font-semibold">
                  {meeting.title}
                </p>
                <div className="text-text-muted mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3.5" aria-hidden="true" />{' '}
                    {formatDate(meeting.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden="true" />{' '}
                    {meeting.location}
                  </span>
                  {meeting.attendance !== undefined && (
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" aria-hidden="true" />{' '}
                      {meeting.attendance} attended
                    </span>
                  )}
                </div>
              </div>
              {meeting.minutesAvailable && (
                <Button
                  variant="secondary"
                  onClick={() => toast('Meeting minutes downloaded.')}
                >
                  <FileText className="size-4" aria-hidden="true" /> Minutes
                </Button>
              )}
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
        ))}
      </div>
    </div>
  )
}
