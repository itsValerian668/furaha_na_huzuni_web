import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, User } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { AuthField } from '@/features/auth/components/AuthField'
import { AuthPasswordField } from '@/features/auth/components/AuthPasswordField'
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter'
import { useRegister } from '@/features/auth/hooks/useRegister'
import { getApiErrorMessage, isValidationError } from '@/services/api'

const signupSchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(8, 'Use at least 8 characters'),
})

type SignupFormValues = z.infer<typeof signupSchema>

export function SignupForm({
  onSwitchToLogin,
  switching,
}: {
  onSwitchToLogin: () => void
  switching: boolean
}) {
  const navigate = useNavigate()
  const signup = useRegister()

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) })

  const password = useWatch({ control, name: 'password', defaultValue: '' })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signup.mutateAsync(values)
      navigate('/', { replace: true })
    } catch (error) {
      if (isValidationError(error)) {
        for (const [field, messages] of Object.entries(
          error.response?.data.errors ?? {},
        )) {
          setError(field as keyof SignupFormValues, { message: messages[0] })
        }
        return
      }
      // Non-field error (email already taken, network failure, etc.) surfaces via signup.error below.
    }
  })

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <div className="form-heading">
        <span className="form-kicker">JOIN THE COOPERATIVE</span>
        <h2>Create your account</h2>
        <p>
          Become a member and start saving, borrowing and building together.
        </p>
      </div>

      {signup.isError && !isValidationError(signup.error) && (
        <p className="form-error">{getApiErrorMessage(signup.error)}</p>
      )}

      <AuthField
        label="Full name"
        placeholder="Your full name"
        autoComplete="name"
        required
        icon={<User aria-hidden="true" />}
        error={errors.name?.message}
        {...register('name')}
      />
      <AuthField
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
        icon={<Mail aria-hidden="true" />}
        error={errors.email?.message}
        {...register('email')}
      />
      <AuthPasswordField
        label="Password"
        placeholder="Create a password"
        autoComplete="new-password"
        required
        error={errors.password?.message}
        {...register('password')}
      />
      {!errors.password && <PasswordStrengthMeter password={password} />}

      <button
        type="submit"
        className="submit-button"
        disabled={signup.isPending}
      >
        {signup.isPending ? 'Creating account…' : 'Create account'}
      </button>

      <p className="switch-text">
        Already a member?{' '}
        <button
          type="button"
          className="switch-button"
          onClick={onSwitchToLogin}
          disabled={switching}
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
