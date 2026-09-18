# Architecture

Why the project is structured this way — the layering, folder boundaries,
and state-management split exist to keep the frontend swappable and
Laravel-ready without a rewrite. If you're deciding _where new code
belongs_ or _why something isn't just a `useState`_, this is the doc.

## Layering

```
Presentation (components / pages)
        ↓
Application logic (hooks)
        ↓
Services (src/services/*.service.ts)
        ↓
API client (src/services/api.ts)
        ↓
Laravel REST API
        ↓
Database
```

Components do not call `axios`/`fetch` directly and do not contain business
logic beyond presentation concerns. API calls live in `*.service.ts`
modules; components consume them through TanStack Query hooks in
`src/features/*/hooks/`.

## Folder structure

```text
src/
├── assets/            static assets (images, fonts)
├── components/
│   ├── ui/             generic, reusable primitives — Button, Input, Alert, Spinner, ...
│   ├── common/          shared non-primitive components
│   ├── forms/            shared form building blocks
│   ├── layout/            shared layout building blocks
│   └── feedback/          EmptyState, ErrorState, loading states
├── config/              typed environment/config access (config/env.ts)
├── constants/            app-wide constants
├── features/             feature-based modules (auth, dashboard, ...) —
│                           each owns its pages/hooks/components as it grows
├── hooks/                cross-feature reusable hooks
├── layouts/              route-level shells (AuthLayout, DashboardLayout)
├── pages/                standalone pages not tied to a feature (404, ...)
├── routes/               router config (routes/router.tsx) and guards (ProtectedRoute.tsx)
├── services/             API layer — one Axios instance (api.ts) + one
│                           *.service.ts module per API resource
├── stores/               Zustand stores — client/UI state only
├── types/                shared TypeScript types (API contracts, domain models)
├── test/                 Vitest + Testing Library setup
└── utils/                small framework-agnostic helpers
```

Use feature-based organization (`src/features/<name>/`) once a feature has
enough surface area to justify it (its own hooks, components, pages). Don't
force a one-off component into a feature directory.

## Routing

Routes are categorized and centralized in `src/routes/router.tsx`:

```
Public routes        → wrapped in AuthLayout (e.g. /login)
Protected routes      → gated by ProtectedRoute, wrapped in DashboardLayout
Error routes           → catch-all 404
```

`src/routes/ProtectedRoute.tsx` is the single place authentication is
enforced client-side — it reads `useIsAuthenticated()` from the auth store,
redirects unauthenticated visitors to `/login`, and preserves the original
destination in router state so `AuthPage` can send them back after signing
in. No page should re-implement this check.

## State management

Two categories, kept deliberately separate:

- **Server state → TanStack Query.** Anything that comes from the API:
  fetching, caching, refetching, mutations, pagination, loading/error
  state. See `src/features/auth/hooks/useLogin.ts` and `useLogout.ts` for
  the pattern (a hook wrapping `useMutation`/`useQuery` around a
  `*.service.ts` call).
- **Client state → Zustand.** Only for state that is genuinely
  client-only: `stores/auth.store.ts` mirrors the current session (user +
  token, persisted to `localStorage`) for the UI to read; `stores/ui.store.ts`
  holds UI chrome like sidebar open/closed. Don't duplicate server data into
  Zustand, and don't reach for global state before checking if the state
  can stay local to a component.

## Forms

React Hook Form + Zod. `LoginForm`/`SignupForm`
(`src/features/auth/components/`) are the reference implementation:

- Zod schema defines validation + infers the form's TypeScript type.
- `zodResolver` wires it into `useForm`.
- Field-level errors render under each field (`AuthField`/`AuthPasswordField`
  in this feature; the generic `components/ui/Input` for everything else).
- Laravel 422 validation responses are mapped onto the same fields via
  `setError` (see `isValidationError` in `services/api.ts`).
- Non-field errors (invalid credentials, email already taken, network
  failure) render as an `Alert` above the form.
- The submit button shows a loading state and disables while pending.
- Prefer RHF's `useWatch` over `watch()` when a field's live value drives
  other UI (e.g. the password strength meter) — `watch()` returns an
  unmemoizable function that trips the React Compiler's lint rule.

