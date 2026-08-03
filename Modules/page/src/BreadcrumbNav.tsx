import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { alpha, Box, Breadcrumbs, Link as MuiLink, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { SvgIconComponent } from '@mui/icons-material'
import { useRaccoonTheme } from '@raccoonland/theme'
import { resolveBreadcrumbIcon } from './breadcrumbUtils'

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: SvgIconComponent
}

type BreadcrumbNavProps = {
  items: BreadcrumbItem[]
  /** Document / layout direction for separator mirroring */
  direction?: 'ltr' | 'rtl'
}

function BreadcrumbContent({
  label,
  icon: Icon,
  current,
}: {
  label: string
  icon?: SvgIconComponent
  current?: boolean
}) {
  const raccoon = useRaccoonTheme()

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{
        alignItems: 'center',
        ...(current && {
          px: 1,
          py: 0.35,
          borderRadius: 1,
          bgcolor: alpha(raccoon.primary.main, 0.1),
          border: `1px solid ${alpha(raccoon.primary.main, 0.22)}`,
        }),
      }}
    >
      {Icon && (
        <Icon
          sx={{
            fontSize: current ? 17 : 15,
            color: current ? 'primary.main' : 'text.disabled',
          }}
        />
      )}
      <Box
        component="span"
        sx={{
          fontSize: current ? '0.875rem' : '0.8125rem',
          fontWeight: current ? 700 : 500,
          color: current ? 'text.primary' : 'text.secondary',
          lineHeight: 1.3,
        }}
      >
        {label}
      </Box>
    </Stack>
  )
}

export function BreadcrumbNav({ items, direction = 'ltr' }: BreadcrumbNavProps) {
  const raccoon = useRaccoonTheme()

  if (items.length === 0) {
    return null
  }

  return (
    <Breadcrumbs
      separator={
        <NavigateNextIcon
          fontSize="small"
          sx={{
            transform: direction === 'rtl' ? 'rotate(180deg)' : 'none',
            color: raccoon.text.disabled,
          }}
        />
      }
      aria-label="breadcrumb"
      sx={{
        '& .MuiBreadcrumbs-li': {
          display: 'flex',
          alignItems: 'center',
        },
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const icon = resolveBreadcrumbIcon(item)

        if (isLast || !item.href) {
          return (
            <Typography
              key={`${item.label}-${index}`}
              component="span"
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <BreadcrumbContent label={item.label} icon={icon} current={isLast} />
            </Typography>
          )
        }

        return (
          <MuiLink
            key={`${item.label}-${index}`}
            component={RouterLink}
            to={item.href}
            underline="none"
            color="inherit"
            sx={{
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <BreadcrumbContent label={item.label} icon={icon} />
          </MuiLink>
        )
      })}
    </Breadcrumbs>
  )
}
