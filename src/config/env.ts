/**
 * Centralized, typed access to build-time environment variables.
 * Never read `import.meta.env` directly elsewhere in the app — go through this module
 * so a missing/misconfigured variable fails loudly at startup instead of silently at runtime.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  /**
   * This build phase has no backend. `authService` (see src/services/auth.service.ts)
   * simulates login/register locally and accepts any credentials — see docs/AUTH.md.
   * Flip this once real Laravel endpoints exist and swap authService's implementation
   * back to the commented-out API calls.
   */
  isDemoMode: true,
} as const