Client-side validation is a UX improvement, not a security boundary —
Laravel remains responsible for final validation.

`AuthPage` (`src/features/auth/pages/AuthPage.tsx`) is the composition
root — it owns only the authenticated-redirect check and the sweep/mode
state machine, delegating everything else:

```
AuthPage                 owns: redirect guard, mode + sweep state machine
├── BrandPanel           marketing panel, copy depends on `mode`
├── FormPanel            switches between LoginForm/SignupForm on `mode`
│   ├── LoginForm         RHF + Zod, useLogin
│   └── SignupForm        RHF + Zod, useRegister
└── AuthBlade             purely presentational sweep animation
```

Each piece stays focused on one concern — `AuthBlade` doesn't know what a
login form is, `LoginForm` doesn't know it's being swept over. This is the
general shape to reach for as a screen grows: page owns state and
data-fetching, section/feature components stay presentational or own only
their own local concern.

`BrandPanel` and `FormPanel` swap sides by mode (brand right/form left for
login, brand left/form right for signup) via `.auth-card[data-mode] { order }`
in `AuthPage.css` — pure CSS, no DOM reordering, so tab order stays sane.
`AuthBlade` is a reveal mask, not a moving label: it's a skewed,
`overflow: hidden` panel that translates across, and its content carries
the exact inverse transform, which cancels the parent's transform so the
preview text renders exactly where the real `BrandPanel` will land —
see the comment above `.auth-blade` in `AuthPage.css` for the mechanics,
and above `@property --sweep` for a real bug this technique hides: an
_unregistered_ custom property doesn't interpolate, so the parent's
`transform` (natively animatable) and the child's counter-transform
(recomputed fresh from `var(--sweep)` every style pass) fall out of sync
for the whole transition and only re-align at the very end. Confirmed via
`getBoundingClientRect()` mid-sweep, not by inspection — the content was
rendering ~730px off. `@property` registers `--sweep` as an animatable
`<percentage>`, keeping every consumer of it synchronized frame-by-frame.

## Design system

Tailwind CSS is the styling layer; no other CSS framework is introduced
without strong justification. Reusable primitives live in
`src/components/ui/` (`Button`, `Input`, `Alert`, `Spinner` so far) and
`src/components/feedback/` (`EmptyState`, `ErrorState`). Consistency is
maintained through:

- Shared focus-ring treatment defined once in `src/index.css`
  (`:focus-visible`), not per component.
- A small closed set of variant classes per component (see
  `Button`'s `VARIANT_CLASSES`) rather than ad hoc className soup at call
  sites.
- Accessible-by-default primitives: `Input` wires `label`/`aria-invalid`/
  `aria-describedby` automatically; `Button` sets `aria-busy` while loading.

Grow this set (Select, Modal, Tabs, DataTable, Pagination, ...) as real
screens need them — don't build components speculatively ahead of use.

**Scoped-CSS exception:** `features/auth/AuthPage.css` is a deliberate,
one-off departure from Tailwind-only styling. The auth screen uses its own
dark green/gold editorial palette (distinct from the rest of the app's
blue/gray dashboard theme) and an animated skewed "blade" transition that
isn't practical to express as Tailwind utility classes — a plain,
component-scoped stylesheet, imported directly by `AuthPage.tsx`, is the
more maintainable choice there. Don't reach for this pattern by default;
it's justified by genuinely bespoke, one-off visual requirements, not a
general escape hatch from Tailwind.

## Error / loading / empty states

Every data-driven screen should account for: loading, success, empty,
validation error, unauthorized, forbidden, not found, server error, network
failure. Use `ErrorState`/`EmptyState` from `components/feedback/` and
`getApiErrorMessage()` from `services/api.ts` to turn any Axios error into a
user-presentable message rather than leaving a blank screen.

## Scalability

As a feature grows, let it take the shape it needs under
`src/features/<name>/`:

```
features/<name>/
├── components/
├── hooks/
├── pages/
├── <name>.service.ts   (or reuse services/ if shared across features)
└── types.ts
```

Don't pre-build this skeleton for a feature that doesn't need it yet — three
similar files beat a premature abstraction.
