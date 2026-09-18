import { BookOpen, CalendarClock, Users, Vote } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { leaders, electionPositions, meetings } from '@/data/governance'
import { formatDate } from '@/utils/date'

const LINKS = [
  {
    to: '/governance/constitution',
    icon: BookOpen,
    title: 'Constitution',
    description: 'The rules that govern the cooperative.',
  },
  {
    to: '/governance/leaders',
    icon: Users,
    title: 'Leaders',
    description: 'Executive and committee members.',
  },
  {
    to: '/governance/meetings',
    icon: CalendarClock,
    title: 'Meetings',
    description: 'Upcoming and past meetings, minutes.',
  },
  {
    to: '/governance/elections',
    icon: Vote,
    title: 'Elections',
    description: 'Vote for cooperative leadership.',
  },
]

export function GovernancePage() {
  const navigate = useNavigate()
  const nextMeeting = meetings.find((meeting) => meeting.status === 'UPCOMING')
  const openElections = electionPositions.filter(
    (position) => position.status === 'OPEN',
  )

  return (
    <div>
      <PageHeader
        title="Governance"
        description="How Furaha na Huzuni Cooperative is led and governed."
        breadcrumbs={[{ label: 'Governance' }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {LINKS.map((link) => (
          <button
            key={link.to}
            type="button"
            onClick={() => navigate(link.to)}
            className="text-left"
          >
            <Card className="hover:bg-surface-hover p-5 transition-colors">
              <span className="bg-brand-soft text-brand-strong flex size-10 items-center justify-center rounded-xl">
                <link.icon className="size-5" aria-hidden="true" />
              </span>
              <p className="text-text mt-3 text-sm font-semibold">
                {link.title}
              </p>
              <p className="text-text-muted mt-1 text-xs">{link.description}</p>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <p className="text-text mb-3 text-sm font-semibold">Leadership</p>
          <div className="flex flex-col gap-3">
            {leaders.slice(0, 4).map((leader) => (
              <div
                key={leader.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-text text-sm font-medium">{leader.name}</p>
                  <p className="text-text-muted text-xs">{leader.committee}</p>
                </div>
                <span className="text-brand-strong text-xs font-medium">
                  {leader.position}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-text mb-3 text-sm font-semibold">
            What's happening
          </p>
          {nextMeeting && (
            <div className="bg-surface-sunken mb-4 rounded-xl p-3">
              <p className="text-text-muted text-xs">Next meeting</p>
              <p className="text-text text-sm font-semibold">
                {nextMeeting.title}
              </p>
              <p className="text-text-muted text-xs">
                {formatDate(nextMeeting.date)} · {nextMeeting.location}
              </p>
            </div>
          )}
          {openElections.length > 0 && (
            <div className="bg-accent-soft rounded-xl p-3">
              <p className="text-text-muted text-xs">Open elections</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {openElections.map((position) => (
                  <span
                    key={position.id}
                    className="bg-surface text-text rounded-full px-2.5 py-1 text-xs font-medium"
                  >
                    {position.title}
                  </span>
                ))}
              </div>
              <p className="mt-2">
                <StatusBadge status="OPEN" />
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
