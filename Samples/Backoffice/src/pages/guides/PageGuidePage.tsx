import { Alert, Button, Paper, Stack, Typography } from '@mui/material'
import {
  buildBreadcrumbsFromPath,
  Page,
  type BreadcrumbItem,
} from '@raccoonland/page'
import { useRaccoonTheme } from '@raccoonland/theme'
import { useMemo, useState } from 'react'
import {
  packageGuideBreadcrumbs,
  withPathBreadcrumbIcons,
} from '../../layout/breadcrumbIcons'
import { useLocale } from '../../i18n/LocaleProvider'
import { GuideUsageSection } from './GuideUsageSection'

const PAGE_USAGE_CODE = `import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import { Page, buildBreadcrumbsFromPath } from '@raccoonland/page'
import type { BreadcrumbItem } from '@raccoonland/page'

// A) Manual breadcrumbs — optional icon on each crumb (MUI SvgIconComponent)
export function PeopleListPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/', icon: DashboardOutlinedIcon },
    { label: 'Management', href: '/management/people' },
    { label: 'People', icon: GroupOutlinedIcon }, // last crumb: no href
  ]

  return (
    <Page
      title="People"
      direction="rtl"
      breadcrumbs={breadcrumbs}
      actions={<button>Add</button>}
      // Optional overrides for layouts with their own z-index scheme:
      headerZIndex={2}
      headerSx={{ borderBottomColor: 'divider' }}
      // Set headerBleed={false} when nesting Page inside a padded card/drawer
      // so the sticky header does not overflow the container horizontally.
    >
      <div>Table / content</div>
    </Page>
  )
}

// B) Auto trail from URL + app label map (override last crumb for entity titles)
export function PersonEditPage({ personName }: { personName: string }) {
  const crumbs = buildBreadcrumbsFromPath({
    pathname: '/management/people/42/edit',
    root: { label: 'Dashboard', href: '/', icon: DashboardOutlinedIcon },
    labelForSegment: (segment, _index, href) => {
      if (segment === 'management') return 'Management'
      if (segment === 'people') return 'People'
      if (segment === 'edit') return 'Edit'
      if (/^\\d+$/.test(segment)) return personName // "Ali Reza" instead of "42"
      return segment
    },
  })

  const breadcrumbs = crumbs.map((c, i) =>
    i === crumbs.length - 1
      ? { ...c, label: \`Edit \${personName}\`, icon: GroupOutlinedIcon }
      : c,
  )

  return (
    <Page title={\`Edit \${personName}\`} direction="rtl" breadcrumbs={breadcrumbs}>
      <form>...</form>
    </Page>
  )
}`

export function PageGuidePage() {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()
  const [path, setPath] = useState('/packages/page/demo-entity')

  const autoCrumbs = useMemo(
    () =>
      withPathBreadcrumbIcons(
        buildBreadcrumbsFromPath({
          pathname: path,
          root: { label: t('navDashboard'), href: '/' },
          labelForSegment: (segment) => {
            if (segment === 'packages') return t('navPackages')
            if (segment === 'page') return t('guidePageTitle')
            if (segment === 'theme') return t('guideThemeTitle')
            if (segment === 'demo-entity') return 'Demo entity'
            return segment
          },
        }),
        path,
      ),
    [path, t],
  )

  const manualCrumbs: BreadcrumbItem[] = packageGuideBreadcrumbs(t, 'page')

  return (
    <Page title={t('guidePageTitle')} direction={direction} breadcrumbs={manualCrumbs}>
      <Stack spacing={2}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: raccoon.background.elevated, border: `1px solid ${raccoon.border.subtle}` }}>
          <Typography variant="body2" color="text.secondary">
            {t('guidePageBody')}
          </Typography>
        </Paper>

        <GuideUsageSection
          description={t('guideUsageDescription')}
          demo={
            <Stack spacing={1.5}>
              <Alert severity="success">
                This page header uses manual breadcrumbs with icons. Nested <code>Page</code>{' '}
                below overrides <code>headerZIndex</code> so it doesn&apos;t sit above this one.
              </Alert>
              <Typography fontWeight={700} variant="body2">
                buildBreadcrumbsFromPath preview
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button size="small" variant="outlined" onClick={() => setPath('/packages/page')}>
                  /packages/page
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setPath('/packages/page/demo-entity')}
                >
                  /packages/page/demo-entity
                </Button>
                <Button size="small" variant="outlined" onClick={() => setPath('/packages/theme')}>
                  /packages/theme
                </Button>
              </Stack>
              <Alert severity="info">pathname: {path}</Alert>
              <Paper variant="outlined" sx={{ p: 1.5 }}>
                <Page
                  title="Nested demo"
                  direction={direction}
                  breadcrumbs={autoCrumbs}
                  headerZIndex={2}
                  headerBleed={false}
                >
                  <Typography variant="body2" color="text.secondary">
                    Nested Page with auto-generated crumbs + icons, a lowered headerZIndex, and
                    headerBleed=false so the header stays inside the card.
                  </Typography>
                </Page>
              </Paper>
            </Stack>
          }
          code={PAGE_USAGE_CODE}
        />
      </Stack>
    </Page>
  )
}
