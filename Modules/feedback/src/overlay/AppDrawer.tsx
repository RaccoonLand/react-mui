import CloseIcon from '@mui/icons-material/Close'
import {
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  type DrawerProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import type { ReactNode } from 'react'
import { useRaccoonTheme } from '@raccoonland/theme'

const DEFAULT_DRAWER_WIDTH = 360

type AppDrawerProps = {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  anchor?: DrawerProps['anchor']
  width?: number
  closeLabel?: string
  contentSx?: SxProps<Theme>
  disableRestoreFocus?: boolean
}

export function AppDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  anchor = 'right',
  width = DEFAULT_DRAWER_WIDTH,
  closeLabel,
  contentSx,
  disableRestoreFocus = false,
}: AppDrawerProps) {
  const raccoon = useRaccoonTheme()

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      disableRestoreFocus={disableRestoreFocus}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: width },
            maxWidth: '100vw',
            boxSizing: 'border-box',
            bgcolor: raccoon.background.paper,
            borderInlineStart: `1px solid ${raccoon.border.subtle}`,
          },
        },
      }}
    >
      <Stack sx={{ height: '100%' }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingInline: 2,
            py: 1.5,
            borderBottom: `1px solid ${raccoon.border.subtle}`,
            bgcolor: raccoon.background.header,
          }}
        >
          {typeof title === 'string' ? (
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
          ) : (
            <Typography variant="h6" fontWeight={700} component="div">
              {title}
            </Typography>
          )}
          <IconButton onClick={onClose} aria-label={closeLabel ?? 'Close'}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack
          spacing={1.5}
          sx={{ flex: 1, overflow: 'auto', paddingInline: 2, py: 2, ...contentSx }}
        >
          {children}
        </Stack>

        {footer && (
          <>
            <Divider />
            {footer}
          </>
        )}
      </Stack>
    </Drawer>
  )
}
