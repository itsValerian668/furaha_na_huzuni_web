/** Joins class names, filtering out falsy values. Keep dependency-free until conflicts justify clsx/tailwind-merge. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ')
}
