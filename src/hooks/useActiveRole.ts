import { useAuthStore } from '@/stores/auth.store'
import { useRoleStore } from '@/stores/role.store'
import { ADMIN_ROLES, type Role } from '@/types/coop'

/** The role driving navigation/permissions right now: the Demo/Preview Role override if set, else the signed-in user's own role. */
export function useActiveRole(): Role {
  const previewRole = useRoleStore((state) => state.previewRole)
  const userRole = useAuthStore((state) => state.user?.role)
  return previewRole ?? userRole ?? 'MEMBER'
}

export function useIsAdminRole(): boolean {
  const role = useActiveRole()
  return ADMIN_ROLES.includes(role)
}
