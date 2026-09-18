# Authentication (demo mode)

This build phase ships a UI-only demo gateway, not real authentication —
there is no backend, no credential validation, and no session persisted
server-side. This is intentional for the current phase, not a shortcut.

## What "demo mode" means

- `src/services/auth.service.ts` fabricates a `User` + token from whatever
  email/password (or name/email/password) is submitted to `LoginForm` /
  `SignupForm`. **Any input succeeds.**
- `env.isDemoMode` (`src/config/env.ts`) marks this explicitly; there is no
  real/demo branching logic elsewhere — demo mode is the only mode right now.
- `src/services/api.ts` (the Axios instance) still exists and is fully
  wired — base URL, bearer token interceptor, 401 handling — but nothing
  currently calls it. It's dead code on purpose, kept ready for the real
  backend.

## Demo / Preview Role

Because there's no real authorization backend either, `src/stores/role.store.ts`
holds a `previewRole` override, independent of the (also fake) `user.role`
set at login. `src/hooks/useActiveRole.ts` resolves the role driving
navigation/permissions as `previewRole ?? user.role`. The switcher lives in
the user menu (`RolePreviewMenu`) — see section 3 of the product brief.

This means role-gated UI (the `Administration` sidebar group, admin routes,
etc.) is a **presentation-layer convenience for touring the app**, not a
security boundary. Nothing here should be mistaken for real authorization.

## Reconnecting a real backend later

1. In `auth.service.ts`, delete the mock branch in each function and
   uncomment the real Axios calls beneath it (`api.post('/auth/login', ...)`
   etc.) — the commented code already matches the shape `api.ts` and
   `types/auth.ts` expect.
2. In `config/env.ts`, drop `isDemoMode` (or flip it based on
   `import.meta.env.MODE`) and reinstate `requireEnv` around `VITE_API_URL`
   so a missing API URL fails loudly again.
3. `role.store.ts`'s `previewRole` should either be removed or restricted to
   non-production builds once `user.role` reflects a real, server-issued
   permission set — a demo override has no place next to real authorization.
4. Nothing in `hooks/`, `stores/auth.store.ts`, components, or routes needs
   to change — they were written against the service/store contracts, not
   against the fact that those contracts are currently mocked.
