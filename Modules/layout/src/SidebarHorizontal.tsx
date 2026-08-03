import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  alpha,
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material'
import { useEffect, useState, type MouseEvent } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useRaccoonTheme } from '@raccoonland/theme'
import type { RaccoonTokens } from '@raccoonland/theme'
import { HORIZONTAL_NAV_HEIGHT } from './constants'
import { useLayoutShell } from './LayoutShellContext'
import { hasActiveDescendant, isPathActive } from './navUtils'
import type { LayoutNavItem } from './types'
import { layoutZIndex } from './zIndex'

/**
 * Horizontal sidebar styles — kept local to this file on purpose.
 * Do not share leaf/group sx helpers with SidebarVertical.
 */
function getHorizontalLeafSx(raccoon: RaccoonTokens, active: boolean) {
  return {
    minHeight: 32,
    px: 1.25,
    py: 0.5,
    borderRadius: 1,
    textTransform: 'none' as const,
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    color: active ? 'primary.main' : 'text.secondary',
    bgcolor: active ? raccoon.nav.activeBg : 'transparent',
    border: `1px solid ${active ? raccoon.nav.activeBorder : 'transparent'}`,
    boxShadow: active ? `inset 0 -2px 0 ${raccoon.primary.main}` : 'none',
    '&:hover': {
      bgcolor: active ? raccoon.nav.activeBg : alpha(raccoon.primary.main, 0.06),
    },
  }
}

function getHorizontalGroupSx(raccoon: RaccoonTokens, active: boolean, open: boolean) {
  return {
    minHeight: 32,
    px: 1.25,
    py: 0.5,
    borderRadius: 1,
    textTransform: 'none' as const,
    fontSize: 13,
    fontWeight: active || open ? 600 : 500,
    color: open ? 'primary.main' : active ? 'text.primary' : 'text.secondary',
    bgcolor: active || open ? raccoon.nav.activeGroupBg : 'transparent',
    border: `1px solid ${active || open ? raccoon.border.subtle : 'transparent'}`,
    '&:hover': {
      bgcolor: raccoon.nav.activeGroupBg,
    },
  }
}

function HorizontalGroupItem({ item }: { item: LayoutNavItem }) {
  const { direction } = useLayoutShell()
  const raccoon = useRaccoonTheme()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const Icon = item.icon
  const groupActive = hasActiveDescendant(item, location.pathname)
  const menuPlacement = direction === 'rtl' ? 'right' : 'left'

  useEffect(() => {
    setAnchorEl(null)
  }, [location.pathname])

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : undefined}
        startIcon={Icon ? <Icon sx={{ fontSize: 16 }} /> : undefined}
        endIcon={<ExpandMoreIcon sx={{ fontSize: 16, opacity: 0.7 }} />}
        sx={getHorizontalGroupSx(raccoon, groupActive, open)}
      >
        {item.label}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: menuPlacement }}
        transformOrigin={{ vertical: 'top', horizontal: menuPlacement }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              minWidth: 200,
              bgcolor: raccoon.background.elevated,
              border: `1px solid ${raccoon.border.subtle}`,
            },
          },
        }}
      >
        {item.children?.map((child) => {
          const ChildIcon = child.icon
          const childActive = isPathActive(location.pathname, child.path)

          return (
            <MenuItem
              key={child.key}
              component={NavLink}
              to={child.path ?? '/'}
              onClick={handleClose}
              selected={childActive}
              sx={{
                gap: 1,
                minHeight: 36,
                fontSize: 13,
                ...(childActive && {
                  bgcolor: raccoon.nav.activeBg,
                  color: 'primary.main',
                  fontWeight: 700,
                }),
              }}
            >
              {ChildIcon && <ChildIcon sx={{ fontSize: 16, color: 'inherit' }} />}
              <Box sx={{ flex: 1, minWidth: 0 }}>{child.label}</Box>
              {child.badge !== undefined && (
                <Badge badgeContent={child.badge} color="primary" sx={{ marginInlineStart: 1 }} />
              )}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

function HorizontalLeafItem({ item }: { item: LayoutNavItem }) {
  
  const raccoon = useRaccoonTheme()
  const location = useLocation()
  const Icon = item.icon
  const active = isPathActive(location.pathname, item.path)

  return (
    <Button
      component={NavLink}
      to={item.path ?? '/'}
      end={item.path === '/'}
      startIcon={Icon ? <Icon sx={{ fontSize: 16 }} /> : undefined}
      sx={getHorizontalLeafSx(raccoon, active)}
    >
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
        {item.label}
        {item.badge !== undefined && (
          <Badge
            badgeContent={item.badge}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                position: 'static',
                transform: 'none',
                fontSize: 10,
                minWidth: 16,
                height: 16,
              },
            }}
          />
        )}
      </Box>
    </Button>
  )
}

/**
 * Top navigation bar for horizontal layout mode.
 * Intentionally separate from SidebarVertical — no shared UI helpers.
 */
export function SidebarHorizontal() {
  const { navigation } = useLayoutShell()
  const raccoon = useRaccoonTheme()

  return (
    <Box
      component="nav"
      aria-label="Primary"
      sx={{
        height: HORIZONTAL_NAV_HEIGHT,
        minHeight: HORIZONTAL_NAV_HEIGHT,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        px: { xs: 1, md: 1.5 },
        bgcolor: raccoon.background.paper,
        borderBottom: `1px solid ${raccoon.border.subtle}`,
        position: 'relative',
        zIndex: layoutZIndex.sidebar,
        // Keep clear of the sticky app header stacking context.
        top: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: 'center',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          width: '100%',
          py: 0.5,
          scrollbarWidth: 'thin',
        }}
      >
        {navigation.map((item) =>
          item.children?.length ? (
            <HorizontalGroupItem key={item.key} item={item} />
          ) : (
            <HorizontalLeafItem key={item.key} item={item} />
          ),
        )}
      </Stack>
    </Box>
  )
}

export { HORIZONTAL_NAV_HEIGHT }
