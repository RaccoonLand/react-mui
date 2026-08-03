# RaccoonLand Backoffice Sample

React sample app for RaccoonLand backoffice UX (Sample-first, extract packages later).

> **Location:** This sample belongs under `RaccoonLand/react/Samples/Backoffice`.  
> Copy or move this folder there when the IDE workspace is closed (see `../RaccoonLand/react/README.md`).

## Stack

- Vite + React 19 + TypeScript
- MUI 7 (dark/light theme, RaccoonLand palette)
- React Router 7, TanStack Query, react-hook-form, notistack
- RTL / LTR via `stylis-plugin-rtl` + locale toggle

## Commands

```powershell
npm install
npm run dev
npm run build
```

API proxy: `/api` → `https://localhost:4970` (see `vite.config.ts`).

## Folder structure

```text
src/
├── app/              # bootstrap, providers, router
├── api/              # PipelineResponse client, errors, hooks
├── components/
│   └── page/         # Page shell, breadcrumbs
├── features/
│   └── people/       # demo feature module
│       ├── api/
│       ├── components/
│       ├── forms/
│       └── utils/
├── feedback/         # toast, confirm, loading, overlay (AppDialog/AppDrawer)
├── i18n/
├── layout/           # BackofficeLayout, sidebar, header
├── pages/            # route entry points only
└── theme/
```

## Completed sample scope

- Backoffice layout + Page component
- Pipeline API layer (`usePipelineQuery`, `usePipelineMutation`)
- People: list, search drawer, create/edit forms, delete + confirm, detail modal
- Shared overlay shells: `AppDialog`, `AppDrawer`

## Docs

- [docs/README.md](./docs/README.md) — **full English documentation** (14 chapters + index)
- `docs/implementation-plan.txt` — original implementation steps (Persian notes)
