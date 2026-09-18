import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AuthPage } from '@/features/auth/pages/AuthPage'

function renderAuthPage() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <AuthPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AuthPage', () => {
  it('defaults to sign-in and can switch to sign-up and back', async () => {
    renderAuthPage()

    expect(
      screen.getByRole('heading', { name: 'Welcome back.' }),
    ).toBeInTheDocument()

    // Content swaps mid-way through the blade sweep (~430ms), not instantly
    // on click — "Create your account" is unambiguous pre-swap (only the
    // switch link uses that text; SignupForm hasn't mounted yet).
    await userEvent.click(
      screen.getByRole('button', { name: 'Create your account' }),
    )
    await screen.findByRole(
      'heading',
      { name: 'Create your account' },
      { timeout: 2000 },
    )

    // Now that LoginForm has unmounted, "Sign in" unambiguously refers to
    // the sign-up form's switch link. It stays disabled until the blade
    // fully resets (~900ms after the first click).
    const signInSwitchButton = screen.getByRole('button', { name: 'Sign in' })
    await waitFor(() => expect(signInSwitchButton).toBeEnabled(), {
      timeout: 2000,
    })

    await userEvent.click(signInSwitchButton)
    await screen.findByRole(
      'heading',
      { name: 'Welcome back.' },
      { timeout: 2000 },
    )
  }, 10000)
})
