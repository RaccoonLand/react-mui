import { useTheme } from '@mui/material/styles'
import type { RaccoonTokens } from './tokens'

/**
 * Read `theme.raccoon` tokens. Throws with a clear message if the app forgot
 * to wrap with `<ThemeProvider theme={createRaccoonTheme(...)}>` — otherwise
 * downstream code would crash on `theme.raccoon.background.header` with an
 * opaque "Cannot read properties of undefined".
 */
export function useRaccoonTheme(): RaccoonTokens {
  const theme = useTheme()
  const raccoon = (theme as { raccoon?: RaccoonTokens }).raccoon
  if (!raccoon) {
    throw new Error(
      '@raccoonland/theme: theme.raccoon is missing. Wrap your app with ' +
        'MUI <ThemeProvider theme={createRaccoonTheme(direction, mode)}>.',
    )
  }
  return raccoon
}
