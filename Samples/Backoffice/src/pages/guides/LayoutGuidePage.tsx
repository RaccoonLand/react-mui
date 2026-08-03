import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import { Alert, Paper, Stack, Typography } from '@mui/material'
import { Page } from '@raccoonland/page'
import { useRaccoonTheme } from '@raccoonland/theme'
import { packageGuideBreadcrumbs } from '../../layout/breadcrumbIcons'
import { useLocale } from '../../i18n/LocaleProvider'
import { GuideUsageSection } from './GuideUsageSection'

const LAYOUT_USAGE_CODE = `import {
  BackofficeLayout,
  LayoutSettingsPanel,
  type LayoutChromeLabels,
  type LayoutNavItem,
} from '@raccoonland/layout'

// 1) Resolve i18n in the app, then pass plain strings into the package.
const navigation: LayoutNavItem[] = [
  { key: 'dashboard', label: t('navDashboard'), path: '/', icon: DashboardIcon },
  {
    key: 'mgmt',
    label: t('navManagement'),
    icon: FolderIcon,
    children: [
      { key: 'people', label: t('navPeople'), path: '/people', icon: PeopleIcon },
    ],
  },
]

const labels: LayoutChromeLabels = {
  searchPlaceholder: t('searchPlaceholder'),
  // ...all chrome / settings strings
}

// 2) Mount the shell once (usually as the router layout route element)
export function AppShell() {
  return (
    <BackofficeLayout
      navigation={navigation}
      brand={{ title: 'MyApp', subtitle: 'Backoffice', footer: '© MyCo' }}
      direction="rtl"
      labels={labels}
      onToggleLocale={toggleLocale}
      settingsPath="/settings/layout"
      orientationStorageKey="myapp-sidebar-orientation"
      densityStorageKey="myapp-sidebar-density"
      header={{
        showSearch: false,
        showNotifications: false,
        startActions: <MyBreadcrumbSlot />,
        endActions: <HelpButton />,
      }}
      user={{
        isLoading: false,
        info: { name: 'Ali', role: 'Admin', initials: 'A' },
        menuItems: [
          { key: 'settings', label: t('navSettings'), href: '/settings/layout' },
        ],
      }}
    />
  )
}

// 3) Settings page — panel reads labels from the shell context
export function SettingsPage() {
  return (
    <Page title="Layout">
      <LayoutSettingsPanel />
    </Page>
  )
}`

export function LayoutGuidePage() {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()

  return (
    <Page
      title={t('guideLayoutTitle')}
      direction={direction}
      breadcrumbs={packageGuideBreadcrumbs(t, 'layout')}
    >
      <Stack spacing={2}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: raccoon.background.elevated,
            border: `1px solid ${raccoon.border.subtle}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t('guideLayoutBody')}
          </Typography>
        </Paper>

        <GuideUsageSection
          description={t('guideUsageDescription')}
          demo={
            <Stack spacing={1.5}>
              <Alert severity="success">
                This sample already runs inside <code>BackofficeLayout</code> from the package.
              </Alert>
              <Alert severity="info">
                Control the header from the host via <code>header</code>: hide search /
                notifications / theme / fullscreen, and inject <code>startActions</code> /
                <code>endActions</code>.
              </Alert>
              <Alert severity="info">
                Open profile → Settings to use <code>LayoutSettingsPanel</code>, or toggle density /
                orientation from the header shortcuts.
              </Alert>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'primary.main' }}>
                <ViewSidebarOutlinedIcon fontSize="small" />
                <Typography variant="body2">@raccoonland/layout</Typography>
              </Stack>
            </Stack>
          }
          code={LAYOUT_USAGE_CODE}
        />
      </Stack>
    </Page>
  )
}
