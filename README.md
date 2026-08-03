# RaccoonLand React

Frontend workspace mirroring `../dotnet/` layout: **Core** / **Modules** / **Samples**.

## Structure

```text
react/
├── Core/
│   └── pipeline-client/     → @raccoonland/pipeline-client
├── Modules/
│   ├── theme/               → @raccoonland/theme
│   ├── feedback/            → @raccoonland/feedback
│   ├── form-kit/            → @raccoonland/form-kit
│   ├── page/                → @raccoonland/page
│   └── layout/              → @raccoonland/layout
├── Samples/
│   └── Backoffice/          → package usage guides (same layout shell)
└── package.json             → npm workspaces
```

## Local development (workspaces)

```powershell
cd C:\Users\Hassan\Desktop\RaccoonLand\react
npm install
npm run dev
```

## Publish to Verdaccio

```powershell
npm login --registry http://localhost:4873/
# user: raccoon / pass: raccoon

npm publish -w @raccoonland/theme --registry http://localhost:4873/
npm publish -w @raccoonland/feedback --registry http://localhost:4873/
npm publish -w @raccoonland/form-kit --registry http://localhost:4873/
npm publish -w @raccoonland/page --registry http://localhost:4873/
npm publish -w @raccoonland/layout --registry http://localhost:4873/
npm publish -w @raccoonland/pipeline-client --registry http://localhost:4873/
```

Suggested order: theme → feedback → form-kit → page → layout → pipeline-client.

## Sample guides

| Route | Package |
|-------|---------|
| `/packages/pipeline-client` | `@raccoonland/pipeline-client` |
| `/packages/theme` | `@raccoonland/theme` |
| `/packages/feedback` | `@raccoonland/feedback` |
| `/packages/form-kit` | `@raccoonland/form-kit` |
| `/packages/page` | `@raccoonland/page` |
| `/packages/layout` | `@raccoonland/layout` |

People/Departments domain modules are **not** packaged; the sample teaches package usage instead.

### `@raccoonland/layout`

Reusable backoffice shell. The **app** owns navigation data, i18n strings, and user info; the package owns Sidebar (vertical / horizontal / density), Header chrome, fullscreen, and layout settings.

```tsx
import { BackofficeLayout, LayoutSettingsPanel } from '@raccoonland/layout'

<BackofficeLayout
  navigation={resolvedNav}
  brand={{ title: 'App', subtitle: 'Backoffice' }}
  direction="rtl"
  labels={chromeLabels}
  header={{
    showSearch: false,
    endActions: <MyExtraButton />,
  }}
  user={{ isLoading: false, info: { name: 'Ali', role: 'Admin', initials: 'A' } }}
/>
```
