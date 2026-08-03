# 05 — Feedback system

Folder `src/feedback/` groups all “tell the user what happened” mechanisms.

---

## Toast — `feedback/toast/ToastProvider.tsx`

**Toast** = small corner message (success, error, warning).

### Structure

- `SnackbarProvider` from **notistack** — rendering engine
- `ToastBridge` — connects `useSnackbar` to our Context
- `useToast()` — app API

### `useToast` methods

| Method | Use |
|--------|-----|
| `showSuccess(message)` | Saved, deleted, … |
| `showError(message)` | API or network error |
| `showWarning(message)` | pipeline warning or cancelled action |
| `showInfo(message)` | general info |

### RTL

In RTL, toast is bottom **left**; in LTR, bottom **right** (`anchorOrigin`).

---

## Confirm — `feedback/confirm/`

### `types.ts`

```ts
ConfirmOptions = {
  title, message,
  confirmText?, cancelText?,
  destructive?: boolean  // red button for delete
}
```

`confirm()` returns a **Promise&lt;boolean&gt;**.

### `ConfirmProvider.tsx`

- State for one open dialog (`ConfirmState`)
- `confirm(options)` → `new Promise` + store `resolve`
- On close → `resolve(true/false)`

### `ConfirmDialog.tsx`

Dialog UI; uses **`AppDialog`** with `variant="emphasis"` (glow border).

### Example (delete person)

```tsx
const ok = await confirm({
  title: t('confirmDeleteTitle'),
  message: t('confirmDeletePersonMessage', { name }),
  confirmText: t('delete'),
  destructive: true,
})
if (ok) deleteMutation.mutate(id)
```

---

## Loading — `feedback/loading/LoadingProvider.tsx`

Full-screen **Backdrop** with `CircularProgress` while API requests run.

### `withLoading(action)`

- `pendingCount++` before await
- `pendingCount--` in `finally`
- Multiple concurrent requests → one backdrop until all finish

### `useLoading()`

- `withLoading` — used inside `usePipelineRequest`
- `isLoading` — optional for disabling buttons

`showGlobalLoader: false` on a modal query means spinner only inside the modal.

---

## Overlay — `feedback/overlay/`

Shared **visual shell** for Dialog and Drawer (not an imperative hook).

### `AppDialog.tsx`

MUI `Dialog` shell with:

- Title + optional close button
- Consistent `DialogContent` padding
- `actions` — footer buttons
- `variant`: `default` | `emphasis`

**Used by:** `PersonDetailModal`, `ConfirmDialog`

### `AppDrawer.tsx`

MUI `Drawer` shell with:

- Header (title + close)
- Scrollable body
- Optional `footer`

**Used by:** `PeopleSearchDrawer`

---

## Approximate z-index stacking

```text
Page content
  → Dialog / Drawer
    → Loading backdrop (modal + 1)
      → Toast (notistack)
```

---

## Next

→ [06-i18n-and-rtl.md](./06-i18n-and-rtl.md)
