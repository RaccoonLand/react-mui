import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material'
import { useRaccoonTheme } from '@raccoonland/theme'

const LOADING_MIN_VISIBLE_MS = 50

export type LoadingScope = 'global' | 'local'

export type WithLoadingOptions = {
  scope?: LoadingScope
  message?: string
}

type LoadingContextValue = {
  withLoading: <T>(action: () => Promise<T>, options?: WithLoadingOptions) => Promise<T>
  /**
   * `true` while the global backdrop is (or is about to be) visible.
   * Prefer this for gating buttons that trigger global-scope actions —
   * unrelated `scope: 'local'` work will NOT flip this signal.
   */
  isLoading: boolean
  /** Total in-flight operations across all scopes. Useful for e2e tests / debug. */
  isAnyLoading: boolean
}

const LoadingContext = createContext<LoadingContextValue | null>(null)

type LoadingProviderProps = {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [pendingCount, setPendingCount] = useState(0)
  const [globalVisible, setGlobalVisible] = useState(false)
  const [globalMessage, setGlobalMessage] = useState<string | null>(null)
  const globalCountRef = useRef(0)
  const globalShownAtRef = useRef<number | null>(null)
  const globalLoadSeqRef = useRef(0)
  const globalLoadsRef = useRef<Map<number, string | undefined>>(new Map())
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const raccoon = useRaccoonTheme()

  const syncGlobalMessage = useCallback(() => {
    const messages = Array.from(globalLoadsRef.current.values()).filter(
      (message): message is string => Boolean(message),
    )
    setGlobalMessage(messages.at(-1) ?? null)
  }, [])

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  // Unmount must cancel a pending hide timer so it cannot setState after teardown.
  useEffect(() => {
    return () => {
      clearHideTimer()
    }
  }, [clearHideTimer])

  const showGlobalBackdrop = useCallback(() => {
    clearHideTimer()
    if (globalCountRef.current === 1) {
      globalShownAtRef.current = Date.now()
      setGlobalVisible(true)
    }
  }, [clearHideTimer])

  const scheduleHideGlobalBackdrop = useCallback(() => {
    if (globalCountRef.current > 0) {
      return
    }

    const shownAt = globalShownAtRef.current ?? Date.now()
    const delay = Math.max(0, LOADING_MIN_VISIBLE_MS - (Date.now() - shownAt))

    clearHideTimer()
    hideTimerRef.current = setTimeout(() => {
      hideTimerRef.current = null
      if (globalCountRef.current === 0) {
        setGlobalVisible(false)
        setGlobalMessage(null)
        globalShownAtRef.current = null
      }
    }, delay)
  }, [clearHideTimer])

  const withLoading = useCallback(
    async <T,>(action: () => Promise<T>, options?: WithLoadingOptions) => {
      const scope = options?.scope ?? 'global'
      const loadId = scope === 'global' ? ++globalLoadSeqRef.current : null

      setPendingCount((count) => count + 1)

      if (scope === 'global' && loadId !== null) {
        globalLoadsRef.current.set(loadId, options?.message)
        globalCountRef.current += 1
        syncGlobalMessage()
        showGlobalBackdrop()
      }

      try {
        return await action()
      } finally {
        setPendingCount((count) => Math.max(0, count - 1))

        if (scope === 'global' && loadId !== null) {
          globalLoadsRef.current.delete(loadId)
          globalCountRef.current = Math.max(0, globalCountRef.current - 1)
          syncGlobalMessage()
          scheduleHideGlobalBackdrop()
        }
      }
    },
    [scheduleHideGlobalBackdrop, showGlobalBackdrop, syncGlobalMessage],
  )

  const value = useMemo<LoadingContextValue>(
    () => ({
      withLoading,
      // Global-only. Unrelated local-scope work will NOT toggle this,
      // which avoids spurious button-disable side effects for consumers.
      isLoading: globalVisible,
      isAnyLoading: pendingCount > 0,
    }),
    [withLoading, globalVisible, pendingCount],
  )

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <Backdrop
        open={globalVisible}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 1,
          bgcolor: raccoon.overlay,
          backdropFilter: 'blur(2px)',
        }}
      >
        <Stack spacing={2} sx={{ alignItems: 'center', px: 2, maxWidth: 320 }}>
          <CircularProgress sx={{ color: raccoon.primary.main }} />
          {globalMessage && (
            <Typography
              variant="body2"
              color="inherit"
              textAlign="center"
              aria-live="polite"
              sx={{ opacity: 0.92 }}
            >
              {globalMessage}
            </Typography>
          )}
        </Stack>
      </Backdrop>
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}
