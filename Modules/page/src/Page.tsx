import { Box, Stack, useTheme, type SxProps, type Theme } from '@mui/material'
import type { ReactNode } from 'react'
import { useRaccoonTheme } from '@raccoonland/theme'
import { BreadcrumbNav, type BreadcrumbItem } from './BreadcrumbNav'

export type PageProps = {
  /** Used for document title / a11y — shown in breadcrumb, not duplicated as heading */
  title: string
  breadcrumbs?: BreadcrumbItem[]
  /** Passed to BreadcrumbNav for RTL separator mirroring. Defaults to theme.direction. */
  direction?: 'ltr' | 'rtl'
  actions?: ReactNode
  children: ReactNode
  /**
   * Extra `sx` merged into the sticky page header. Use to override things like
   * `zIndex`, `position`, `bgcolor`, or `borderBottom` when composing with a
   * custom layout that has its own stacking order.
   */
  headerSx?: SxProps<Theme>
  /**
   * Convenience shortcut for the most common header override.
   * Falls through to `headerSx.zIndex` when provided there instead.
   * Defaults to `9`.
   */
  headerZIndex?: number
  /**
   * When `true` (default) the sticky header uses negative horizontal margins so
   * it bleeds to the edges of the surrounding content padding — correct for a
   * top-level page inside the app shell. Set to `false` when nesting `Page`
   * inside a padded container (card / drawer) so the header stays within it.
   */
  headerBleed?: boolean
}

export function Page({
  title,
  breadcrumbs = [],
  direction: directionProp,
  actions,
  children,
  headerSx,
  headerZIndex = 9,
  headerBleed = true,
}: PageProps) {
  const theme = useTheme()
  const raccoon = useRaccoonTheme()
  const direction = directionProp ?? (theme.direction === 'rtl' ? 'rtl' : 'ltr')

  return (
    <Stack
      sx={{
        minHeight: '100%',
        pb: { xs: 'calc(48px + env(safe-area-inset-bottom, 0px))', md: 0 },
      }}
    >
      <Box
        component="header"
        aria-label={title}
        sx={[
          {
            position: 'sticky',
            top: 0,
            zIndex: headerZIndex,
            mx: headerBleed ? { xs: -1.5, md: -2 } : 0,
            px: headerBleed ? { xs: 1.5, md: 2 } : 0,
            py: 1.25,
            mb: 1.5,
            bgcolor: raccoon.background.header,
            borderBottom: `1px solid ${raccoon.border.subtle}`,
            backdropFilter: 'blur(10px)',
          },
          ...(Array.isArray(headerSx) ? headerSx : headerSx ? [headerSx] : []),
        ]}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.25}
          sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          {breadcrumbs.length > 0 ? (
            <BreadcrumbNav items={breadcrumbs} direction={direction} />
          ) : (
            <Box component="span" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
              {title}
            </Box>
          )}

          {actions && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexShrink: 0 }}>
              {actions}
            </Box>
          )}
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Stack>
  )
}
