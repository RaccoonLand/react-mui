/**
 * Documented stacking order for the backoffice shell.
 * Prefer theme.zIndex values so overlays stay aligned with MUI defaults.
 */
export const layoutZIndex = {
  /** Docked desktop sidebar — below header */
  sidebar: 1,
  /** Sticky app header */
  header: (theme: { zIndex: { appBar: number } }) => theme.zIndex.appBar,
  /** Mobile navigation drawer — above header */
  mobileDrawer: (theme: { zIndex: { drawer: number } }) => theme.zIndex.drawer,
} as const
