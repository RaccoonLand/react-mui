# 01 — Project overview

## What is this sample?

**RaccoonLand Backoffice Sample** is a reference app — not a finished product library. The goal is to try recurring patterns in a real project first, then extract shared parts into packages later (similar to `dotnet/Core`).

This project is a **backoffice admin panel** with:

- Sidebar, header, breadcrumbs
- **RTL** (Persian) and **LTR** (English) support
- **Dark/light** theme with the RaccoonLand purple palette
- Communication with the .NET API via **PipelineResponse** (same envelope as the backend)
- A complete **People** module (list, search, create, edit, delete, details)

---

## Technologies (plain language)

| Tool | Role |
|------|------|
| **React** | UI library — builds the screen from components |
| **TypeScript** | JavaScript with types — catches mistakes earlier |
| **Vite** | Build tool and dev server — fast and simple |
| **MUI (Material UI)** | Ready-made buttons, tables, forms, dialogs |
| **React Router** | Maps URL → which page to show |
| **TanStack Query** | Cache and manage API requests (fetch) |
| **react-hook-form** | Form state and validation |
| **notistack** | Toast notifications (corner messages) |

---

## `src/` folder structure

```text
src/
├── main.tsx              ← app entry point
├── app/                  ← bootstrap: router, providers
├── api/                  ← fetch and API hooks
├── components/page/      ← inner page shell (breadcrumb)
├── features/people/      ← everything for “people”
├── feedback/             ← toast, confirm, loader, shared dialog/drawer
├── i18n/                 ← FA/EN translations
├── layout/               ← shell: sidebar + header
├── pages/                ← route entry points only (thin orchestration)
└── theme/                ← MUI theme and colors
```

### `pages` vs `features`

- **`pages/`**: one file per URL. Wires hooks and layout together.
- **`features/people/`**: People domain logic and UI — table, forms, API.

When you add a Departments module, keep `pages/` thin and put details in `features/departments`.

---

## Runtime flow (browser open → screen)

```text
index.html
    ↓
main.tsx          → LocaleProvider, ThemeModeProvider
    ↓
App.tsx           → AppProviders + Router
    ↓
router.tsx        → URL maps to a page
    ↓
BackofficeLayout  → Sidebar + Header + content area
    ↓
DashboardPage / PeopleListPage / …
```

---

## Backend connection

In development (`npm run dev`):

- Frontend runs on Vite (e.g. `5173`)
- Requests to `/api/...` are **proxied** in `vite.config.ts` to `https://localhost:4970`
- Responses use **PipelineResponse**: `{ result, errors, warnings }`

---

## Intentionally incomplete

- **Roles, Users, Reports, Settings** routes → Placeholder only
- **Dashboard** stats are not wired to real data
- Global search in Header → decorative
- **Departments** exists in backend, not in frontend yet

The sample is complete for learning patterns; it is not a production app.

---

## Next

→ [02-root-files.md](./02-root-files.md) — files outside `src/`
