import { ChevronDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { RolePreviewMenu } from '@/components/layout/RolePreviewMenu'
import { MemberAvatar } from '@/components/layout/MemberAvatar'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useActiveRole } from '@/hooks/useActiveRole'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useAuthStore } from '@/stores/auth.store'
import { ROLE_LABELS } from '@/types/coop'

export function UserMenu() {
  const user = useAuthStore((state) => state.user)
  const activeRole = useActiveRole()
  const logout = useLogout()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <Dropdown
      align="end"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="hover:bg-surface-hover flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors"
        >
          <MemberAvatar name={user.name} color={user.avatarColor} size={32} />
          <span className="hidden text-left sm:block">
            <span className="text-text block text-sm leading-tight font-semibold">
              {user.name}
            </span>
            <span className="text-text-muted block text-xs leading-tight">
              {ROLE_LABELS[activeRole]}
            </span>
          </span>
          <ChevronDown
            className="text-text-muted hidden size-3.5 sm:block"
            aria-hidden="true"
          />
        </button>
      )}
    >
      {(close) => (
        <div className="w-64">
          <div className="flex items-center gap-2.5 px-3 pt-1.5 pb-2">
            <MemberAvatar name={user.name} color={user.avatarColor} size={36} />
            <div className="min-w-0">
              <p className="text-text truncate text-sm font-semibold">
                {user.name}
              </p>
              <p className="text-text-muted truncate text-xs">{user.email}</p>
            </div>
          </div>
          <div className="bg-border my-1 h-px" />
          <DropdownItem
            icon={<User className="size-4" aria-hidden="true" />}
            onClick={() => {
              navigate('/profile')
              close()
            }}
          >
            My Profile
          </DropdownItem>
          <div className="bg-border my-1 h-px" />
          <RolePreviewMenu />
          <div className="bg-border my-1 h-px" />
          <DropdownItem
            danger
            icon={<LogOut className="size-4" aria-hidden="true" />}
            onClick={() => {
              logout.mutate()
              close()
            }}
          >
            Log out
          </DropdownItem>
        </div>
      )}
    </Dropdown>
  )
}
