# 02 — Root project files

These files live outside `src/` but the app cannot run without them.

---

## `package.json`

**Role:** Node.js project manifest.

| Section | Meaning |
|---------|---------|
| `name` | Package name: `raccoonland-backoffice-sample` |
| `scripts.dev` | `npm run dev` → Vite dev server |
| `scripts.build` | TypeScript check, then production bundle |
| `dependencies` | Libraries needed in the **browser** |
| `devDependencies` | Dev/build only (TypeScript, Vite, …) |

**Important dependencies:**

- `@mui/material` + `@mui/icons-material` — UI
- `react`, `react-dom` — React core
- `react-router-dom` — routing
- `@tanstack/react-query` — server state
- `react-hook-form` — forms
- `notistack` — toasts
- `stylis` + `stylis-plugin-rtl` — RTL CSS for MUI

---

## `package-lock.json`

Locks exact versions of all packages. Updated by `npm install`. **Do not edit by hand.**

---

## `vite.config.ts`

**Vite** settings (bundler + dev server).

```ts
plugins: [react()]   // processes JSX/TSX

server.proxy['/api'] → https://localhost:4970
```

**Why proxy?** The browser talks to `localhost:5173`. Without a proxy you must handle CORS and absolute backend URLs. With proxy, frontend code only calls `/api/People/Search` and Vite forwards to the backend.

`secure: false` — local HTTPS uses a self-signed certificate.

---

## `index.html`

The only real HTML file. React mounts into `<div id="root">`.

- `lang="fa"` and `dir="rtl"` — initial values; `LocaleProvider` updates them later
- **Vazirmatn** (Persian) and **Inter** (English) from Google Fonts
- `favicon.svg` from `public/`

---

## `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json`

**TypeScript** config at three levels:

| File | Scope |
|------|--------|
| `tsconfig.json` | References sub-projects |
| `tsconfig.app.json` | `src/` application code |
| `tsconfig.node.json` | Node files like `vite.config.ts` |

`strict: true` means stricter typing — fewer runtime bugs.

---

## `.env.development` and `.env.example`

Environment variables for Vite. Only keys starting with `VITE_` are exposed to the frontend.

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | API prefix. Empty = same origin + proxy |

`.env.example` — template for the team; `.env.development` — your local dev values.

In `api/client.ts`:

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''
```

---

## `.gitignore`

Tells git not to commit `node_modules/`, `dist/`, secrets, etc.

---

## `.oxlintrc.json`

**oxlint** settings. `npm run lint` runs it.

---

## `public/`

Files copied **without processing**:

| File | Role |
|------|------|
| `favicon.svg` | Browser tab icon |
| `icons.svg` | Icon sprite (if needed) |

---

## `src/index.css`

Minimal global styles (e.g. body reset). Most styling comes from the MUI theme.

---

## `README.md` (project root)

Short summary: commands, folder structure — for developers.

---

## `docs/`

This documentation set + `implementation-plan.txt` (original step-by-step plan).

---

## Next

→ [03-entry-and-bootstrap.md](./03-entry-and-bootstrap.md)
