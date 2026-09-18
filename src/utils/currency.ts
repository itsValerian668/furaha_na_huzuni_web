const formatter = new Intl.NumberFormat('en-TZ', {
  maximumFractionDigits: 0,
})

/** Formats a numeric amount as Tanzanian Shillings, e.g. formatCurrency(2450000) -> "TSh 2,450,000". */
export function formatCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : ''
  return `${sign}TSh ${formatter.format(Math.abs(amount))}`
}

/** Compact form for dense UI (cards, chart axes), e.g. formatCurrencyCompact(482600000) -> "TSh 482.6M". */
export function formatCurrencyCompact(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''
  if (abs >= 1_000_000_000)
    return `${sign}TSh ${(abs / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000) return `${sign}TSh ${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}TSh ${(abs / 1_000).toFixed(0)}K`
  return formatCurrency(amount)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-TZ').format(value)
}

export function formatPercent(
  value: number,
  options?: { signed?: boolean },
): string {
  const sign = options?.signed && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}
