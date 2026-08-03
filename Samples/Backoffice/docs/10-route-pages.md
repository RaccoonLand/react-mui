# 10 — Route pages (`src/pages/`)

Each file = **one URL**. Heavy logic lives in `features/`; pages only **orchestrate**.

---

## `DashboardPage.tsx`

Route: `/`

- `Page` with dashboard breadcrumb
- Welcome card
- Three `StatCard` values showing `—` (not wired to API yet)
- Link to `/dev`

---

## `PeopleListPage.tsx`

Route: `/management/people`

**Main demo page.**

### Local state

| State | Purpose |
|-------|---------|
| `page`, `pageSize` | Pagination (page is 0-based) |
| `searchOpen` | Filter drawer open |
| `draft` | Form values in drawer (not applied yet) |
| `appliedFilters` | Filters sent to API |
| `deletingId` | Row currently deleting |
| `detailPersonId` | Person shown in detail modal |

### Query

```tsx
usePipelineQuery({
  queryKey: ['people', 'search', page + 1, pageSize, appliedFilters],
  queryFn: () => peopleApi.search({ page: page + 1, ... }),
})
```

### Handlers

- `handleDeletePerson` — confirm → delete → invalidate cache
- `handleApplySearch` — draft → appliedFilters
- `onView` — open `PersonDetailModal`

### Children

`PeopleDataTable`, `PeopleSearchDrawer`, `PersonDetailModal`

---

## `PersonCreatePage.tsx`

Route: `/management/people/new`

- `useForm` + `createPersonCreateResolver`
- `usePipelineMutation` → `peopleApi.create`
- On success → toast + navigate to list
- `PersonCreateForm` — form UI

---

## `PersonEditPage.tsx`

Route: `/management/people/:id/edit`

- `useParams()` → `id`
- `usePipelineQuery` → `getById`
- `useEffect` + `form.reset` when person loads (**important** — avoids race)
- `updateMutation` and `deleteMutation`
- Loading / error / not-found states

---

## `PlaceholderPage.tsx`

Future pages (Roles, Users, Reports, Settings).

Props:

- `titleKey` — page title
- `breadcrumbKeys` — breadcrumb path

Renders a `Paper` with `placeholderBody` text.

---

## `DevPage.tsx`

Route: `/dev`

Test tools from early phases:

- success/error/warning toasts
- normal and delete confirm
- mock query
- error mutation
- fetch people

Useful for learning providers; can be removed in production.

---

## Pattern for a new page

1. Add file under `pages/`
2. Add route in `router.tsx`
3. Add menu item in `navigation.ts` (if needed)
4. Add keys in `messages.ts`
5. Wrap content in `<Page>` for breadcrumb

---

## Next

→ [11-people-api-and-utils.md](./11-people-api-and-utils.md)
