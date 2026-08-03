import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Direction } from '@mui/material/styles'
import { messages, type Locale, type MessageKey } from './messages'

const DEFAULT_LOCALE: Locale = 'fa'
const STORAGE_KEY = 'raccoonland-sample-locale'

function formatMessage(template: string, params?: Record<string, string>) {
  if (!params) {
    return template
  }

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  )
}

function isLocale(value: unknown): value is Locale {
  return value === 'fa' || value === 'en'
}

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isLocale(stored) ? stored : null
  } catch {
    return null
  }
}

function persistLocale(next: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // ignore storage errors (private mode, disabled storage, etc.)
  }
}

type LocaleContextValue = {
  locale: Locale
  direction: Direction
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: MessageKey, params?: Record<string, string>) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const localeDirection: Record<Locale, Direction> = {
  fa: 'rtl',
  en: 'ltr',
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(
    () => readStoredLocale() ?? DEFAULT_LOCALE,
  )
  const direction = localeDirection[locale]

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocale(next)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => {
      const next: Locale = current === 'fa' ? 'en' : 'fa'
      persistLocale(next)
      return next
    })
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = direction
  }, [locale, direction])

  // Cross-tab sync — mirror the pattern used by ThemeModeProvider.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) {
        return
      }
      if (isLocale(event.newValue)) {
        setLocaleState((current) => (current === event.newValue ? current : (event.newValue as Locale)))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction,
      setLocale,
      toggleLocale,
      t: (key, params) => formatMessage(messages[locale][key], params),
    }),
    [locale, direction, setLocale, toggleLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}
