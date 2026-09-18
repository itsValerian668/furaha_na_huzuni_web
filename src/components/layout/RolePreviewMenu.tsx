import { Check, SwatchBook } from 'lucide-react'

import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useActiveRole } from '@/hooks/useActiveRole'
import { useRoleStore } from '@/stores/role.store'
import { toast } from '@/stores/toast.store'
import { ROLE_LABELS, ROLES } from '@/types/coop'
import { cn } from '@/utils/cn'

/**
 * "Demo / Preview Role" — lets anyone touring the app switch which role's
 * navigation, dashboard and permissions they see, since this build phase
 * has no real authorization backend. See docs/AUTH.md.
 */
export function RolePreviewMenu() {
  const activeRole = useActiveRole()
  const setPreviewRole = useRoleStore((state) => state.setPreviewRole)

  return (
    <Dropdown
      align="end"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="text-text hover:bg-surface-hover flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
        >
          <SwatchBook className="text-text-muted size-4" aria-hidden="true" />
          <span className="flex-1">Demo / Preview Role</span>
          <span className="bg-brand-soft text-brand-strong rounded-full px-2 py-0.5 text-xs font-semibold">
            {ROLE_LABELS[activeRole]}
          </span>
        </button>
      )}
    >
      {(close) => (
        <>
          <p className="text-text-muted px-3 pt-1.5 pb-1 text-[11px] font-semibold tracking-wide uppercase">
            Preview the app as
          </p>
          {ROLES.map((role) => (
            <DropdownItem
              key={role}
              icon={
                <span
                  className={cn(
                    'flex size-4 items-center justify-center',
                    role !== activeRole && 'opacity-0',
                  )}
                >
                  <Check className="text-brand size-3.5" aria-hidden="true" />
                </span>
              }
              onClick={() => {
                setPreviewRole(role === 'MEMBER' ? null : role)
                toast(`Now previewing as ${ROLE_LABELS[role]}`, 'info')
                close()
              }}
            >
              {ROLE_LABELS[role]}
            </DropdownItem>
          ))}
        </>
      )}
    </Dropdown>
  )
}
