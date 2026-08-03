# 11 — People: API and utils

Folders `features/people/api/` and `features/people/utils/`.

---

## `api/peopleApi.ts`

### Data types

| Type | Purpose |
|------|---------|
| `PersonStatus` | Numeric enum: Active=1, Inactive=2, Terminated=3 |
| `SearchPeopleItem` | One table row |
| `PersonDetail` | Full detail + department fields (not in UI yet) |
| `SearchPeopleResponse` | items + totalCount + pagination |
| `SearchPeopleParams` | Search query params |
| `CreatePersonPayload` | Create body |
| `UpdatePersonPayload` | Update body |

### `usePeopleApi()`

Hook returning an API method object (via `useMemo`).

| Method | HTTP | Path |
|--------|------|------|
| `search(params)` | GET | `/api/People/Search?...` |
| `getById(id)` | GET | `/api/People/{id}` |
| `create(payload)` | POST | `/api/People` |
| `update(id, payload)` | PUT | `/api/People/{id}` |
| `delete(id)` | DELETE | `/api/People/{id}` |
| `createInvalidDemo()` | POST | DevPage — intentionally invalid body |

### `applyWarnings`

If the backend returns `warnings` → `showWarning` toast for each.

### Why a hook instead of a plain module?

It needs `useToast()` — must run inside the React tree.

---

## `utils/peopleListUtils.ts`

**List and filter** helpers — no UI.

### `PeopleFilterDraft`

Drawer filter form shape:

```ts
{ employeeCode, firstName, lastName, status: '' | PersonStatus }
```

### `emptyPeopleFilters`

Initial empty values.

### `statusMessageKey` / `statusChipColor`

Maps `PersonStatus` → translation key and MUI Chip color.

### `draftToParams` / `paramsToDraft`

Convert between UI draft and `SearchPeopleParams` for the API.

### `countActiveFilters`

Count of non-empty filters — for Badge on search button.

### `personInitials(firstName, lastName)`

Avatar initials — e.g. “John Doe” → “JD”.

### `formatDateDisplay(value)`

Shortens ISO date to `YYYY-MM-DD`; null-safe.

---

## Related backend endpoints

Controller: `PeopleController` in CleanArchitectureSample.

Frontend does not call `assign-to-department` yet.

---

## Next

→ [12-people-forms.md](./12-people-forms.md)
