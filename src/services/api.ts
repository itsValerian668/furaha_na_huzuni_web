import type { AxiosError } from 'axios'
import axios, { type InternalAxiosRequestConfig } from 'axios'

import { env } from '@/config/env'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Centralized Axios instance. All backend communication must go through this
 * client — never instantiate axios or call fetch() directly in components.
 */
export const api = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true, // required for Laravel Sanctum's cookie-based SPA auth
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession()
    }
    return Promise.reject(error)
  },
)

/** Type guard for Laravel's 422 validation error envelope. */
export function isValidationError(
  error: unknown,
): error is AxiosError<{ message: string; errors: Record<string, string[]> }> {
  return axios.isAxiosError(error) && error.response?.status === 422
}

/** Best-effort extraction of a human-readable message from any API error. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)
      ?.message
    if (message) return message
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to reach the server. Check your connection and try again.'
    }
  }
  return 'Something went wrong. Please try again.'
}
