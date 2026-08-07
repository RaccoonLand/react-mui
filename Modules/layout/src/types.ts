import type { SvgIconComponent } from '@mui/icons-material'
import type { ReactNode } from 'react'
import type { SidebarOrientation } from './sidebarOrientation'
import type { SidebarVerticalDensity } from './sidebarVerticalDensity'

/**
 * Navigation node — apps resolve i18n into `label` before passing.
 *
 * `kind`:
 * - `'link'` (default when omitted) — behaves as a `NavLink` (or a group when `children` are present).
 * - `'separator'` — non-interactive visual divider used to group subsystems in the sidebar.
 *   Renders `label` and/or `icon` when provided (both optional), or a plain rule when neither
 *   is set. Separators are **not** focusable, **not** selectable, have no active/selected
 *   styling, and never render as a link — `path`, `children`, `badge` are ignored.
 *   Visually smaller than link rows so they are clearly not clickable.
 */
export type LayoutNavItem = {
  key: string
  label: string
  path?: string
  icon?: SvgIconComponent
  badge?: number
  children?: LayoutNavItem[]
  kind?: 'link' | 'separator'
}

export type LayoutBrand = {
  title: string
  subtitle?: string
  footer?: string
}

export type LayoutUserInfo = {
  name: string
  role: string
  initials: string
}

export type LayoutChromeLabels = {
  searchPlaceholder: string
  openSearch: string
  headerSearchTitle: string
  openMenu: string
  closeMenu: string
  expandSidebar: string
  compactSidebar: string
  collapseSidebar: string
  layoutHorizontal: string
  layoutVertical: string
  themeLight: string
  themeDark: string
  enterFullscreen: string
  exitFullscreen: string
  fullscreenUnavailable: string
  notifications: string
  userMenu: string
  navProfile: string
  navSettings: string
  signOut: string
  signOutNotAvailable: string
  switchLocale: string
  targetLocaleCode: string
  /** Layout settings panel */
  layoutSettingsIntro: string
  layoutNavOrientation: string
  layoutNavOrientationHint: string
  layoutVerticalDesc: string
  layoutHorizontalDesc: string
  layoutHorizontalMobileHint: string
  layoutNavDensity: string
  layoutNavDensityHint: string
  layoutNavDensityDisabledHint: string
  layoutDensityExpanded: string
  layoutDensityExpandedDesc: string
  layoutDensityCompact: string
  layoutDensityCompactDesc: string
  layoutDensityCollapsed: string
  layoutDensityCollapsedDesc: string
  layoutTheme: string
  layoutThemeLightDesc: string
  layoutThemeDarkDesc: string
  layoutSettingsPersistHint: string
}

export type LayoutUserMenuItem = {
  key: string
  label: string
  icon?: ReactNode
  href?: string
  disabled?: boolean
  onClick?: () => void
  dividerBefore?: boolean
}

/**
 * Host-app control over the shell header.
 * All `show*` flags default to `true` (locale follows `onToggleLocale`).
 */
export type LayoutHeaderConfig = {
  showSearch?: boolean
  showThemeToggle?: boolean
  showFullscreen?: boolean
  showNotifications?: boolean
  showOrientationToggle?: boolean
  /** Defaults to `true` when `onToggleLocale` is provided. */
  showLocaleToggle?: boolean
  showUser?: boolean
  /** Rendered after sidebar/orientation toggles, before search. */
  startActions?: ReactNode
  /** Rendered after locale (or theme/fullscreen), before notifications. */
  endActions?: ReactNode
}

export type LayoutShellConfig = {
  navigation: LayoutNavItem[]
  brand: LayoutBrand
  direction: 'ltr' | 'rtl'
  labels: LayoutChromeLabels
  /** Path for the Settings item in the user menu (default `/settings/layout`). */
  settingsPath?: string
  user: {
    isLoading: boolean
    info: LayoutUserInfo | null
    menuItems?: LayoutUserMenuItem[]
  }
  onToggleLocale?: () => void
  /** Visibility flags and custom action slots for the header. */
  header?: LayoutHeaderConfig
  /**
   * @deprecated Prefer `header.endActions`.
   * Extra header toolbar actions (after language, before notifications).
   */
  headerActions?: ReactNode
}

export type { SidebarOrientation, SidebarVerticalDensity }
