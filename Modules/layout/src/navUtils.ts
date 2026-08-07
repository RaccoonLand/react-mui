import type { LayoutNavItem } from './types'

/** Shared path helpers only — no UI. Used by vertical and horizontal sidebars. */

/** Non-interactive visual divider — never active, never a link. */
export function isSeparatorItem(item: LayoutNavItem): boolean {
  return item.kind === 'separator'
}

export function isPathActive(currentPath: string, itemPath?: string) {
  if (!itemPath) {
    return false
  }

  if (itemPath === '/') {
    return currentPath === '/'
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}

export function isGroupActive(item: LayoutNavItem, currentPath: string): boolean {
  if (isSeparatorItem(item)) {
    return false
  }
  if (item.path && isPathActive(currentPath, item.path)) {
    return true
  }

  return item.children?.some((child) => isGroupActive(child, currentPath)) ?? false
}

export function hasActiveDescendant(item: LayoutNavItem, currentPath: string): boolean {
  return isGroupActive(item, currentPath)
}

export function getInitialExpandedGroups(
  navigation: LayoutNavItem[],
  pathname: string,
): Record<string, boolean> {
  const next: Record<string, boolean> = {}

  for (const item of navigation) {
    if (isSeparatorItem(item)) continue
    if (item.children && isGroupActive(item, pathname)) {
      next[item.key] = true
    }
  }

  return next
}
