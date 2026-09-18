import { useMutation } from '@tanstack/react-query'

import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import type { RegisterPayload } from '@/types/auth'

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setSession(data.user, data.token)
    },
  })
}
