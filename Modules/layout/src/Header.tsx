import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import CloseIcon from '@mui/icons-material/Close'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import FullscreenExitOutlinedIcon from '@mui/icons-material/FullscreenExitOutlined'
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined'
import LanguageIcon from '@mui/icons-material/Language'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import WebAssetOutlinedIcon from '@mui/icons-material/WebAssetOutlined'
import WidthNormalOutlinedIcon from '@mui/icons-material/WidthNormalOutlined'
import {
  alpha,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { AppDialog, useToast } from '@raccoonland/feedback'
import { useRaccoonTheme, useThemeMode } from '@raccoonland/theme'
import { useState, type MouseEvent, type ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { shellHeaderSx } from './constants'
import { useLayoutSettings } from './LayoutSettingsContext'
import { useLayoutShell } from './LayoutShellContext'
import { useAppFullscreen } from './useAppFullscreen'
import { layoutZIndex } from './zIndex'

export type LayoutHeaderProps = {
  isMobile: boolean
  mobileOpen: boolean
  scrolled: boolean
  onToggleSidebar: () => void
}

function HeaderSearchField({
  autoFocus,
  onSubmit,
  placeholder,
}: {
  autoFocus?: boolean
  onSubmit?: () => void
  placeholder: string
}) {
  const raccoon = useRaccoonTheme()

  return (
    <TextField
      size="small"
      placeholder={placeholder}
      autoFocus={autoFocus}
      fullWidth
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onSubmit?.()
        }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: raccoon.background.elevated,
          height: 34,
          fontSize: 13,
        },
        '& .MuiOutlinedInput-input': {
          py: 0.75,
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon sx={{ fontSize: 18 }} color="disabled" />
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

export function LayoutHeader({
  isMobile,
  mobileOpen,
  scrolled,
  onToggleSidebar,
}: LayoutHeaderProps) {
  const raccoon = useRaccoonTheme()
  const { mode, toggleMode } = useThemeMode()
  const { showWarning } = useToast()
  const { isFullscreen, toggleFullscreen } = useAppFullscreen()
  const { orientation, density, toggleOrientation } = useLayoutSettings()
  const {
    direction,
    labels,
    user,
    settingsPath = '/settings/layout',
    onToggleLocale,
    header,
    headerActions,
  } = useLayoutShell()

  const showSearch = header?.showSearch !== false
  const showThemeToggle = header?.showThemeToggle !== false
  const showFullscreen = header?.showFullscreen !== false
  const showNotifications = header?.showNotifications !== false
  const showOrientationToggle = header?.showOrientationToggle !== false
  const showUser = header?.showUser !== false
  const showLocaleToggle =
    header?.showLocaleToggle !== false && typeof onToggleLocale === 'function'
  const startActions = header?.startActions
  const endActions = header?.endActions ?? headerActions

  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null)

  const showSidebarToggle = isMobile || orientation === 'vertical'

  const sidebarTooltip = isMobile
    ? mobileOpen
      ? labels.closeMenu
      : labels.openMenu
    : density === 'expanded'
      ? labels.compactSidebar
      : density === 'compact'
        ? labels.collapseSidebar
        : labels.expandSidebar

  const orientationTooltip =
    orientation === 'vertical' ? labels.layoutHorizontal : labels.layoutVertical

  const SidebarToggleIcon = isMobile ? (
    mobileOpen ? (
      <CloseIcon fontSize="small" />
    ) : (
      <MenuIcon fontSize="small" />
    )
  ) : density === 'collapsed' ? (
    <MenuIcon fontSize="small" />
  ) : density === 'compact' ? (
    <WidthNormalOutlinedIcon fontSize="small" />
  ) : (
    <MenuOpenIcon fontSize="small" />
  )

  const openUserMenu = (event: MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const closeUserMenu = () => {
    setUserMenuAnchor(null)
  }

  const defaultMenuItems = [
    {
      key: 'profile',
      label: labels.navProfile,
      icon: <PersonOutlineOutlinedIcon fontSize="small" />,
      disabled: true,
    },
    {
      key: 'settings',
      label: labels.navSettings,
      icon: <SettingsOutlinedIcon fontSize="small" />,
      href: settingsPath,
    },
    {
      key: 'sign-out',
      label: labels.signOut,
      icon: <LogoutOutlinedIcon fontSize="small" />,
      onClick: () => {
        showWarning(labels.signOutNotAvailable)
      },
    },
  ]

  const menuItems = user.menuItems ?? defaultMenuItems

  return (
    <>
      <Box
        component="header"
        sx={{
          ...shellHeaderSx,
          gap: 1.5,
          borderBottom: `1px solid ${raccoon.border.subtle}`,
          bgcolor: raccoon.background.header,
          backdropFilter: 'blur(8px)',
          position: 'relative',
          zIndex: layoutZIndex.header,
          transition: (theme) =>
            theme.transitions.create(['box-shadow', 'border-color'], {
              duration: theme.transitions.duration.short,
            }),
          ...(scrolled && {
            borderBottomColor: alpha(raccoon.primary.main, 0.22),
            boxShadow: `0 6px 20px ${alpha(raccoon.text.primary, 0.12)}`,
          }),
        }}
      >
        {showSidebarToggle && (
          <Tooltip title={sidebarTooltip}>
            <IconButton onClick={onToggleSidebar} color="inherit" size="small">
              {SidebarToggleIcon}
            </IconButton>
          </Tooltip>
        )}

        {!isMobile && showOrientationToggle && (
          <Tooltip title={orientationTooltip}>
            <IconButton
              onClick={toggleOrientation}
              color="inherit"
              size="small"
              aria-label={orientationTooltip}
            >
              {orientation === 'vertical' ? (
                <WebAssetOutlinedIcon sx={{ fontSize: 20 }} />
              ) : (
                <ViewSidebarOutlinedIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Tooltip>
        )}

        {startActions}

        {showSearch && (
          <>
            <Box
              sx={{
                flex: 1,
                maxWidth: 320,
                minWidth: 0,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <HeaderSearchField placeholder={labels.searchPlaceholder} />
            </Box>

            <Tooltip title={labels.openSearch}>
              <IconButton
                color="inherit"
                size="small"
                onClick={() => setSearchOpen(true)}
                aria-label={labels.openSearch}
                sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
              >
                <SearchOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            alignItems: 'center',
            flexShrink: 0,
            marginInlineStart: { xs: 0, sm: 'auto' },
          }}
        >
          {showThemeToggle && (
            <Tooltip title={mode === 'dark' ? labels.themeLight : labels.themeDark}>
              <IconButton onClick={toggleMode} size="small" color="inherit">
                {mode === 'dark' ? (
                  <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
                ) : (
                  <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>
          )}

          {showFullscreen && (
            <Tooltip title={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}>
              <IconButton
                onClick={() => void toggleFullscreen()}
                size="small"
                color="inherit"
                aria-label={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
              >
                {isFullscreen ? (
                  <FullscreenExitOutlinedIcon sx={{ fontSize: 20 }} />
                ) : (
                  <FullscreenOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>
          )}

          {showLocaleToggle && (
            <Tooltip title={labels.switchLocale}>
              <IconButton
                onClick={onToggleLocale}
                size="small"
                color="inherit"
                aria-label={labels.switchLocale}
              >
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <LanguageIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" fontWeight={700} sx={{ fontSize: 11, minWidth: 18 }}>
                    {labels.targetLocaleCode}
                  </Typography>
                </Stack>
              </IconButton>
            </Tooltip>
          )}

          {endActions}

          {showNotifications && (
            <Tooltip title={labels.notifications}>
              <IconButton size="small" color="inherit">
                <Badge color="primary" variant="dot" overlap="circular">
                  <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {showUser && (
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', paddingInlineStart: 0.5 }}>
              <IconButton
                onClick={openUserMenu}
                size="small"
                aria-label={labels.userMenu}
                sx={{ p: 0.25 }}
              >
                <Avatar
                  src={user.info?.avatarUrl?.trim() || undefined}
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: user.info?.avatarUrl?.trim() ? 'transparent' : 'primary.dark',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {user.isLoading ? '…' : (user.info?.initials ?? '?')}
                </Avatar>
              </IconButton>

              <Box sx={{ display: { xs: 'none', md: 'block' }, minWidth: 72 }}>
                {user.isLoading ? (
                  <Stack spacing={0.35}>
                    <Skeleton variant="text" width={72} height={16} />
                    <Skeleton variant="text" width={48} height={12} />
                  </Stack>
                ) : (
                  <>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, lineHeight: 1.2 }} noWrap>
                      {user.info?.name ?? '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }} noWrap>
                      {user.info?.role ?? '—'}
                    </Typography>
                  </>
                )}
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>

      {showSearch && (
        <AppDialog
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          title={labels.headerSearchTitle}
          maxWidth="xs"
          dividers={false}
          contentSx={{ pt: 1 }}
        >
          <HeaderSearchField
            autoFocus
            placeholder={labels.searchPlaceholder}
            onSubmit={() => setSearchOpen(false)}
          />
        </AppDialog>
      )}

      {showUser && (
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={closeUserMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: direction === 'rtl' ? 'left' : 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: direction === 'rtl' ? 'left' : 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                minWidth: 180,
                bgcolor: raccoon.background.elevated,
                border: `1px solid ${raccoon.border.subtle}`,
              },
            },
          }}
        >
          {menuItems.map((item) => {
            const content = (
              <>
                {item.icon != null && <ListItemIcon>{item.icon as ReactNode}</ListItemIcon>}
                <ListItemText>{item.label}</ListItemText>
              </>
            )

            if (item.href) {
              return (
                <MenuItem
                  key={item.key}
                  component={RouterLink}
                  to={item.href}
                  disabled={item.disabled}
                  onClick={closeUserMenu}
                >
                  {content}
                </MenuItem>
              )
            }

            return (
              <MenuItem
                key={item.key}
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.()
                  closeUserMenu()
                }}
              >
                {content}
              </MenuItem>
            )
          })}
        </Menu>
      )}
    </>
  )
}
