# 14 — People end-to-end flows

This chapter walks through the three main user scenarios step by step.

---

## Scenario 1 — Open the people list

```text
1. User navigates to /management/people
2. router → PeopleListPage inside BackofficeLayout
3. usePipelineQuery with queryKey including page and filters
4. peopleApi.search → GET /api/People/Search
5. fetchPipeline → parse PipelineResponse
6. usePipelineExecutor → global loader (unless disabled)
7. data.items → PeopleDataTable
```

**Cache:** Same `queryKey` within 30s may return cached data.

---

## Scenario 2 — Filter and view details

### Filter

```text
Click “Search” → searchOpen=true
  → PeopleSearchDrawer (AppDrawer)
User fills fields → draft
Click “Apply” → draftToParams → appliedFilters
  → queryKey changes → new fetch
  → page=0
```

### Details

```text
Click name or eye icon
  → setDetailPersonId(id)
  → PersonDetailModal open
  → usePipelineQuery ['people', id] enabled
  → getById → PersonDetailView
```

---

## Scenario 3 — Create a person

```text
/management/people/new
  → PersonCreatePage
  → useForm + resolver
  → valid submit
  → createMutation.mutate
  → POST /api/People
  → onSuccess: showSuccess + invalidateQueries(['people']) + navigate to list
```

Server validation error (`PipelineApiError`) → red `Alert` above the form.

---

## Scenario 4 — Edit and delete

### Edit

```text
/management/people/5/edit
  → getById
  → useEffect: form.reset(personToFormValues)
  → submit → PUT /api/People/5
```

**Note:** `reset` must run in `useEffect`, not during render — otherwise the form stays empty.

### Delete from edit page

```text
Click delete → confirm (AppDialog emphasis)
  → deleteMutation → DELETE
  → navigate to list
```

### Delete from table

```text
Trash icon → confirm
  → deleteMutation(person.id)
  → invalidateQueries — table refreshes
  → deletingId disables that row’s button
```

---

## invalidateQueries

After create/update/delete:

```tsx
queryClient.invalidateQueries({ queryKey: ['people'] })
```

All queries whose key starts with `['people']` (search and getById) become stale and refetch when needed.

---

## File map by scenario

| Scenario | Key files |
|----------|-----------|
| List | PeopleListPage, peopleApi.search, PeopleDataTable |
| Filter | PeopleSearchDrawer, peopleListUtils |
| Details | PersonDetailModal, PersonDetailView |
| Create | PersonCreatePage, PersonCreateForm, personValidation |
| Edit | PersonEditPage, PersonEditForm |
| Delete | useConfirm, delete in peopleApi |
| Feedback | usePipelineMutation, ToastProvider, ConfirmProvider |

---

## Suggested next learning steps

1. Add a new field to Person (backend + types + form + table)
2. Build **Departments** by copying the people pattern
3. After the pattern repeats 3+ times → extract to `react/Core`

---

## Back to index

→ [README.md](./README.md)
