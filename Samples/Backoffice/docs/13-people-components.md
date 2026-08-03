# 13 — People: UI components

Folder `features/people/components/` — building blocks used by pages.

---

## `AddPersonButton.tsx`

CTA button “Add person” — high-contrast white on dark background.

Supports `component={RouterLink}` and `to` for use as a link in `PeopleListPage`.

---

## `PeopleDataTable.tsx`

MUI table with:

| Column | Content |
|--------|---------|
| # | Global row number |
| Person | Avatar + name + ID — **click** opens details |
| Employee code | Monospace Chip |
| Status | Colored Chip |
| Actions | View, edit, delete |

### Props

- `items`, `totalCount`, `page`, `pageSize`
- `onPageChange`, `onPageSizeChange`
- `onDelete`, `deletingId`
- `onView`

`TablePagination` with FA/EN labels.

---

## `PeopleSearchDrawer.tsx`

Advanced filters — uses **`AppDrawer`**.

Fields: employeeCode, firstName, lastName, status.

Buttons: Apply (green) + Reset.

`handleApply` → page `onApply` + close drawer.

---

## `PersonDetailModal.tsx`

Detail modal — uses **`AppDialog`**.

- `usePipelineQuery` with `showGlobalLoader: false`
- Loading / error / not-found states
- `PersonDetailView` for content
- Actions: close + link to edit

---

## `PersonDetailView.tsx`

**Read-only** person display:

- Header: large avatar, name, chips
- Three `PersonFormSection` blocks with `DetailField` (label + value)

No fetch — receives `person: PersonDetail` only.

---

## Component relationships

```text
PeopleListPage
├── PeopleDataTable
├── PeopleSearchDrawer → AppDrawer
└── PersonDetailModal → AppDialog → PersonDetailView

PersonCreatePage → PersonCreateForm → personFormLayout, RhfFormTextField
PersonEditPage   → PersonEditForm   → same + delete
```

---

## Next

→ [14-people-end-to-end.md](./14-people-end-to-end.md)
