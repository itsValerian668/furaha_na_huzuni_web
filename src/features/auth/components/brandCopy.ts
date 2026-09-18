export type AuthMode = 'login' | 'signup'

export interface BrandCopy {
  kicker: string
  heading: string
  accent: string
  body: string
}

/** Shared between BrandPanel and AuthBlade so the blade's preview matches the real panel exactly once it settles. */
export const BRAND_COPY: Record<AuthMode, BrandCopy> = {
  login: {
    kicker: 'MEMBER OWNED · COMMUNITY DRIVEN',
    heading: 'Together we',
    accent: 'build wealth.',
    body: 'Save together, support one another, access affordable credit and share the value we create.',
  },
  signup: {
    kicker: 'JOIN THE COOPERATIVE',
    heading: 'Start your',
    accent: 'savings journey.',
    body: 'One membership for savings, shares, affordable loans, dividends and mutual support.',
  },
}
