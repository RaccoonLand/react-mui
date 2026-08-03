import { useMemo } from 'react'
import type { LayoutBrand, LayoutChromeLabels } from '@raccoonland/layout'
import { useLocale } from '../i18n/LocaleProvider'
import { appNavigation, resolveNavigation } from './navigation'

export function useLayoutChrome() {
  const { t, direction, locale, toggleLocale } = useLocale()

  const navigation = useMemo(() => resolveNavigation(appNavigation, t), [t])

  const brand = useMemo<LayoutBrand>(
    () => ({
      title: t('appName'),
      subtitle: t('appSubtitle'),
      footer: t('brandFooter'),
    }),
    [t],
  )

  const labels = useMemo<LayoutChromeLabels>(
    () => ({
      searchPlaceholder: t('searchPlaceholder'),
      openSearch: t('openSearch'),
      headerSearchTitle: t('headerSearchTitle'),
      openMenu: t('openMenu'),
      closeMenu: t('closeMenu'),
      expandSidebar: t('expandSidebar'),
      compactSidebar: t('compactSidebar'),
      collapseSidebar: t('collapseSidebar'),
      layoutHorizontal: t('layoutHorizontal'),
      layoutVertical: t('layoutVertical'),
      themeLight: t('themeLight'),
      themeDark: t('themeDark'),
      enterFullscreen: t('enterFullscreen'),
      exitFullscreen: t('exitFullscreen'),
      fullscreenUnavailable: t('fullscreenUnavailable'),
      notifications: t('notifications'),
      userMenu: t('userMenu'),
      navProfile: t('navProfile'),
      navSettings: t('navSettings'),
      signOut: t('signOut'),
      signOutNotAvailable: t('signOutNotAvailable'),
      switchLocale: locale === 'fa' ? t('switchToEnglish') : t('switchToPersian'),
      targetLocaleCode: locale === 'fa' ? 'EN' : 'FA',
      layoutSettingsIntro: t('layoutSettingsIntro'),
      layoutNavOrientation: t('layoutNavOrientation'),
      layoutNavOrientationHint: t('layoutNavOrientationHint'),
      layoutVerticalDesc: t('layoutVerticalDesc'),
      layoutHorizontalDesc: t('layoutHorizontalDesc'),
      layoutHorizontalMobileHint: t('layoutHorizontalMobileHint'),
      layoutNavDensity: t('layoutNavDensity'),
      layoutNavDensityHint: t('layoutNavDensityHint'),
      layoutNavDensityDisabledHint: t('layoutNavDensityDisabledHint'),
      layoutDensityExpanded: t('layoutDensityExpanded'),
      layoutDensityExpandedDesc: t('layoutDensityExpandedDesc'),
      layoutDensityCompact: t('layoutDensityCompact'),
      layoutDensityCompactDesc: t('layoutDensityCompactDesc'),
      layoutDensityCollapsed: t('layoutDensityCollapsed'),
      layoutDensityCollapsedDesc: t('layoutDensityCollapsedDesc'),
      layoutTheme: t('layoutTheme'),
      layoutThemeLightDesc: t('layoutThemeLightDesc'),
      layoutThemeDarkDesc: t('layoutThemeDarkDesc'),
      layoutSettingsPersistHint: t('layoutSettingsPersistHint'),
    }),
    [t, locale],
  )

  return {
    navigation,
    brand,
    labels,
    direction,
    onToggleLocale: toggleLocale,
  }
}
