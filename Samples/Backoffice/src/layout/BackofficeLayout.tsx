import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { BackofficeLayout as ShellLayout } from '@raccoonland/layout'
import { useMemo } from 'react'
import { useToast } from '@raccoonland/feedback'
import { useLocale } from '../i18n/LocaleProvider'
import { useHeaderUser } from './useHeaderUser'
import { useLayoutChrome } from './useLayoutChrome'

/**
 * Sample wiring for `@raccoonland/layout` — i18n, nav, and user stay in the app.
 */
export function BackofficeLayout() {
  const { t } = useLocale()
  const { showWarning } = useToast()
  const { navigation, brand, labels, direction, onToggleLocale } = useLayoutChrome()
  const { user, isLoading } = useHeaderUser()

  const menuItems = useMemo(
    () => [
      {
        key: 'profile',
        label: t('navProfile'),
        icon: <PersonOutlineOutlinedIcon fontSize="small" />,
        disabled: true,
      },
      {
        key: 'settings',
        label: t('navSettings'),
        icon: <SettingsOutlinedIcon fontSize="small" />,
        href: '/settings/layout',
      },
      {
        key: 'sign-out',
        label: t('signOut'),
        icon: <LogoutOutlinedIcon fontSize="small" />,
        onClick: () => showWarning(t('signOutNotAvailable')),
      },
    ],
    [t, showWarning],
  )

  // Stable reference so LayoutShellProvider's memoized shell value is not
  // invalidated on every parent render (inline object literals always differ).
  const shellUser = useMemo(
    () => ({
      isLoading,
      info: user,
      menuItems,
    }),
    [isLoading, user, menuItems],
  )

  return (
    <ShellLayout
      navigation={navigation}
      brand={brand}
      direction={direction}
      labels={labels}
      onToggleLocale={onToggleLocale}
      settingsPath="/settings/layout"
      orientationStorageKey="raccoonland-sample-sidebar-orientation"
      densityStorageKey="raccoonland-sample-sidebar-density"
      user={shellUser}
    />
  )
}
