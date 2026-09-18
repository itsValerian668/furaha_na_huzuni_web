# Furaha na Huzuni

> A modern, scalable, production-ready React frontend, built for integration with a Laravel/PHP REST API.

The frontend is developed independently from the backend. The backend will
be implemented separately in Laravel/PHP and expose REST endpoints this app
consumes — see [docs/API.md](./docs/API.md) for the integration contract.

This is treated as a production application, not a prototype.

## Documentation

| Doc                                            | Covers                                                                      |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Folder structure, layering, routing, state management, design system        |
| [docs/API.md](./docs/API.md)                   | Backend integration contract, Axios client, auth flow, endpoint conventions |
| [DEVELOPMENT.md](./DEVELOPMENT.md)             | Environment setup, commands, workflow, code quality checklist               |
| [CONTRIBUTING.md](./CONTRIBUTING.md)           | Git workflow, commit convention, testing expectations, PR checklist         |
| [AGENTS.md](./AGENTS.md)                       | Rules for AI coding assistants working in this repo                         |
| [CHANGELOG.md](./CHANGELOG.md)                 | Notable changes per release                                                 |

## Tech stack

| Layer             | Choice                                |
| ----------------- | ------------------------------------- |
| Framework / build | React 19 + Vite + TypeScript (strict) |
| Routing           | React Router                          |
| Styling           | Tailwind CSS                          |
| HTTP              | Axios                                 |
| Server state      | TanStack Query                        |
| Client state      | Zustand                               |
| Forms             | React Hook Form + Zod                 |
| Icons             | Lucide React                          |
| Testing           | Vitest + React Testing Library        |
| Quality           | ESLint + Prettier                     |

Backend (separate repo/deploy): Laravel + PHP + REST API + a relational database. The frontend never touches the database or contains backend logic — see the [Backend Integration](./docs/API.md#backend-integration) section of docs/API.md.

## Getting started

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if needed
npm run dev
```

## Environment variables

| Variable       | Purpose                          | Example                     |
| -------------- | -------------------------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the Laravel REST API | `http://localhost:8000/api` |

`.env` is git-ignored; `.env.example` is the template. Anything prefixed
`VITE_` is exposed to the browser bundle — **never** put secrets there
(database passwords, private API keys, Laravel app secrets). Production
values are supplied by the deployment environment, not committed.

## Commands

See [DEVELOPMENT.md](./DEVELOPMENT.md#commands) for the full list (`dev`, `build`, `lint`, `format`, `test`, `typecheck`, ...).

## Project status

```
Foundation ✅ → Design System (in progress) → Application Shell → Authentication (scaffolded)
→ Core Features → Laravel API Integration → Testing → Optimization → Production Deployment
```

## Philosophy

> Build software that remains easy to understand, maintain, test, secure, and extend as the application grows.

Every feature should improve the application without creating unnecessary technical debt.

## License

Project-specific licensing information should be added here.
