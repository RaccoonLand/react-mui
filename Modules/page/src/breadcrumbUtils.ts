import type { SvgIconComponent } from '@mui/icons-material'
import type { BreadcrumbItem } from './BreadcrumbNav'

/**
 * Resolve icon from the item only. Apps may attach icons when building crumbs.
 */
export function resolveBreadcrumbIcon(item: BreadcrumbItem): SvgIconComponent | undefined {
  return item.icon
}
