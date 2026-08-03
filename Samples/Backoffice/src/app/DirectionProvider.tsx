import createCache, { type EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { useRef, type ReactNode } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import { ltrStylisPlugins, rtlStylisPlugins } from './emotionCache'

type DirectionProviderProps = {
  children: ReactNode
}

// Cache one emotion instance per direction for the lifetime of the app,
// so toggling locale back-and-forth does not throw away every injected style.
export function DirectionProvider({ children }: DirectionProviderProps) {
  const { direction } = useLocale()
  const cachesRef = useRef<{ ltr: EmotionCache | null; rtl: EmotionCache | null }>({
    ltr: null,
    rtl: null,
  })

  const key = direction === 'rtl' ? 'rtl' : 'ltr'
  let cache = cachesRef.current[key]
  if (!cache) {
    cache = createCache({
      key: direction === 'rtl' ? 'muirtl' : 'muiltr',
      stylisPlugins: direction === 'rtl' ? rtlStylisPlugins : ltrStylisPlugins,
    })
    cachesRef.current[key] = cache
  }

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
