export const SIDEBAR_WIDTH = 252
/** Parent icon + label; narrower than expanded; children open via flyout. */
export const SIDEBAR_COMPACT_WIDTH = 168
export const SIDEBAR_COLLAPSED_WIDTH = 68
export const HEADER_HEIGHT = 56
export const HORIZONTAL_NAV_HEIGHT = 44
export const LAYOUT_MOBILE_BREAKPOINT = 'md' as const

/** Shared shell header styles — sidebar brand row + page header */
export const shellHeaderSx = {
  height: HEADER_HEIGHT,
  minHeight: HEADER_HEIGHT,
  maxHeight: HEADER_HEIGHT,
  flexShrink: 0,
  px: 1.5,
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
} as const

export const HORIZONTAL_SHELL_TOP = HEADER_HEIGHT + HORIZONTAL_NAV_HEIGHT
