export function ProgressRing({
  value,
  max = 100,
  size = 96,
  strokeWidth = 10,
  label,
}: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-surface-sunken"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-brand transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="text-text absolute text-lg font-bold">
        {Math.round(percent)}%
      </span>
    </div>
  )
}
