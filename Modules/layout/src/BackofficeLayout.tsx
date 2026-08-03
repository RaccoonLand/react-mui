import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useRaccoonTheme } from '@raccoonland/theme'
import { LAYOUT_MOBILE_BREAKPOINT, SIDEBAR_WIDTH } from './constants'
import { LayoutHeader } from './Header'
import {
  LayoutSettingsProvider,
  useLayoutSettings,
  type LayoutSettingsProviderProps,
} from './LayoutSettingsContext'
import { LayoutShellProvider } from './LayoutShellContext'
import { SidebarHorizontal } from './SidebarHorizontal'
import { SidebarVertical } from './SidebarVertical'
import type { LayoutShellConfig } from './types'
import { layoutZIndex } from './zIndex'

export type BackofficeLayoutProps = LayoutShellConfig & {
  children?: ReactNode
  /** When set, renders children instead of react-router `<Outlet />`. */
  renderMain?: () => ReactNode
  orientationStorageKey?: LayoutSettingsProviderProps['orientationStorageKey']
  densityStorageKey?: LayoutSettingsProviderProps['densityStorageKey']
}

function BackofficeLayoutShell({
  children,
  renderMain,
}: {
  children?: ReactNode
  renderMain?: () => ReactNode
}) {
  const theme = useTheme()
  const raccoon = useRaccoonTheme()
  const location = useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down(LAYOUT_MOBILE_BREAKPOINT))
  const { orientation, density, cycleDensity } = useLayoutSettings()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)

  const useHorizontalNav = orientation === 'horizontal' && !isMobile

  useEffect(() => {
    setMobileOpen(false)
    setHeaderScrolled(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false)
    }
  }, [isMobile])

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((value) => !value)
      return
    }

    if (orientation === 'vertical') {
      cycleDensity()
    }
  }

  const closeMobileSidebar = () => setMobileOpen(false)

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        bgcolor: raccoon.background.default,
        backgroundImage: raccoon.shellGradient,
        ...(useHorizontalNav ? { flexDirection: 'column' } : { flexDirection: 'row' }),
      }}
    >
      {!isMobile && orientation === 'vertical' && (
        <Box sx={{ position: 'relative', zIndex: layoutZIndex.sidebar, flexShrink: 0 }}>
          <SidebarVertical density={density} variant="permanent" />
        </Box>
      )}

      <Drawer
        variant="temporary"
        anchor="left"
        open={isMobile && mobileOpen}
        onClose={closeMobileSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          zIndex: layoutZIndex.mobileDrawer,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            maxWidth: '86vw',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            bgcolor: raccoon.background.paper,
            borderInlineEnd: `1px solid ${raccoon.border.subtle}`,
          },
        }}
      >
        <SidebarVertical density="expanded" variant="drawer" onNavigate={closeMobileSidebar} />
      </Drawer>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <LayoutHeader
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          scrolled={headerScrolled}
          onToggleSidebar={handleToggleSidebar}
        />

        {useHorizontalNav && <SidebarHorizontal />}

        <Box
          component="main"
          onScroll={(event) => {
            setHeaderScrolled(event.currentTarget.scrollTop > 4)
          }}
          sx={{
            flex: 1,
            minHeight: 0,
            px: { xs: 1.5, md: 2 },
            pt: 0,
            pb: { xs: 1.5, md: 2 },
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {renderMain ? renderMain() : (children ?? <Outlet />)}
        </Box>
      </Box>
    </Box>
  )
}

/**
 * Full backoffice shell. Apps pass resolved navigation labels, brand, chrome
 * labels, and user info — i18n stays in the host application.
 */
export function BackofficeLayout({
  children,
  renderMain,
  orientationStorageKey,
  densityStorageKey,
  navigation,
  brand,
  direction,
  labels,
  settingsPath,
  user,
  onToggleLocale,
  header,
  headerActions,
}: BackofficeLayoutProps) {
  // Destructuring the individual fields (rather than spreading `...shell`) lets
  // React's dependency comparison see each memoized reference directly, so the
  // shell value only rebuilds when a real field changes — not on every parent
  // re-render.
  const shellValue = useMemo(
    () => ({
      navigation,
      brand,
      direction,
      labels,
      settingsPath,
      user,
      onToggleLocale,
      header,
      headerActions,
    }),
    [
      navigation,
      brand,
      direction,
      labels,
      settingsPath,
      user,
      onToggleLocale,
      header,
      headerActions,
    ],
  )

  return (
    <LayoutSettingsProvider
      orientationStorageKey={orientationStorageKey}
      densityStorageKey={densityStorageKey}
    >
      <LayoutShellProvider value={shellValue}>
        <BackofficeLayoutShell renderMain={renderMain}>{children}</BackofficeLayoutShell>
      </LayoutShellProvider>
    </LayoutSettingsProvider>
  )
}
