import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  User,
} from '@/types/auth'

/**
 * DEMO-MODE AUTHENTICATION — see docs/AUTH.md.
 *
 * This build phase has no backend. Any credentials succeed: there is no
 * validation, no token issuance, and no session persisted server-side. A
 * fabricated user + token are returned so the rest of the app (stores,
 * hooks, route guards) works exactly as it would against a real API.
 *
 * To connect a real Laravel backend later, replace the two functions below
 * with the commented calls beneath them — no other file needs to change,
 * since components only ever talk to `useLogin`/`useRegister`, never to
 * this module or `axios` directly.
 */

const AVATAR_COLORS = ['#0B6655', '#159A78', '#C9A45C', '#07352D']

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] || 'Member'
  return (
    local
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
      .trim() || 'Member'
  )
}

function buildDemoUser(email: string, name?: string): User {
  return {
    id: 1,
    name: name?.trim() || nameFromEmail(email),
    email,
    roles: ['MEMBER'],
    role: 'MEMBER',
    memberNumber: 'FH-2020-0001',
    avatarColor: AVATAR_COLORS[email.length % AVATAR_COLORS.length]!,
  }
}

function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return delay({
      user: buildDemoUser(credentials.email),
      token: `demo-token-${Date.now()}`,
    })

    // --- Real API (re-enable once a backend exists) ---
    // const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    // return data
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    return delay({
      user: buildDemoUser(payload.email, payload.name),
      token: `demo-token-${Date.now()}`,
    })

    // --- Real API (re-enable once a backend exists) ---
    // const { data } = await api.post<AuthResponse>('/auth/register', payload)
    // return data
  },

  async logout(): Promise<void> {
    return delay(undefined, 150)

    // --- Real API (re-enable once a backend exists) ---
    // await api.post('/auth/logout')
  },

  async getCurrentUser(): Promise<User> {
    return delay(buildDemoUser('member@furahanahuzuni.coop'))

    // --- Real API (re-enable once a backend exists) ---
    // const { data } = await api.get<{ data: User }>('/auth/me')
    // return data.data
  },
}
