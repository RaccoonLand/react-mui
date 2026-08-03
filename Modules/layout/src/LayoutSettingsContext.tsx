import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_ORIENTATION_STORAGE_KEY,
  persistSidebarOrientation,
  readSidebarOrientation,
  type SidebarOrientation,
} from './sidebarOrientation'
import {
  DEFAULT_DENSITY_STORAGE_KEY,
  nextSidebarVerticalDensity,
  persistSidebarVerticalDensity,
  readSidebarVerticalDensity,
  type SidebarVerticalDensity,
} from './sidebarVerticalDensity'

type LayoutSettingsContextValue = {
  orientation: SidebarOrientation
  setOrientation: (next: SidebarOrientation) => void
  toggleOrientation: () => void
  density: SidebarVerticalDensity
  setDensity: (next: SidebarVerticalDensity) => void
  cycleDensity: () => void
}

const LayoutSettingsContext = createContext<LayoutSettingsContextValue | null>(null)

export type LayoutSettingsProviderProps = {
  children: ReactNode
  /** Override localStorage key for orientation (multi-app same origin). */
  orientationStorageKey?: string
  /** Override localStorage key for vertical density. */
  densityStorageKey?: string
}

/**
 * Shared layout preferences (orientation + vertical density).
 * Used by the shell header shortcuts and LayoutSettingsPanel.
 */
export function LayoutSettingsProvider({
  children,
  orientationStorageKey = DEFAULT_ORIENTATION_STORAGE_KEY,
  densityStorageKey = DEFAULT_DENSITY_STORAGE_KEY,
}: LayoutSettingsProviderProps) {
  const [orientation, setOrientationState] = useState<SidebarOrientation>(() =>
    readSidebarOrientation(orientationStorageKey),
  )
  const [density, setDensityState] = useState<SidebarVerticalDensity>(() =>
    readSidebarVerticalDensity(densityStorageKey),
  )

  const setOrientation = useCallback(
    (next: SidebarOrientation) => {
      setOrientationState(next)
      persistSidebarOrientation(next, orientationStorageKey)
    },
    [orientationStorageKey],
  )

  const setDensity = useCallback(
    (next: SidebarVerticalDensity) => {
      setDensityState(next)
      persistSidebarVerticalDensity(next, densityStorageKey)
    },
    [densityStorageKey],
  )

  const toggleOrientation = useCallback(() => {
    setOrientation(orientation === 'vertical' ? 'horizontal' : 'vertical')
  }, [orientation, setOrientation])

  const cycleDensity = useCallback(() => {
    setDensity(nextSidebarVerticalDensity(density))
  }, [density, setDensity])

  const value = useMemo(
    () => ({
      orientation,
      setOrientation,
      toggleOrientation,
      density,
      setDensity,
      cycleDensity,
    }),
    [orientation, setOrientation, toggleOrientation, density, setDensity, cycleDensity],
  )

  return (
    <LayoutSettingsContext.Provider value={value}>{children}</LayoutSettingsContext.Provider>
  )
}

export function useLayoutSettings() {
  const context = useContext(LayoutSettingsContext)
  if (!context) {
    throw new Error('useLayoutSettings must be used within LayoutSettingsProvider')
  }
  return context
}
