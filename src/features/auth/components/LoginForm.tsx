import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { AuthField } from '@/features/auth/components/AuthField'
import { AuthPasswordField } from '@/features/auth/components/AuthPasswordField'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { getApiErrorMessage, isValidationError } from '@/services/api'

const loginSchema = z.object({
  email: z.string().min(1, 'Enter your member ID or email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  onSwitchToSignup,
  switching,
}: {
  onSwitchToSignup: () => void
  switching: boolean
}) {
  const navigate = useNavigate()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values)
      navigate('/', { replace: true })
    } catch (error) {
      if (isValidationError(error)) {
        for (const [field, messages] of Object.entries(
          error.response?.data.errors ?? {},
        )) {
          setError(field as keyof LoginFormValues, { message: messages[0] })
        }
        return
      }
      // Non-field error (invalid credentials, network failure, etc.) surfaces via login.error below.
    }
  })

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="form-heading">
        <span className="form-kicker">MEMBER PORTAL</span>
        <h2>Welcome back.</h2>
        <p>Sign in to manage your savings, loans and cooperative account.</p>
      </div>

      {login.isError && !isValidationError(login.error) && (
        <p className="form-error">{getApiErrorMessage(login.error)}</p>
      )}

      <AuthField
        label="Member ID or Email"
        placeholder="FH-2020-0001 or you@example.com"
        autoComplete="username"
        required
        icon={<Mail aria-hidden="true" />}
        error={errors.email?.message}
        {...register('email')}
      />
      <AuthPasswordField
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        required
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="form-options">
        <label className="remember">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>
        {/* TODO: wire up once a /forgot-password flow and endpoint exist */}
        <button type="button" className="text-button">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={login.isPending}
      >
        {login.isPending ? 'Signing in…' : 'Sign in →'}
      </button>

      <p className="switch-text">
        New to the cooperative?{' '}
        <button
          type="button"
          className="switch-button"
          onClick={onSwitchToSignup}
          disabled={switching}
        >
          Create your account
        </button>
      </p>
    </form>
  )
}
