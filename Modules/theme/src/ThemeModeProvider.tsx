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
import type { ThemeMode } from './tokens'

const DEFAULT_STORAGE_KEY = 'raccoonland-theme-mode'

export type PreferredThemeMode = ThemeMode | 'system'

type ThemeModeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

function readSystemMode(): ThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredMode(storageKey: string): ThemeMode | null {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
    return null
  } catch {
    return null
  }
}

function persistMode(storageKey: string, mode: ThemeMode) {
  try {
    localStorage.setItem(storageKey, mode)
  } catch {
    // ignore storage errors
  }
}

export type ThemeModeProviderProps = {
  children: ReactNode
  /**
   * Initial mode when nothing is stored yet. `'system'` reads
   * `prefers-color-scheme` and reacts to OS changes until the user picks a
   * mode manually. Defaults to `'system'`.
   */
  defaultMode?: PreferredThemeMode
  /**
   * Storage key used to persist the user's manual choice. Change this when
   * running multiple apps on the same origin. Defaults to
   * `'raccoonland-theme-mode'`.
   */
  storageKey?: string
}

export function ThemeModeProvider({
  children,
  defaultMode = 'system',
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeModeProviderProps) {
  const initialMode = (): ThemeMode => {
    const stored = readStoredMode(storageKey)
    if (stored) {
      return stored
    }
    if (defaultMode === 'system') {
      return readSystemMode()
    }
    return defaultMode
  }

  const [mode, setModeState] = useState<ThemeMode>(initialMode)
  // Track whether the user has explicitly picked a mode. Until they do, we
  // keep tracking the system preference when `defaultMode === 'system'`.
  const userChoseRef = useRef<boolean>(readStoredMode(storageKey) !== null)

  const setMode = useCallback(
    (next: ThemeMode) => {
      userChoseRef.current = true
      setModeState(next)
      persistMode(storageKey, next)
    },
    [storageKey],
  )

  const toggleMode = useCallback(() => {
    userChoseRef.current = true
    setModeState((current) => {
      const next: ThemeMode = current === 'dark' ? 'light' : 'dark'
      persistMode(storageKey, next)
      return next
    })
  }, [storageKey])

  // Cross-tab sync — react to writes/removes from other tabs.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return
      }

      if (event.newValue === 'light' || event.newValue === 'dark') {
        userChoseRef.current = true
        setModeState((current) => (current === event.newValue ? current : (event.newValue as ThemeMode)))
        return
      }

      // Key cleared → fall back to system / default.
      userChoseRef.current = false
      setModeState(defaultMode === 'system' ? readSystemMode() : defaultMode)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [storageKey, defaultMode])

  // Follow OS changes while the user hasn't picked a mode manually.
  useEffect(() => {
    if (defaultMode !== 'system' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (userChoseRef.current) {
        return
      }
      setModeState(event.matches ? 'dark' : 'light')
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [defaultMode])

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode],
  )

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  }
  return context
}
