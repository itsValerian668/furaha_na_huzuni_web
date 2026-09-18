import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearSession()
      queryClient.clear()
    },
  })
}
