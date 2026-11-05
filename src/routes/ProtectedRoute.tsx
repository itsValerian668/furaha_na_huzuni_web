import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useActiveRole } from '@/hooks/useActiveRole'
import { useIsAuthenticated } from '@/stores/auth.store'
import type { Role } from '@/types/coop'

interface ProtectedRouteProps {
  allowedRoles?: Role[]
}

/** Guards nested routes behind authentication and optional role authorization. */
export function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated()
  const activeRole = useActiveRole()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}