import { Outlet } from 'react-router-dom'

/** Pass-through shell for unauthenticated routes — each auth page owns its own full-page layout (background, centering, branding). */
export function AuthLayout() {
  return <Outlet />
}
