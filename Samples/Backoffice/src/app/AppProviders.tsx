import { QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { ConfirmProvider, LoadingProvider, ToastProvider } from '@raccoonland/feedback'
import { PipelineUiMessagesProvider, type PipelineUiMessages } from '@raccoonland/pipeline-client'
import { createRaccoonTheme, useThemeMode } from '@raccoonland/theme'
import { useEffect, useMemo, type ReactNode } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import { DirectionProvider } from './DirectionProvider'
import { PipelineHooksBridge } from './PipelineHooksBridge'
import { queryClient } from './queryClient'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const { direction, t } = useLocale()
  const { mode } = useThemeMode()

  const theme = useMemo(() => createRaccoonTheme(direction, mode), [direction, mode])

  // Warm the opposite (direction, mode) combos in the background so the first
  // user-triggered toggle hits the theme cache instead of paying createTheme()
  // cost synchronously on the main thread. Safe: `createRaccoonTheme` is pure
  // and memoized internally.
  useEffect(() => {
    const handle = window.setTimeout(() => {
      const otherMode = mode === 'dark' ? 'light' : 'dark'
      const otherDirection = direction === 'rtl' ? 'ltr' : 'rtl'
      createRaccoonTheme(direction, otherMode)
      createRaccoonTheme(otherDirection, mode)
      createRaccoonTheme(otherDirection, otherMode)
    }, 200)

    return () => window.clearTimeout(handle)
  }, [direction, mode])

  const pipelineMessages = useMemo<PipelineUiMessages>(
    () => ({
      networkError: t('networkError'),
      invalidPipelineResponse: t('invalidPipelineResponse'),
      unknownError: t('unknownError'),
    }),
    [t],
  )

  return (
    <DirectionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ToastProvider direction={direction} maxSnack={4} autoHideDuration={4000}>
            <LoadingProvider>
              <ConfirmProvider>
                <PipelineUiMessagesProvider messages={pipelineMessages}>
                  <PipelineHooksBridge>{children}</PipelineHooksBridge>
                </PipelineUiMessagesProvider>
              </ConfirmProvider>
            </LoadingProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </DirectionProvider>
  )
}
