# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this project
doesn't follow semver releases yet (pre-1.0, foundation phase).

## [Unreleased]

### Added

- Initial project scaffold: React 19 + Vite + TypeScript (strict), Tailwind
  CSS, React Router, Axios, TanStack Query, Zustand, React Hook Form + Zod,
  Lucide React.
- ESLint (flat config) + Prettier, replacing the Vite template's default
  Oxlint setup.
- Vitest + React Testing Library, with a sample test for `Button`.
- Feature-based folder structure under `src/` — see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).
- Centralized Axios client (`src/services/api.ts`) reading `VITE_API_URL`,
  with a Sanctum-style bearer/cookie setup and automatic session clearing
  on 401.
- Auth vertical slice as the reference pattern for future features:
  `stores/auth.store.ts`, `services/auth.service.ts`,
  `features/auth/hooks/{useLogin,useLogout}.ts`, `features/auth/pages/AuthPage.tsx`,
  `routes/ProtectedRoute.tsx`, `layouts/{AuthLayout,DashboardLayout}.tsx`.
  Backend endpoints are documented as assumptions — see [docs/API.md](./docs/API.md#auth-endpoints-assumed-contract).
- Base UI primitives: `Button`, `Input`, `Alert`, `Spinner`
  (`components/ui/`), `EmptyState`, `ErrorState` (`components/feedback/`).
- 404 page and root router config (`routes/router.tsx`).
- `.env.example` / `.env`, project documentation set (this file plus
  `README.md`, `docs/ARCHITECTURE.md`, `docs/API.md`, `DEVELOPMENT.md`,
  `CONTRIBUTING.md`, `AGENTS.md`).

### Changed

- Renamed `LoginPage` to `AuthPage` (`features/auth/pages/AuthPage.tsx`).
- Redesigned `AuthPage` as a split-screen sign-in/sign-up card with its own
  dark green/gold editorial palette (`features/auth/AuthPage.css` — a
  deliberate, scoped exception to Tailwind-only styling, see
  [docs/ARCHITECTURE.md#design-system](./docs/ARCHITECTURE.md#design-system)):
  `BrandPanel` (marketing side, hidden below 760px), `LoginForm`/`SignupForm`
  (`features/auth/components/`) with underline-style `AuthField`/
  `AuthPasswordField` inputs, a `PasswordStrengthMeter`, and a skewed
  "blade" wipe transition between modes (`prefers-reduced-motion`-aware,
  short-circuits to an instant swap). `AuthLayout` simplified to a
  pass-through `<Outlet />` since `AuthPage` now owns its full page.
- Split `AuthPage` into `BrandPanel` / `FormPanel` / `AuthBlade`
  (`features/auth/components/`), each owning one concern, with `AuthPage`
  itself reduced to the redirect guard and the mode/sweep state machine —
  see [docs/ARCHITECTURE.md#forms](./docs/ARCHITECTURE.md#forms).
- Reworked `AuthBlade` to use a reveal-mask technique instead of a moving
  painted label: the mask (`.auth-blade`) is a full-card skewed rectangle
  with `overflow: hidden`; its content (`.blade-inner`) carries the exact
  inverse transform, canceling the parent's so the preview renders exactly
  where the real `BrandPanel` will settle rather than sliding across.
  `BrandPanel`/`FormPanel` now genuinely swap sides by mode via
  `.auth-card[data-mode] { order }` (brand right/form left for login,
  brand left/form right for signup), matching the reference design.
  `BrandPanel`'s copy is now mode-dependent (shared with `AuthBlade` via
  `brandCopy.ts`) instead of static — see
  [docs/ARCHITECTURE.md#forms](./docs/ARCHITECTURE.md#forms).
- Added a `POST /auth/register` assumption to the auth contract
  (`AuthResponse` type, `authService.register`, `useRegister` hook) to back
  the sign-up form — see
  [docs/API.md](./docs/API.md#auth-endpoints-assumed-contract).

### Fixed

- The blade transition's rest/swept `translateX` values, ported directly
  from the source design, left ~270px of the blade visible inside the card
  at rest — `skewX` shears a tall element enough that percentage-based
  translation (relative to the element's own unskewed width) undershoots.
  Found via `getBoundingClientRect()` in a real browser, not by inspection;
  fixed with measured values (superseded below once the blade became
  full-width).
- The reveal-mask's counter-transform only worked at the animation's start
  and end, not during it: `--sweep` was an _unregistered_ CSS custom
  property, so while the parent's `transform` (natively animatable)
  interpolated smoothly, the child's counter-transform — recomputed fresh
  from `var(--sweep)` on every style pass — snapped straight to the target
  value instead of tracking the same interpolation, throwing the preview
  content ~730px off-position for the whole transition. Confirmed via
  `getBoundingClientRect()` mid-sweep, not assumed. Fixed by registering
  `--sweep` with `@property` as an animatable `<percentage>` and
  transitioning it directly (not `transform`) in `AuthBlade.tsx`, so every
  consumer of `var(--sweep)` sees the same interpolating value each frame.
