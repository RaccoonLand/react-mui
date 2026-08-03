# Complete file index

Every project file with a one-line description. See the chapter number for full detail.

## Project root → Chapter 02

| File | Description |
|------|-------------|
| `package.json` | Dependencies and npm scripts |
| `package-lock.json` | Locked package versions |
| `vite.config.ts` | Vite + API proxy to backend |
| `index.html` | Entry HTML, fonts, `#root` |
| `tsconfig.json` | TypeScript root |
| `tsconfig.app.json` | TS for `src/` |
| `tsconfig.node.json` | TS for Vite config |
| `.env.development` | Dev env (`VITE_API_BASE_URL`) |
| `.env.example` | Env template |
| `.gitignore` | Git ignore rules |
| `.oxlintrc.json` | Linter config |
| `README.md` | Project summary |

## `public/` → Chapter 02

| File | Description |
|------|-------------|
| `favicon.svg` | Tab icon |
| `icons.svg` | Icon sprite |

## `src/` entry → Chapter 03

| File | Description |
|------|-------------|
| `main.tsx` | React root render |
| `index.css` | Minimal global CSS |

## `src/app/` → Chapter 03

| File | Description |
|------|-------------|
| `App.tsx` | Providers + Router |
| `AppProviders.tsx` | Context provider chain |
| `DirectionProvider.tsx` | Emotion RTL cache |
| `queryClient.ts` | TanStack Query defaults |
| `router.tsx` | URL route definitions |

## `src/api/` → Chapter 04

| File | Description |
|------|-------------|
| `client.ts` | `fetchPipeline`, `buildQueryString` |
| `errors.ts` | `PipelineApiError`, `NetworkError` |
| `types/pipeline.ts` | PipelineResponse shape |
| `hooks/usePipelineRequest.ts` | `usePipelineQuery`, `usePipelineMutation` |

## `src/feedback/` → Chapter 05

| File | Description |
|------|-------------|
| `toast/ToastProvider.tsx` | notistack + `useToast` |
| `confirm/types.ts` | ConfirmOptions types |
| `confirm/ConfirmProvider.tsx` | `useConfirm` + Promise |
| `confirm/ConfirmDialog.tsx` | Confirm UI (AppDialog) |
| `loading/LoadingProvider.tsx` | Backdrop loader |
| `overlay/AppDialog.tsx` | Shared Dialog shell |
| `overlay/AppDrawer.tsx` | Shared Drawer shell |

## `src/i18n/` → Chapter 06

| File | Description |
|------|-------------|
| `messages.ts` | FA/EN strings |
| `LocaleProvider.tsx` | `t()`, locale, direction |

## `src/theme/` → Chapter 07

| File | Description |
|------|-------------|
| `tokens.ts` | Raccoon color tokens |
| `palette.ts` | Re-export tokens |
| `createRaccoonTheme.ts` | Build MUI theme |
| `ThemeModeProvider.tsx` | dark/light mode |
| `useRaccoonTheme.ts` | Token access hook |
| `theme.d.ts` | MUI type extension |

## `src/layout/` → Chapter 08

| File | Description |
|------|-------------|
| `navigation.ts` | Menu data + layout constants |
| `Sidebar.tsx` | Side navigation |
| `Header.tsx` | Top bar |
| `BackofficeLayout.tsx` | Shell + Outlet |

## `src/components/page/` → Chapter 09

| File | Description |
|------|-------------|
| `Page.tsx` | Page template + actions |
| `BreadcrumbNav.tsx` | Breadcrumb UI |
| `breadcrumbUtils.ts` | Icons from navigation |

## `src/pages/` → Chapter 10

| File | Description |
|------|-------------|
| `DashboardPage.tsx` | Dashboard |
| `PeopleListPage.tsx` | People list |
| `PersonCreatePage.tsx` | Create person |
| `PersonEditPage.tsx` | Edit person |
| `PlaceholderPage.tsx` | Future pages |
| `DevPage.tsx` | Test utilities |

## `src/features/people/api/` → Chapter 11

| File | Description |
|------|-------------|
| `peopleApi.ts` | Types + `usePeopleApi()` |

## `src/features/people/utils/` → Chapter 11

| File | Description |
|------|-------------|
| `peopleListUtils.ts` | Filters, status, initials, dates |

## `src/features/people/forms/` → Chapter 12

| File | Description |
|------|-------------|
| `personValidation.ts` | Rules + field limits |
| `personFormResolvers.ts` | Resolvers for RHF |

## `src/features/people/components/` → Chapters 12–13

| File | Description |
|------|-------------|
| `FormTextField.tsx` | TextField + error |
| `RhfFormTextField.tsx` | react-hook-form bridge |
| `personFormLayout.tsx` | Section + Actions |
| `PersonCreateForm.tsx` | Create form UI |
| `PersonEditForm.tsx` | Edit form UI |
| `AddPersonButton.tsx` | Add button |
| `PeopleDataTable.tsx` | List table |
| `PeopleSearchDrawer.tsx` | Filter drawer |
| `PersonDetailModal.tsx` | Detail modal |
| `PersonDetailView.tsx` | Read-only detail content |

---

→ [README.md](./README.md) — chapter index
