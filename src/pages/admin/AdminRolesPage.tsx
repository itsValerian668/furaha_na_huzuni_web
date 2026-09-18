import { Check } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { toast } from '@/stores/toast.store'
import { ROLES, ROLE_LABELS, type Role } from '@/types/coop'
import { cn } from '@/utils/cn'

const PERMISSION_GROUPS = [
  'Members',
  'Savings',
  'Shares',
  'Loans',
  'Dividends',
  'Welfare',
  'Finance',
  'Reports',
  'Governance',
  'System',
] as const

type PermissionGroup = (typeof PERMISSION_GROUPS)[number]

const DEFAULT_ACCESS: Record<Role, PermissionGroup[]> = {
  MEMBER: ['Savings', 'Shares', 'Loans', 'Dividends', 'Welfare', 'Governance'],
  LOAN_OFFICER: [
    'Savings',
    'Shares',
    'Loans',
    'Dividends',
    'Welfare',
    'Governance',
    'Reports',
    'Members',
  ],
  FINANCE_OFFICER: [
    'Savings',
    'Shares',
    'Loans',
    'Dividends',
    'Welfare',
    'Governance',
    'Reports',
    'Members',
    'Finance',
  ],
  COOPERATIVE_LEADER: [
    'Savings',
    'Shares',
    'Loans',
    'Dividends',
    'Welfare',
    'Governance',
    'Reports',
    'Members',
    'Finance',
  ],
  ADMIN: [...PERMISSION_GROUPS],
  SUPER_ADMIN: [...PERMISSION_GROUPS],
}

function buildInitialMatrix(): Record<Role, Set<PermissionGroup>> {
  return Object.fromEntries(
    ROLES.map((role) => [role, new Set(DEFAULT_ACCESS[role])]),
  ) as Record<Role, Set<PermissionGroup>>
}

export function AdminRolesPage() {
  const [matrix, setMatrix] = useState(buildInitialMatrix)

  const toggle = (role: Role, group: PermissionGroup) => {
    if (role === 'SUPER_ADMIN') return
    setMatrix((current) => {
      const next = { ...current, [role]: new Set(current[role]) }
      if (next[role].has(group)) {
        next[role].delete(group)
      } else {
        next[role].add(group)
      }
      return next
    })
    toast(`${ROLE_LABELS[role]} permissions updated for ${group}.`)
  }

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Define what each cooperative role can access."
        breadcrumbs={[
          { label: 'Administration', to: '/admin' },
          { label: 'Roles & Permissions' },
        ]}
      />

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="border-border bg-surface-sunken/60 border-b">
              <th className="text-text-muted px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase">
                Permission Group
              </th>
              {ROLES.map((role) => (
                <th
                  key={role}
                  className="text-text-muted px-4 py-3 text-center text-xs font-semibold tracking-wide uppercase"
                >
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSION_GROUPS.map((group) => (
              <tr
                key={group}
                className="border-border border-b last:border-b-0"
              >
                <td className="text-text px-4 py-3 font-medium">{group}</td>
                {ROLES.map((role) => {
                  const enabled = matrix[role].has(group)
                  return (
                    <td key={role} className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggle(role, group)}
                        disabled={role === 'SUPER_ADMIN'}
                        aria-label={`${enabled ? 'Revoke' : 'Grant'} ${group} access for ${ROLE_LABELS[role]}`}
                        className={cn(
                          'inline-flex size-6 items-center justify-center rounded-md border transition-colors',
                          enabled
                            ? 'border-brand bg-brand text-on-brand'
                            : 'border-border bg-surface hover:border-border-strong text-transparent',
                          role === 'SUPER_ADMIN' &&
                            'cursor-not-allowed opacity-70',
                        )}
                      >
                        <Check className="size-3.5" aria-hidden="true" />
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-text-muted mt-3 text-xs">
        Super Admin always has full access and cannot be restricted.
      </p>
    </div>
  )
}
