/** 0 (empty) to 4 (long + mixed case + digit + symbol). A UX hint — Zod's min-length rule is the actual requirement. */
function getStrength(password: string): number {
  if (!password) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const SEGMENT_COLORS = ['#c9b98e', '#c49b5a', '#147763', '#0d6654']

export function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = getStrength(password)

  return (
    <div className="password-strength">
      {SEGMENT_COLORS.map((color, index) => (
        <span
          key={color}
          style={index < strength ? { background: color } : undefined}
        />
      ))}
      <small>Use 8 characters or more.</small>
    </div>
  )
}
