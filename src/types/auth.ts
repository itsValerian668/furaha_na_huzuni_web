import type { Role } from '@/types/coop'

export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  role: Role
  memberNumber: string
  avatarColor: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

/**
 * Assumed shape of `POST /api/auth/login` and `POST /api/auth/register`.
 * Adjust once the real Laravel contract is known — e.g. if Sanctum's cookie
 * flow is used instead of a bearer token, `token` may not be present at all.
 */
export interface AuthResponse {
  user: User
  token: string
}
