export type SidebarVerticalDensity = 'expanded' | 'compact' | 'collapsed'

export const DEFAULT_DENSITY_STORAGE_KEY = 'raccoonland-sidebar-density'

const DENSITY_ORDER: SidebarVerticalDensity[] = ['expanded', 'compact', 'collapsed']

export function readSidebarVerticalDensity(
  storageKey = DEFAULT_DENSITY_STORAGE_KEY,
): SidebarVerticalDensity {
  try {
    const stored = localStorage.getItem(storageKey)
    if (stored === 'compact' || stored === 'collapsed' || stored === 'expanded') {
      return stored
    }
    return 'expanded'
  } catch {
    return 'expanded'
  }
}

export function persistSidebarVerticalDensity(
  density: SidebarVerticalDensity,
  storageKey = DEFAULT_DENSITY_STORAGE_KEY,
) {
  try {
    localStorage.setItem(storageKey, density)
  } catch {
    // ignore storage errors
  }
}

/** expanded → compact → collapsed → expanded */
export function nextSidebarVerticalDensity(
  current: SidebarVerticalDensity,
): SidebarVerticalDensity {
  const index = DENSITY_ORDER.indexOf(current)
  return DENSITY_ORDER[(index + 1) % DENSITY_ORDER.length]!
}
