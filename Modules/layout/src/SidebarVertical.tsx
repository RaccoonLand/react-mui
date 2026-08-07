import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import HexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined'
import CodeIcon from '@mui/icons-material/Code'
import {
  alpha,
  Badge,
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect, useState, type MouseEvent } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useRaccoonTheme } from '@raccoonland/theme'
import type { RaccoonTokens } from '@raccoonland/theme'
import {
  shellHeaderSx,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_COMPACT_WIDTH,
  SIDEBAR_WIDTH,
} from './constants'
import { useLayoutShell } from './LayoutShellContext'
import {
  getInitialExpandedGroups,
  hasActiveDescendant,
  isPathActive,
  isSeparatorItem,
} from './navUtils'
import type { SidebarVerticalDensity } from './sidebarVerticalDensity'
import type { LayoutNavItem } from './types'

export type SidebarVerticalProps = {
  /**
   * - `expanded` — full width; nested children inline
   * - `compact` — narrower; parent icon + label; children via flyout (like collapsed)
   * - `collapsed` — icon-only rail
   */
  density?: SidebarVerticalDensity
  onNavigate?: () => void
  /** permanent = desktop dock, drawer = inside mobile Drawer */
  variant?: 'permanent' | 'drawer'
}

const activeIndicatorBase = {
  content: '""',
  position: 'absolute',
  top: 6,
  bottom: 6,
  borderRadius: 999,
  bgcolor: 'primary.main',
  insetInlineEnd: 0,
} as const

function getActiveLeafSx(raccoon: RaccoonTokens, nested = false) {
  return {
    bgcolor: raccoon.nav.activeBg,
    border: `1px solid ${raccoon.nav.activeBorder}`,
    color: 'primary.main',
    '&::before': {
      ...activeIndicatorBase,
      width: raccoon.nav.activeIndicatorWidth,
      boxShadow: `0 0 12px ${raccoon.border.glow}`,
      ...(nested
        ? { insetInlineStart: 0, insetInlineEnd: 'auto' }
        : { insetInlineEnd: 0 }),
    },
  }
}

/**
 * Parent / group row when a descendant is selected.
 * Must stay visually distinct from the selected leaf (`getActiveLeafSx`).
 */
function getActiveGroupSx(raccoon: RaccoonTokens) {
  return {
    position: 'relative' as const,
    bgcolor: raccoon.nav.activeGroupBg,
    border: `1px solid ${raccoon.border.subtle}`,
    color: 'text.primary',
    '&::before': {
      ...activeIndicatorBase,
      width: 2,
      insetInlineStart: 0,
      insetInlineEnd: 'auto',
      bgcolor: raccoon.primary.main,
      opacity: 0.4,
      boxShadow: 'none',
    },
  }
}

function densityWidth(density: SidebarVerticalDensity) {
  if (density === 'collapsed') {
    return SIDEBAR_COLLAPSED_WIDTH
  }
  if (density === 'compact') {
    return SIDEBAR_COMPACT_WIDTH
  }
  return SIDEBAR_WIDTH
}

/**
 * Flyout for group children — used by both `collapsed` (icon-only trigger)
 * and `compact` (icon + parent label trigger).
 */
