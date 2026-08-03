import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@raccoonland/feedback'
import { useLayoutShell } from './LayoutShellContext'

function isApiFullscreen() {
  return typeof document !== 'undefined' && Boolean(document.fullscreenElement)
}

/**
 * Single fullscreen mechanism for the backoffice shell.
 * F11 is intercepted and routed through the Fullscreen API (same as the header button).
 */
export function useAppFullscreen() {
  const { labels } = useLayoutShell()
  const { showWarning } = useToast()
  const [isFullscreen, setIsFullscreen] = useState(isApiFullscreen)

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen()
      } else {
        showWarning(labels.fullscreenUnavailable)
      }
    } catch {
      showWarning(labels.fullscreenUnavailable)
    }
  }, [labels.fullscreenUnavailable, showWarning])

  useEffect(() => {
    const sync = () => setIsFullscreen(isApiFullscreen())
    document.addEventListener('fullscreenchange', sync)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'F11' && event.code !== 'F11') {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      void toggleFullscreen()
    }

    window.addEventListener('keydown', onKeyDown, true)

    return () => {
      document.removeEventListener('fullscreenchange', sync)
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [toggleFullscreen])

  return { isFullscreen, toggleFullscreen }
}
