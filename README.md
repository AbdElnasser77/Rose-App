# Rose App — Micro-Frontend Monorepo

An Angular 21 monorepo using Nx and Module Federation. The shell app hosts and dynamically loads independent micro-frontend remotes.

---

## Tech Stack

- Angular 21, Nx 22, TypeScript 5.9
- Webpack + Module Federation
- PrimeNG 21 with Aura theme
- Tailwind CSS 4, SCSS
- Vitest (unit), Playwright (e2e)

---

## Folder Structure

```
apps/
├── shell/              Host application, bootstraps the app and loads remotes dynamically. Port 4200
├── shell-e2e/          Playwright E2E tests for shell
├── dashboard/          Remote MFE — dashboard feature. Port 4201
├── dashboard-e2e/      Playwright E2E tests for dashboard
├── roseApp/            Remote MFE — main app with authentication. Port 4203
└── roseApp-e2e/        Playwright E2E tests for roseApp

libs/
└── shared/
    ├── models/         (@rose/models) Shared data models — scaffolded, not yet implemented
    └── ui/             (@rose/ui) Shared UI components — scaffolded, not yet implemented
```

---

## How It Works

The shell loads remotes at runtime using the manifest file at `apps/shell/public/module-federation.manifest.json`. The default route loads `roseApp` and `/dashboard` loads the dashboard remote.

---

## Getting Started

**Install dependencies**
```bash
npm install
```

**Run everything**
```bash
npx nx serve shell --devRemotes=dashboard,roseApp
```

**Build**
```bash
npx nx build shell
```

**Tests**
```bash
npx nx run-many -t test
```

> Node version: 20.x — see `.nvmrc`
