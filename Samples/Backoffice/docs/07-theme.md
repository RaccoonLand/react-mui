# 07 — Theme

Folder `src/theme/` configures MUI appearance for the RaccoonLand brand.

---

## `tokens.ts`

**Source of truth for colors** — separate from raw MUI palette.

Includes (summary):

| Group | Examples |
|-------|----------|
| `background` | default, paper, elevated, header |
| `primary` | purple accent |
| `secondary` | muted gray/purple |
| `border` | subtle, glow |
| `text` | primary, secondary |
| `nav` | activeBg, activeBorder for menu |
| `input` | field border in dark mode |
| `overlay` | backdrop background |

`getRaccoonTokens(mode)` — `mode` is `'dark' | 'light'`.

---

## `palette.ts`

Re-exports from `tokens` for older import paths.

---

## `createRaccoonTheme.ts`

Function **`createRaccoonTheme(direction, mode)`**:

1. Loads tokens
2. Builds MUI theme with palette, typography, component overrides
3. Sets `direction` on the theme

**Typography:** Vazirmatn for Persian, Inter for English (as configured).

**Override examples:** Snackbar, Button, TableCell, …

---

## `ThemeModeProvider.tsx`

- State: `mode` = `'dark' | 'light'`
- `toggleMode()` — called from Header
- Context only; actual theme is created in `AppProviders`

---

## `useRaccoonTheme.ts`

```ts
const raccoon = useRaccoonTheme()
// raccoon.background.elevated
// raccoon.border.subtle
```

Typed access to custom tokens on `theme.raccoon` (declared in `theme.d.ts`).

**Why?** Change `#1a1a24` in one place instead of hardcoding in every file.

---

## `theme.d.ts`

Extends MUI types:

```ts
interface Theme {
  raccoon: RaccoonTokens
}
```

TypeScript knows `theme.raccoon` exists.

---

## Theme change flow

```text
User clicks theme toggle
  → ThemeModeProvider.toggleMode()
    → AppProviders rebuilds createRaccoonTheme
      → All MUI components update
```

---

## Next

→ [08-layout.md](./08-layout.md)
