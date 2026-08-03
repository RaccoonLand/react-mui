# 08 — Layout (backoffice shell)

Folder `src/layout/` — fixed frame around every page.

---

## `navigation.ts`

**Sidebar menu data** (not JSX).

```ts
export type NavItem = {
  key: string
  labelKey: MessageKey   // translation key
  path?: string          // link if leaf item
  icon?: SvgIconComponent
  badge?: number         // e.g. users: 3
  children?: NavItem[]   // expandable group
}
```

`navigation` is a tree: Dashboard, Management (People, Roles, Users), Reports, Settings.

Layout constants:

| Constant | Value | Purpose |
|----------|-------|---------|
| `SIDEBAR_WIDTH` | 252px | Expanded sidebar |
| `SIDEBAR_COLLAPSED_WIDTH` | 68px | Icons only |
| `HEADER_HEIGHT` | 56px | Header height |
| `LAYOUT_MOBILE_BREAKPOINT` | `'md'` | Below ~900px = mobile |

`shellHeaderSx` — shared styles for sidebar brand row and page header.

---

## `Sidebar.tsx`

Renders menu from `navigation`.

### Props

| Prop | Meaning |
|------|---------|
| `collapsed` | Desktop — icons only |
| `variant` | `permanent` (docked) or `drawer` (inside mobile drawer) |
| `onNavigate` | After link click on mobile — close drawer |

### Behavior

- Groups (Management) use `ExpandMore` / `ExpandLess`
- Active item — purple highlight from `raccoon.nav`
- `NavLink` from react-router for active route

---

## `Header.tsx`

Top bar above content:

| Section | Job |
|---------|-----|
| Menu button | Collapse desktop / open-close mobile |
| Search field | Decorative for now |
| Light/dark | `toggleMode()` |
| Language | `toggleLocale()` |
| Notifications | Decorative |
| Avatar + name | Hardcoded “Hassan / Admin” |

---

## `BackofficeLayout.tsx`

**Main layout** wrapping all routes in the router.

### State

- `collapsed` — desktop sidebar
- `mobileOpen` — mobile drawer
- `isMobile` — from `useMediaQuery`

### JSX structure

```text
Box (fullscreen)
├── Sidebar permanent (desktop only)
├── Drawer temporary (mobile only) → Sidebar variant=drawer
└── Column
    ├── Header
    └── main → <Outlet />  ← pages render here
```

- Mobile drawer closes on `location.pathname` change
- `Outlet` — React Router child route slot

---

## Layout and router

```tsx
// router.tsx
{ element: <BackofficeLayout />, children: [ ... ] }
```

Each child renders inside `<Outlet />` in `main`.

---

## Next

→ [09-page-component.md](./09-page-component.md)
