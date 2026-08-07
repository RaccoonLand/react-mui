import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import DynamicFormOutlinedIcon from '@mui/icons-material/DynamicFormOutlined'
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import WebAssetOutlinedIcon from '@mui/icons-material/WebAssetOutlined'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import type { BreadcrumbItem } from '@raccoonland/page'
import type { MessageKey } from '../i18n/messages'

/** Icons shared with the sidebar navigation. */
export const crumbIcons = {
  dashboard: DashboardOutlinedIcon,
  packages: ExtensionOutlinedIcon,
  pipeline: ApiOutlinedIcon,
  theme: PaletteOutlinedIcon,
  feedback: WidgetsOutlinedIcon,
  formKit: DynamicFormOutlinedIcon,
  page: WebAssetOutlinedIcon,
  dataTable: TableChartOutlinedIcon,
  layout: ViewSidebarOutlinedIcon,
  notFound: SearchOffOutlinedIcon,
} as const

const packageGuides = {
  pipeline: {
    path: '/packages/pipeline-client',
    titleKey: 'guidePipelineTitle' as const,
    icon: crumbIcons.pipeline,
  },
  theme: {
    path: '/packages/theme',
    titleKey: 'guideThemeTitle' as const,
    icon: crumbIcons.theme,
  },
  feedback: {
    path: '/packages/feedback',
    titleKey: 'guideFeedbackTitle' as const,
    icon: crumbIcons.feedback,
  },
  formKit: {
    path: '/packages/form-kit',
    titleKey: 'guideFormKitTitle' as const,
    icon: crumbIcons.formKit,
  },
  page: {
    path: '/packages/page',
    titleKey: 'guidePageTitle' as const,
    icon: crumbIcons.page,
  },
  dataTable: {
    path: '/packages/data-table',
    titleKey: 'guideDataTableTitle' as const,
    icon: crumbIcons.dataTable,
  },
  layout: {
    path: '/packages/layout',
    titleKey: 'guideLayoutTitle' as const,
    icon: crumbIcons.layout,
  },
}

export type PackageGuideKey = keyof typeof packageGuides

/** Dashboard → Packages → Guide title, with icons matching the sidebar. */
export function packageGuideBreadcrumbs(
  t: (key: MessageKey) => string,
  packageKey: PackageGuideKey,
): BreadcrumbItem[] {
  const guide = packageGuides[packageKey]

  return [
    { label: t('navDashboard'), href: '/', icon: crumbIcons.dashboard },
    { label: t('navPackages'), href: guide.path, icon: crumbIcons.packages },
    { label: t(guide.titleKey), icon: guide.icon },
  ]
}

/**
 * Attach icons to crumbs from `buildBreadcrumbsFromPath`.
 * Pass the same `pathname` so the last (unlinked) crumb can be resolved.
 */
export function withPathBreadcrumbIcons(
  items: BreadcrumbItem[],
  pathname: string,
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)

  return items.map((item, index) => {
    if (item.icon) {
      return item
    }

    // Root crumb from `root` option.
    if (item.href === '/') {
      return { ...item, icon: crumbIcons.dashboard }
    }

    // Crumbs from path segments: root may shift the index by 1.
    const hasRoot = items[0]?.href === '/'
    const segmentIndex = hasRoot ? index - 1 : index
    if (segmentIndex < 0 || segmentIndex >= segments.length) {
      return item
    }

    const pathUpToSegment = `/${segments.slice(0, segmentIndex + 1).join('/')}`
    const icon = iconForPath(pathUpToSegment)
    return icon ? { ...item, icon } : item
  })
}

function iconForPath(pathname: string): SvgIconComponent | undefined {
  if (!pathname || pathname === '/') {
    return crumbIcons.dashboard
  }

  const segments = pathname.split('/').filter(Boolean)
  if (segments[0] !== 'packages') {
    return undefined
  }

  if (segments.length === 1) {
    return crumbIcons.packages
  }

  const packageSegment = segments[1]
  const guide = Object.values(packageGuides).find((g) => g.path === `/packages/${packageSegment}`)
  return guide?.icon ?? crumbIcons.packages
}
