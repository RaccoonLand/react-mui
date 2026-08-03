import { createTheme, type Direction, type Theme, type ThemeOptions } from '@mui/material/styles'
import { getRaccoonTokens, type RaccoonTokens, type ThemeMode } from './tokens'

// Module augmentation lives next to the code that produces `theme.raccoon`,
// so any consumer that imports from `@raccoonland/theme` picks it up
// automatically — no phantom `.d.ts` side-effect import required.
declare module '@mui/material/styles' {
  interface Theme {
    raccoon: RaccoonTokens
  }

  interface ThemeOptions {
    raccoon?: RaccoonTokens
  }
}

const themeCache = new Map<string, Theme>()

export function createRaccoonTheme(
  direction: Direction,
  mode: ThemeMode,
  overrides?: ThemeOptions,
) {
  const cacheKey = `${direction}:${mode}`

  if (!overrides) {
    const cached = themeCache.get(cacheKey)
    if (cached) {
      return cached
    }
  }

  const tokens = getRaccoonTokens(mode)

  const fontFamily =
    direction === 'rtl'
      ? '"Vazirmatn", "Inter", system-ui, sans-serif'
      : '"Inter", "Vazirmatn", system-ui, sans-serif'

  // `overrides` is passed as a second argument so `createTheme`'s internal
  // deepmerge is used. Spreading it into the same object would replace whole
  // top-level slices (e.g. an override on `palette.primary` would wipe out
  // `secondary`, `background`, `text`, etc.).
  const theme = createTheme(
    {
      direction,
      raccoon: tokens,
      palette: {
        mode,
        primary: tokens.primary,
        secondary: tokens.secondary,
        background: {
          default: tokens.background.default,
          paper: tokens.background.paper,
        },
        text: {
          primary: tokens.text.primary,
          secondary: tokens.text.secondary,
          disabled: tokens.text.disabled,
        },
        divider: tokens.divider,
        error: tokens.error,
        success: tokens.success,
      },
      typography: {
        fontFamily,
        fontSize: 13,
        h4: { fontSize: '1.35rem', fontWeight: 600, letterSpacing: direction === 'ltr' ? '-0.02em' : 0 },
        h5: { fontSize: '1.1rem', fontWeight: 600 },
        h6: { fontSize: '1rem', fontWeight: 600 },
        body1: { fontSize: '0.875rem' },
        body2: { fontSize: '0.8125rem' },
        caption: { fontSize: '0.75rem' },
        button: { textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem' },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: tokens.background.default,
              scrollbarColor: `${tokens.primary.dark} ${tokens.background.paper}`,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              border: `1px solid ${tokens.border.subtle}`,
            },
          },
        },
        MuiButton: {
          defaultProps: {
            size: 'small',
          },
          styleOverrides: {
            root: {
              minHeight: 32,
              paddingInline: 10,
              '&.MuiButton-containedPrimary': {
                background: `linear-gradient(135deg, ${tokens.primary.main}, ${tokens.primary.dark})`,
                boxShadow: `0 0 16px ${tokens.border.glow}`,
              },
              '&.MuiButton-containedSecondary': {
                background: tokens.secondary.main,
                boxShadow: 'none',
                '&:hover': {
                  background: tokens.secondary.dark,
                },
              },
              '&.MuiButton-outlinedSecondary': {
                borderColor: tokens.border.subtle,
                color: tokens.text.secondary,
                '&:hover': {
                  borderColor: tokens.secondary.main,
                  bgcolor: `${tokens.secondary.main}14`,
                },
              },
              '&.MuiButton-containedSuccess': {
                background: tokens.success.main,
                boxShadow: 'none',
                '&:hover': {
                  background: mode === 'dark' ? '#16a34a' : '#15803d',
                },
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              backgroundColor: tokens.input.bg,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: tokens.input.border,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: tokens.input.borderHover,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: tokens.input.borderFocus,
                borderWidth: 1,
              },
              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: tokens.error.main,
              },
              '&.Mui-disabled': {
                backgroundColor: tokens.background.paper,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: tokens.border.subtle,
                },
              },
            },
            input: {
              color: tokens.text.primary,
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              color: tokens.text.secondary,
              '&.Mui-focused:not(.Mui-error)': {
                color: tokens.primary.main,
              },
              '&.Mui-error': {
                color: tokens.error.main,
              },
            },
          },
        },
        MuiFormHelperText: {
          styleOverrides: {
            root: {
              marginTop: 4,
              marginInlineStart: 0,
              marginInlineEnd: 0,
              fontSize: '0.75rem',
              lineHeight: 1.35,
              '&.Mui-error': {
                color: tokens.error.main,
                fontWeight: 500,
              },
            },
          },
        },
        MuiTextField: {
          defaultProps: {
            size: 'small',
          },
        },
        MuiFormControl: {
          defaultProps: {
            size: 'small',
          },
        },
        MuiIconButton: {
          defaultProps: {
            size: 'small',
          },
        },
        MuiListItemButton: {
          styleOverrides: {
            root: {
              paddingBlock: 4,
            },
          },
        },
        MuiSnackbarContent: {
          styleOverrides: {
            root: {
              bgcolor: tokens.background.elevated,
              border: `1px solid ${tokens.border.subtle}`,
              color: tokens.text.primary,
            },
          },
        },
      },
    },
    ...(overrides ? [overrides] : []),
  )

  if (!overrides) {
    themeCache.set(cacheKey, theme)
  }

  return theme
}
