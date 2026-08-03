import { Alert, Button, Paper, Stack, Typography } from '@mui/material'
import { Page } from '@raccoonland/page'
import { useRaccoonTheme, useThemeMode } from '@raccoonland/theme'
import { packageGuideBreadcrumbs } from '../../layout/breadcrumbIcons'
import { useLocale } from '../../i18n/LocaleProvider'
import { GuideUsageSection } from './GuideUsageSection'

const THEME_USAGE_CODE = `import { CssBaseline, ThemeProvider } from '@mui/material'
import {
  createRaccoonTheme,
  ThemeModeProvider,
  useRaccoonTheme,
  useThemeMode,
} from '@raccoonland/theme'

// 1) Wrap the app once. defaultMode = 'system' picks light/dark from the OS
//    until the user explicitly toggles; storageKey isolates apps sharing an
//    origin (e.g. /admin and /portal).
export function AppRoot({ children }: { children: React.ReactNode }) {
  return (
    <ThemeModeProvider defaultMode="system" storageKey="my-app-theme">
      <ThemedApp>{children}</ThemedApp>
    </ThemeModeProvider>
  )
}

function ThemedApp({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode()
  const theme = createRaccoonTheme('rtl', mode)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

// 2) useRaccoonTheme throws a clear error if the app forgot to install
//    a raccoon theme — no more "Cannot read properties of undefined".
export function ThemeToolbar() {
  const { mode, setMode, toggleMode } = useThemeMode()
  const raccoon = useRaccoonTheme() // typed via module augmentation

  return (
    <>
      <button type="button" onClick={toggleMode}>
        Toggle ({mode})
      </button>
      <button type="button" onClick={() => setMode('light')}>Light</button>
      <button type="button" onClick={() => setMode('dark')}>Dark</button>
      <span style={{ color: raccoon.primary.main }}>
        primary: {raccoon.primary.main}
      </span>
    </>
  )
}`

export function ThemeGuidePage() {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()
  const { mode, setMode, toggleMode } = useThemeMode()

  return (
    <Page
      title={t('guideThemeTitle')}
      direction={direction}
      breadcrumbs={packageGuideBreadcrumbs(t, 'theme')}
    >
      <Stack spacing={2}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: raccoon.background.elevated, border: `1px solid ${raccoon.border.subtle}` }}>
          <Typography variant="body2" color="text.secondary">
            {t('guideThemeBody')}
          </Typography>
        </Paper>

        <GuideUsageSection
          description={t('guideUsageDescription')}
          demo={
            <Stack spacing={1.5}>
              <Alert severity="info">
                Current mode: <strong>{mode}</strong> · direction: <strong>{direction}</strong>
              </Alert>
              <Alert severity="success">
                <code>defaultMode=&quot;system&quot;</code> follows OS preference until you pick a mode.
                Storage key isolates apps on the same origin.
              </Alert>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button variant="contained" onClick={toggleMode}>
                  Toggle mode
                </Button>
                <Button variant="outlined" onClick={() => setMode('light')}>
                  Force light
                </Button>
                <Button variant="outlined" onClick={() => setMode('dark')}>
                  Force dark
                </Button>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Stack
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: raccoon.primary.main,
                    border: `1px solid ${raccoon.border.glow}`,
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                  {raccoon.primary.main}
                </Typography>
              </Stack>
            </Stack>
          }
          code={THEME_USAGE_CODE}
        />
      </Stack>
    </Page>
  )
}
