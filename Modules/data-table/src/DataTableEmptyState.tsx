import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import type { SvgIconComponent } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export type DataTableEmptyStateProps = {
  /** Optional; defaults to `InboxOutlined`. */
  icon?: SvgIconComponent
  /** Optional message under the icon. Omitted → icon-only (package fallback). */
  message?: ReactNode
}

/**
 * Shared empty chrome for table + cards.
 * Fallback (no message): icon only. Host may pass `icon` and/or `message`.
 */
export function DataTableEmptyState({
  icon: Icon = InboxOutlinedIcon,
  message,
}: DataTableEmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: message != null && message !== '' ? 1 : 0,
        px: 2,
        py: 1,
        color: 'text.disabled',
        userSelect: 'none',
      }}
    >
      <Icon sx={{ fontSize: 40, opacity: 0.72 }} aria-hidden />
      {message != null && message !== '' ? (
        <Typography color="text.secondary" variant="body2" textAlign="center">
          {message}
        </Typography>
      ) : null}
    </Box>
  )
}

/** Resolve empty UI: full `emptyContent` override, else structured icon/message (icon-only fallback). */
export function resolveDataTableEmptyNode(options: {
  emptyContent?: ReactNode
  emptyIcon?: SvgIconComponent
  emptyMessage?: ReactNode
}): ReactNode {
  if (options.emptyContent != null) {
    return options.emptyContent
  }
  return (
    <DataTableEmptyState icon={options.emptyIcon} message={options.emptyMessage} />
  )
}
