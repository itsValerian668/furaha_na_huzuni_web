import { useState } from 'react'
import type { FormEvent } from 'react'
import { Edit, Plus, Power } from 'lucide-react'

import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useLeadersStore } from '@/stores/leaders.store'
import { formatDate } from '@/utils/date'

const COMMITTEES = [
  'Executive',
  'Welfare Committee',
  'Supervisory Committee',
] as const

type Committee = (typeof COMMITTEES)[number]

export function AdminLeadersPage() {
  const {
    leaders,
    addLeader,
    updateLeader,
    toggleLeaderStatus,
  } = useLeadersStore()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [committee, setCommittee] =
    useState<Committee>('Executive')

  function resetForm() {
    setName('')
    setPosition('')
    setCommittee('Executive')
    setEditingId(null)
    setShowForm(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || !position.trim()) return

    if (editingId) {
      updateLeader(editingId, {
        name: name.trim(),
        position: position.trim(),
        committee,
      })
    } else {
      addLeader({
        id: `LD-${Date.now()}`,
        name: name.trim(),
        position: position.trim(),
        committee,
        since: new Date().toISOString().slice(0, 10),
        avatarColor: '#0B6655',
        active: true,
      })
    }

    resetForm()
  }

  function handleEdit(
    leader: (typeof leaders)[number],
  ) {
    setEditingId(leader.id)
    setName(leader.name)
    setPosition(leader.position)

    setCommittee(
      COMMITTEES.includes(leader.committee as Committee)
        ? (leader.committee as Committee)
        : 'Executive',
    )

    setShowForm(true)
  }

  const activeLeaders = leaders.filter(
    (leader) => leader.active,
  )

  const inactiveLeaders = leaders.filter(
    (leader) => !leader.active,
  )

  return (
    <div>
      <PageHeader
        title="Leader Management"
        description="Add, edit, and manage cooperative leaders and their roles."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Leader Management' },
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
          Add Leader
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 p-5">
          <div className="mb-5">
            <h2 className="text-text text-base font-semibold">
              {editingId ? 'Edit Leader' : 'Add Leader'}
            </h2>

            <p className="text-text-muted mt-1 text-sm">
              Enter the leader's name, position, and committee.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <Input
              label="Full Name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter full name"
              required
            />

            <Input
              label="Position"
              value={position}
              onChange={(event) =>
                setPosition(event.target.value)
              }
              placeholder="e.g. Chairperson"
              required
            />

            <div>
              <label className="text-text mb-1.5 block text-sm font-medium">
                Committee
              </label>

              <select
                value={committee}
                onChange={(event) =>
                  setCommittee(
                    event.target.value as Committee,
                  )
                }
                className="border-border bg-surface text-text focus:border-brand w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
              >
                {COMMITTEES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 md:col-span-3">
              <Button type="submit">
                {editingId ? 'Save Changes' : 'Add Leader'}
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
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
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
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(leader)}
                        className="text-text-muted hover:text-brand p-2"
                        title="Edit leader"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleLeaderStatus(leader.id)
                        }
                        className="text-text-muted hover:text-danger p-2"
                        title="Deactivate leader"
                      >
                        <Power size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {inactiveLeaders.length > 0 && (
        <Card className="mt-8 p-5">
          <h2 className="text-text mb-4 text-sm font-semibold">
            Inactive Leaders
          </h2>

          <div className="flex flex-col gap-3">
            {inactiveLeaders.map((leader) => (
              <div
                key={leader.id}
                className="border-border flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-text text-sm font-medium">
                    {leader.name}
                  </p>

                  <p className="text-text-muted text-xs">
                    {leader.position} · {leader.committee}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    toggleLeaderStatus(leader.id)
                  }
                >
                  Activate
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
