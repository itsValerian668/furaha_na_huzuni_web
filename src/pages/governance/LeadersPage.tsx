import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { useLeadersStore } from '@/stores/leaders.store'
import { formatDate } from '@/utils/date'

const COMMITTEES = [
  'Executive',
  'Welfare Committee',
  'Supervisory Committee',
] as const

export function LeadersPage() {
  const leaders = useLeadersStore((state) => state.leaders)

  const activeLeaders = leaders.filter(
    (leader) => leader.active,
  )

  return (
    <div>
      <PageHeader
        title="Cooperative Leaders"
        description="View the current leaders of the cooperative."
        breadcrumbs={[
          { label: 'Governance', to: '/governance' },
          { label: 'Leaders' },
        ]}
      />

      <div className="flex flex-col gap-8">
        {COMMITTEES.map((committee) => {
          const committeeLeaders = activeLeaders.filter(
            (leader) => leader.committee === committee,
          )

          if (committeeLeaders.length === 0) return null

          return (
            <div key={committee}>
              <p className="text-text mb-3 text-sm font-semibold">
                {committee}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {committeeLeaders.map((leader) => (
                  <Card
                    key={leader.id}
                    className="flex items-center gap-3 p-4"
                  >
                    <MemberAvatar
                      name={leader.name}
                      color={leader.avatarColor}
                      size={44}
                    />

                    <div className="min-w-0">
                      <p className="text-text truncate text-sm font-semibold">
                        {leader.name}
                      </p>

                      <p className="text-brand-strong text-xs font-medium">
                        {leader.position}
                      </p>

                      <p className="text-text-muted text-xs">
                        Since {formatDate(leader.since)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
