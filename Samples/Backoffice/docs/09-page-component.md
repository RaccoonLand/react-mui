# 09 — Page component and Breadcrumb

Folder `src/components/page/` — template **inside** each page content area (not the full shell).

---

## Why `components/page` vs `pages`?

| Folder | Role |
|--------|------|
| `pages/` | One file = one URL |
| `components/page/` | Reusable piece: breadcrumb + action bar |

`components/page` avoids confusion with the `pages/` route folder.

---

## `Page.tsx`

### Props

```ts
PageProps = {
  title: string           // a11y / document title — not duplicated as h1
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode     // right-side buttons (search, add, …)
  children: ReactNode     // main content
}
```

### Visual structure

1. **Sticky header** — breadcrumb + actions
2. **Body** — `children` (table, form, …)

Extra bottom padding on mobile for safe-area and sticky form buttons.

### Example

```tsx
<Page
  title={t('navPeople')}
  breadcrumbs={[
    { label: t('navDashboard'), href: '/', labelKey: 'navDashboard' },
    { label: t('navPeople'), labelKey: 'navPeople' },
  ]}
  actions={<AddPersonButton ... />}
>
  <PeopleDataTable ... />
</Page>
```

---

## `BreadcrumbNav.tsx`

Breadcrumb trail at the top of the page.

### `BreadcrumbItem`

```ts
{
  label: string
  href?: string
  labelKey?: MessageKey  // resolve icon from navigation
  icon?: SvgIconComponent // explicit icon
}
```

- Last item is usually highlighted (badge style)
- Links use `RouterLink`

---

## `breadcrumbUtils.ts`

Helpers for **automatic breadcrumb icons**:

- `findNavIconByPath(href)` — from `navigation.ts`
- `findNavIconByLabelKey(labelKey)`
- `resolveBreadcrumbIcon(item)` — explicit icon → path → labelKey

Example: `{ labelKey: 'navPeople' }` → Group icon from the menu.

---

## Next

→ [10-route-pages.md](./10-route-pages.md)
