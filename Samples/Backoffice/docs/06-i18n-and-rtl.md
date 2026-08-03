# 06 — i18n and RTL/LTR

---

## `src/i18n/messages.ts`

**Source of all UI strings** in two languages:

```ts
export const messages = {
  fa: { navDashboard: 'داشبورد', ... },
  en: { navDashboard: 'Dashboard', ... },
} as const
```

### `MessageKey`

TypeScript type = keys defined under `fa`. Wrong keys fail at compile time.

### Placeholders in strings

```ts
confirmDeletePersonMessage: 'Are you sure you want to delete {name}?'
```

` t('confirmDeletePersonMessage', { name: 'Jane Doe' })` replaces `{name}`.

---

## `src/i18n/LocaleProvider.tsx`

### State

- `locale`: `'fa' | 'en'` — default `'fa'`
- `direction`: `'rtl' | 'ltr'` — derived from locale

### API

| Member | Job |
|--------|-----|
| `t(key, params?)` | Translate |
| `toggleLocale()` | fa ↔ en |
| `setLocale('en')` | Set directly |
| `locale`, `direction` | Read current values |

### `useEffect`

On `<html>`:

```ts
document.documentElement.lang = locale
document.documentElement.dir = direction
```

Useful for SEO and logical CSS properties.

### `useLocale()`

Any component that shows text should use this hook.

---

## RTL in practice — three layers

| Layer | File | Job |
|-------|------|-----|
| HTML | LocaleProvider | `dir="rtl"` |
| MUI CSS | DirectionProvider | stylis RTL plugin |
| UI logic | Header, Toast, … | `insetInlineStart` instead of `left` |

**Rule:** In `sx`, prefer `marginInlineStart`, `paddingInlineEnd`, `borderInlineStart` so layout works in both directions.

---

## Where language is toggled

`layout/Header.tsx` — Language button → `toggleLocale()`.

---

## Adding a new string

1. Add the key to **both** `fa` and `en` in `messages.ts`
2. In a component: `t('myNewKey')`

---

## Next

→ [07-theme.md](./07-theme.md)
