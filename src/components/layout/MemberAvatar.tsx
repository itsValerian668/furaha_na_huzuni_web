import { cn } from '@/utils/cn'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

export function MemberAvatar({
  name,
  color = 'var(--brand)',
  size = 36,
  className,
}: {
  name: string
  color?: string
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.4,
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
