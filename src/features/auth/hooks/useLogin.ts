import { useMutation } from '@tanstack/react-query'

import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginCredentials } from '@/types/auth'

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      setSession(data.user, data.token)
    },
  })
}
