export type SidebarOrientation = 'vertical' | 'horizontal'

export const DEFAULT_ORIENTATION_STORAGE_KEY = 'raccoonland-sidebar-orientation'

export function readSidebarOrientation(
  storageKey = DEFAULT_ORIENTATION_STORAGE_KEY,
): SidebarOrientation {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored === 'horizontal' ? 'horizontal' : 'vertical'
  } catch {
    return 'vertical'
  }
}

export function persistSidebarOrientation(
  orientation: SidebarOrientation,
  storageKey = DEFAULT_ORIENTATION_STORAGE_KEY,
) {
  try {
    localStorage.setItem(storageKey, orientation)
  } catch {
    // ignore storage errors
  }
}
