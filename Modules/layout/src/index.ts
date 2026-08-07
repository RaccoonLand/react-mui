export type {
  LayoutBrand,
  LayoutChromeLabels,
  LayoutHeaderConfig,
  LayoutNavItem,
  LayoutShellConfig,
  LayoutUserInfo,
  LayoutUserMenuItem,
  SidebarOrientation,
  SidebarVerticalDensity,
} from './types'

export {
  SIDEBAR_WIDTH,
  SIDEBAR_COMPACT_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
  HEADER_HEIGHT,
  HORIZONTAL_NAV_HEIGHT,
  HORIZONTAL_SHELL_TOP,
  LAYOUT_MOBILE_BREAKPOINT,
  shellHeaderSx,
} from './constants'

export { layoutZIndex } from './zIndex'

export {
  isPathActive,
  isGroupActive,
  hasActiveDescendant,
  getInitialExpandedGroups,
  isSeparatorItem,
} from './navUtils'

export {
  LayoutSettingsProvider,
  useLayoutSettings,
} from './LayoutSettingsContext'
export type { LayoutSettingsProviderProps } from './LayoutSettingsContext'

export { LayoutShellProvider, useLayoutShell } from './LayoutShellContext'

export { SidebarVertical } from './SidebarVertical'
export type { SidebarVerticalProps } from './SidebarVertical'

export { SidebarHorizontal } from './SidebarHorizontal'

export { LayoutHeader } from './Header'
export type { LayoutHeaderProps } from './Header'

export { BackofficeLayout } from './BackofficeLayout'
export type { BackofficeLayoutProps } from './BackofficeLayout'

export { LayoutSettingsPanel } from './LayoutSettingsPanel'

export { useAppFullscreen } from './useAppFullscreen'

export {
  readSidebarOrientation,
  persistSidebarOrientation,
  DEFAULT_ORIENTATION_STORAGE_KEY,
} from './sidebarOrientation'

export {
  readSidebarVerticalDensity,
  persistSidebarVerticalDensity,
  nextSidebarVerticalDensity,
  DEFAULT_DENSITY_STORAGE_KEY,
} from './sidebarVerticalDensity'
