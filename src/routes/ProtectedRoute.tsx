import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useIsAuthenticated } from '@/stores/auth.store'

/** Guards nested routes behind authentication, redirecting to /login and preserving the original destination. */
export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
