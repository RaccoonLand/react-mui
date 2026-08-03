import type { BreadcrumbItem } from './BreadcrumbNav'

export type BreadcrumbPathOptions = {
  /** Absolute path, e.g. `/packages/theme` */
  pathname: string
  /** Map a path segment to a display label. Defaults to the segment itself. */
  labelForSegment?: (segment: string, index: number, href: string) => string
  /** Optional root crumb (e.g. Dashboard). */
  root?: BreadcrumbItem
  /** Skip empty segments (default true). */
  skipEmpty?: boolean
}

/**
 * Build a breadcrumb trail from a URL path. Labels should be localized by the app
 * via `labelForSegment`. Dynamic titles (entity names) should override the last crumb.
 */
export function buildBreadcrumbsFromPath(options: BreadcrumbPathOptions): BreadcrumbItem[] {
  const { pathname, labelForSegment, root, skipEmpty = true } = options
  const segments = pathname.split('/').filter((segment) => (skipEmpty ? Boolean(segment) : true))

  const items: BreadcrumbItem[] = root ? [{ ...root }] : []
  let href = ''

  segments.forEach((segment, index) => {
    href += `/${segment}`
    const isLast = index === segments.length - 1
    items.push({
      label: labelForSegment?.(segment, index, href) ?? segment,
      // Last crumb is usually not a link
      href: isLast ? undefined : href,
    })
  })

  return items
}
