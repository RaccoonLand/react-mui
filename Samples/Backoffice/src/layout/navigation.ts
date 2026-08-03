import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import DynamicFormOutlinedIcon from '@mui/icons-material/DynamicFormOutlined'
import WebAssetOutlinedIcon from '@mui/icons-material/WebAssetOutlined'
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined'
import type { LayoutNavItem } from '@raccoonland/layout'
import type { MessageKey } from '../i18n/messages'

type AppNavItem = {
  key: string
  labelKey: MessageKey
  path?: string
  icon?: LayoutNavItem['icon']
  badge?: number
  children?: AppNavItem[]
}

/** App navigation (keys only) — labels resolved via i18n at runtime. */
export const appNavigation: AppNavItem[] = [
  {
    key: 'dashboard',
    labelKey: 'navDashboard',
    path: '/',
    icon: DashboardOutlinedIcon,
  },
  {
    key: 'packages',
    labelKey: 'navPackages',
    icon: ExtensionOutlinedIcon,
    children: [
      {
        key: 'pkg-pipeline',
        labelKey: 'guidePipelineTitle',
        path: '/packages/pipeline-client',
        icon: ApiOutlinedIcon,
      },
      {
        key: 'pkg-theme',
        labelKey: 'guideThemeTitle',
        path: '/packages/theme',
        icon: PaletteOutlinedIcon,
      },
      {
        key: 'pkg-feedback',
        labelKey: 'guideFeedbackTitle',
        path: '/packages/feedback',
        icon: WidgetsOutlinedIcon,
      },
      {
        key: 'pkg-form-kit',
        labelKey: 'guideFormKitTitle',
        path: '/packages/form-kit',
        icon: DynamicFormOutlinedIcon,
      },
      {
        key: 'pkg-page',
        labelKey: 'guidePageTitle',
        path: '/packages/page',
        icon: WebAssetOutlinedIcon,
      },
      {
        key: 'pkg-layout',
        labelKey: 'guideLayoutTitle',
        path: '/packages/layout',
        icon: ViewSidebarOutlinedIcon,
      },
    ],
  },
]

export function resolveNavigation(
  items: AppNavItem[],
  t: (key: MessageKey) => string,
): LayoutNavItem[] {
  return items.map((item) => ({
    key: item.key,
    label: t(item.labelKey),
    path: item.path,
    icon: item.icon,
    badge: item.badge,
    children: item.children ? resolveNavigation(item.children, t) : undefined,
  }))
}
