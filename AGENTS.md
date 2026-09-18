# Instructions for AI coding assistants

This repo is a production React frontend, not a prototype. Hold changes to
that bar.

## Before writing code

1. Inspect the existing implementation — architecture ([docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)),
   related components, hooks, services, stores, types, and routes.
2. Identify reusable code. Prefer extending `components/ui/`,
   `components/feedback/`, existing hooks/services over writing new ones.
3. Check whether the API endpoint you need already has a documented
   contract in [docs/API.md](./docs/API.md). If not, treat the shape as an
   assumption and mark it as such in a comment near the call site (see
   `src/services/auth.service.ts` for the pattern) — never invent backend
   behavior silently.
4. Think through: responsive behavior, accessibility, and loading/empty/
   error states for anything data-driven.

## While writing code

- TypeScript strict mode is on — avoid `any` and avoid silencing errors
  with `as any`/excessive assertions; define a real type instead.
- Server state (anything from the API) goes through TanStack Query.
  Client-only state goes through Zustand (`src/stores/`). Don't duplicate
  server data into a Zustand store.
- All HTTP calls go through `src/services/api.ts` via a `*.service.ts`
  module — never call `axios`/`fetch` directly from a component, and never
  hard-code an API host (use `VITE_API_URL` via `src/config/env.ts`).
- Forms use React Hook Form + Zod (see `LoginForm`/`SignupForm` under
  `features/auth/components/` as the reference).
- Use semantic HTML (`button` for actions, `a`/`Link` for navigation,
  `label` for inputs); don't use a clickable `div` where a semantic
  element exists.
- Don't add a dependency, a second CSS/UI framework, or a new abstraction
  unless the task genuinely needs it. No speculative flexibility for
  hypothetical future requirements.
- Don't modify unrelated files, and don't take the opportunity to
  refactor code outside the task's scope.

## After writing code

Run and make sure all pass before calling anything done:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

For UI changes, also run the app (`npm run dev`) and check it actually
renders and behaves correctly — passing checks is necessary but not
sufficient.

## Explicitly disallowed

- Hard-coded API URLs or secrets, especially in `VITE_*` env vars
  (these ship to the browser — see [docs/API.md](./docs/API.md#security))
- Treating frontend validation/route guards as the security boundary
- Disabling or bypassing auth checks, lint rules, or type errors to move
  faster
- Introducing Bootstrap/MUI/Ant/Chakra or another CSS framework alongside
  Tailwind without explicit instruction to do so
- Leaving an API-driven screen with no loading/empty/error handling
- Fabricating API endpoint behavior instead of flagging it as an assumption