function GroupFlyout({
  item,
  density,
  onNavigate,
}: {
  item: LayoutNavItem
  density: 'collapsed' | 'compact'
  onNavigate?: () => void
}) {
  const { direction } = useLayoutShell()
  const raccoon = useRaccoonTheme()
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const Icon = item.icon
  const menuPlacement = direction === 'rtl' ? 'left' : 'right'
  const tooltipPlacement = direction === 'rtl' ? 'left' : 'right'
  const active = hasActiveDescendant(item, location.pathname)
  const showLabel = density === 'compact'

  useEffect(() => {
    setAnchorEl(null)
  }, [location.pathname])

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChildNavigate = () => {
    handleClose()
    onNavigate?.()
  }

  return (
    <>
      <Tooltip title={open || showLabel ? '' : item.label} placement={tooltipPlacement}>
        <ListItemButton
          onClick={handleOpen}
          aria-haspopup="menu"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            minHeight: 36,
            py: 0.5,
            px: showLabel ? 1 : 1,
            borderRadius: 1,
            mb: 0.25,
            justifyContent: showLabel ? 'flex-start' : 'center',
            ...(active && getActiveGroupSx(raccoon)),
          }}
        >
          {Icon && (
            <ListItemIcon
              sx={{
                minWidth: showLabel ? 32 : 0,
                color: open ? 'primary.main' : active ? 'text.primary' : 'text.secondary',
              }}
            >
              <Icon sx={{ fontSize: 18 }} />
            </ListItemIcon>
          )}
          {showLabel && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 12.5,
                fontWeight: active ? 600 : 500,
                color: active ? 'text.primary' : 'text.secondary',
                noWrap: true,
              }}
            />
          )}
          {showLabel && (
            <ExpandMore sx={{ color: 'text.disabled', fontSize: 16, flexShrink: 0 }} />
          )}
        </ListItemButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: menuPlacement,
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: menuPlacement === 'right' ? 'left' : 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              ...(menuPlacement === 'right'
                ? { marginInlineStart: 0.5 }
                : { marginInlineEnd: 0.5 }),
              bgcolor: raccoon.background.elevated,
              border: `1px solid ${raccoon.border.subtle}`,
            },
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            {item.label}
          </Typography>
        </Box>
        {item.children?.map((child) => {
          const ChildIcon = child.icon
          const childActive = isPathActive(location.pathname, child.path)

          return (
            <MenuItem
              key={child.key}
              component={NavLink}
              to={child.path ?? '/'}
              onClick={handleChildNavigate}
              selected={childActive}
              sx={{
                gap: 1,
                minHeight: 36,
                fontSize: 13,
                ...(childActive && {
                  bgcolor: alpha(raccoon.primary.main, 0.12),
                  color: 'primary.main',
                  fontWeight: 700,
                }),
              }}
            >
              {ChildIcon && <ChildIcon sx={{ fontSize: 16, color: 'inherit' }} />}
              <Box sx={{ flex: 1, minWidth: 0 }}>{child.label}</Box>
              {child.badge !== undefined && (
                <Badge
                  badgeContent={child.badge}
                  color="primary"
                  sx={{ marginInlineStart: 1 }}
                />
              )}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

/**
 * Non-interactive section divider — no NavLink, no hover, no selected state.
 * `label` and `icon` are both optional. Renders a thin rule with an optional
 * inline caption; visibly smaller than link rows.
 */
function NavSeparator({
  item,
  density,
}: {
  item: LayoutNavItem
  density: SidebarVerticalDensity
}) {
  const raccoon = useRaccoonTheme()
  const Icon = item.icon
  const isCollapsed = density === 'collapsed'
  const isCompact = density === 'compact'
  const showLabel = !isCollapsed && Boolean(item.label)
  const showIcon = !isCollapsed && Boolean(Icon)
  const rule = `1px solid ${raccoon.border.subtle}`

  return (
    <Box
      role="separator"
      aria-label={item.label || undefined}
      sx={{
        // Smaller than link rows on purpose so it can't be mistaken for an item.
        mt: 1,
        mb: 0.5,
        px: isCollapsed ? 0.75 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        color: 'text.disabled',
        userSelect: 'none',
        cursor: 'default',
      }}
    >
      {isCollapsed ? (
        <Box sx={{ flex: 1, height: 0, borderTop: rule }} />
      ) : showLabel || showIcon ? (
        <>
          {showIcon && Icon && <Icon sx={{ fontSize: 12, color: 'inherit' }} />}
          {showLabel && (
            <Typography
              variant="caption"
              sx={{
                fontSize: isCompact ? 9.5 : 10.5,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                color: 'inherit',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.label}
            </Typography>
          )}
          <Box sx={{ flex: 1, height: 0, borderTop: rule }} />
        </>
      ) : (
        <Box sx={{ flex: 1, height: 0, borderTop: rule }} />
      )}
    </Box>
  )
}

function NavNode({
  item,
  depth,
  density,
  expandedGroups,
  onToggleGroup,
  onNavigate,
}: {
  item: LayoutNavItem
  depth: number
  density: SidebarVerticalDensity
  expandedGroups: Record<string, boolean>
  onToggleGroup: (key: string) => void
  onNavigate?: () => void
}) {
  const { direction } = useLayoutShell()
  const raccoon = useRaccoonTheme()
  const location = useLocation()
  const hasChildren = Boolean(item.children?.length)
  const active = hasActiveDescendant(item, location.pathname)
  const expanded = expandedGroups[item.key] ?? false
  const Icon = item.icon
  const tooltipPlacement = direction === 'rtl' ? 'left' : 'right'
  const isCollapsed = density === 'collapsed'
  const isCompact = density === 'compact'
  const showLabel = density !== 'collapsed'
  const labelFontSize = isCompact ? 12.5 : 13

  const itemSx = {
    minHeight: 36,
    py: 0.5,
    px: 1,
    borderRadius: 1,
    mb: 0.25,
    ...(depth > 0 && density === 'expanded'
      ? { paddingInlineStart: 1.25 + depth * 1.25 }
      : {}),
  }

  if (hasChildren) {
    // Compact & collapsed: parent row + flyout children (no inline tree).
    if (isCollapsed || isCompact) {
      return (
        <GroupFlyout
          item={item}
          density={isCollapsed ? 'collapsed' : 'compact'}
          onNavigate={onNavigate}
        />
      )
    }

    return (
      <>
        <ListItemButton
          onClick={() => onToggleGroup(item.key)}
          sx={{
            ...itemSx,
            ...(active && getActiveGroupSx(raccoon)),
          }}
        >
          {Icon && (
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: active ? 'text.primary' : 'text.secondary',
              }}
            >
              <Icon sx={{ fontSize: 18 }} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: labelFontSize,
              fontWeight: active ? 600 : 500,
              color: active ? 'text.primary' : 'text.secondary',
              noWrap: true,
            }}
          />
          {expanded ? (
            <ExpandLess sx={{ color: 'text.disabled', fontSize: 16 }} />
          ) : (
            <ExpandMore sx={{ color: 'text.disabled', fontSize: 16 }} />
          )}
        </ListItemButton>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children?.map((child) => (
              <NavNode
                key={child.key}
                item={child}
                depth={depth + 1}
                density={density}
                expandedGroups={expandedGroups}
                onToggleGroup={onToggleGroup}
                onNavigate={onNavigate}
              />
            ))}
          </List>
        </Collapse>
      </>
    )
  }

  const leafActive = isPathActive(location.pathname, item.path)

  return (
    <Tooltip title={isCollapsed ? item.label : ''} placement={tooltipPlacement}>
      <ListItemButton
        component={NavLink}
        to={item.path ?? '/'}
        end={item.path === '/'}
        onClick={onNavigate}
        sx={{
          ...itemSx,
          position: 'relative',
          ...(isCollapsed && { justifyContent: 'center' }),
          ...(leafActive && getActiveLeafSx(raccoon, depth > 0)),
        }}
      >
        {Icon && (
          <ListItemIcon
            sx={{
              minWidth: isCollapsed ? 0 : 32,
              color: leafActive ? 'primary.main' : 'text.secondary',
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </ListItemIcon>
        )}
        {showLabel && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: labelFontSize,
              fontWeight: leafActive ? 700 : 500,
              color: leafActive ? 'primary.main' : 'text.secondary',
              noWrap: true,
            }}
          />
        )}
        {showLabel && density === 'expanded' && item.badge !== undefined && (
          <Badge
            badgeContent={item.badge}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                position: 'static',
                transform: 'none',
                fontSize: 10,
                minWidth: 18,
                height: 18,
                px: 0.5,
              },
            }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  )
}

export function SidebarVertical({
  density = 'expanded',
  onNavigate,
  variant = 'permanent',
}: SidebarVerticalProps) {
  const { brand, navigation } = useLayoutShell()
  const raccoon = useRaccoonTheme()
  const location = useLocation()
  const [expandedGroups, setExpandedGroups] = useState(() =>
    getInitialExpandedGroups(navigation, location.pathname),
  )

  // Keep the active branch open on route changes (back/forward, deep links).
  // Merge only — do not collapse groups the user opened manually.
  useEffect(() => {
    setExpandedGroups((current) => ({
      ...current,
      ...getInitialExpandedGroups(navigation, location.pathname),
    }))
  }, [location.pathname, navigation])

  const isDrawer = variant === 'drawer'
  const width = isDrawer ? '100%' : densityWidth(density)
  const isCollapsed = density === 'collapsed'
  const isCompact = density === 'compact'
  const showBrandText = density !== 'collapsed'
  const showFooter = density === 'expanded'

  const toggleGroup = (key: string) => {
    setExpandedGroups((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <Box
      sx={{
        width,
        maxWidth: '100%',
        flexShrink: 0,
        height: isDrawer ? '100%' : '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: raccoon.background.paper,
        ...(!isDrawer && {
          borderInlineEnd: `1px solid ${raccoon.border.subtle}`,
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }),
      }}
    >
      <Box
        sx={{
          ...shellHeaderSx,
          gap: 1,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          paddingInline: isCollapsed ? 1 : isCompact ? 1 : 1.5,
          borderBottom: `1px solid ${raccoon.border.subtle}`,
          bgcolor: raccoon.background.paper,
        }}
      >
        <Box
          sx={{
            width: isCompact ? 28 : 32,
            height: isCompact ? 28 : 32,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 1,
            border: `1px solid ${raccoon.border.glow}`,
            color: 'primary.main',
            boxShadow: `0 0 12px ${raccoon.border.glow}`,
            flexShrink: 0,
          }}
        >
          <HexagonOutlinedIcon sx={{ fontSize: isCompact ? 18 : 20 }} />
        </Box>
        {showBrandText && (
          <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              lineHeight={1.2}
              sx={{ fontSize: isCompact ? 12.5 : 14 }}
              noWrap
            >
              {brand.title}
            </Typography>
            {density === 'expanded' && brand.subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }} noWrap>
                {brand.subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 0.75,
        }}
      >
        <List disablePadding sx={{ paddingInline: isCompact ? 0.5 : 0.75 }}>
          {navigation.map((item) =>
            isSeparatorItem(item) ? (
              <NavSeparator key={item.key} item={item} density={density} />
            ) : (
              <NavNode
                key={item.key}
                item={item}
                depth={0}
                density={density}
                expandedGroups={expandedGroups}
                onToggleGroup={toggleGroup}
                onNavigate={onNavigate}
              />
            ),
          )}
        </List>
      </Box>

      {showFooter && brand.footer && (
        <Box
          sx={{
            flexShrink: 0,
            paddingInline: 1.5,
            py: 1,
            borderTop: `1px solid ${raccoon.border.subtle}`,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.disabled',
          }}
        >
          <CodeIcon sx={{ fontSize: 12 }} />
          <Typography
            variant="caption"
            letterSpacing={0.8}
            sx={{ fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {brand.footer}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
