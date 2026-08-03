import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { LayoutSettingsPanel } from '@raccoonland/layout'
import { Page } from '@raccoonland/page'
import { crumbIcons } from '../../layout/breadcrumbIcons'
import { useLocale } from '../../i18n/LocaleProvider'

export function LayoutSettingsPage() {
  const { t, direction } = useLocale()

  return (
    <Page
      title={t('layoutSettingsTitle')}
      direction={direction}
      breadcrumbs={[
        { label: t('navDashboard'), href: '/', icon: crumbIcons.dashboard },
        { label: t('navSettings'), href: '/settings/layout', icon: SettingsOutlinedIcon },
        { label: t('layoutSettingsTitle'), icon: SettingsOutlinedIcon },
      ]}
    >
      <LayoutSettingsPanel />
    </Page>
  )
}
