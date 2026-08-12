import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material'
import { useId, useState, type MouseEvent } from 'react'
import { actionMenuIconSx, actionMenuTextColor } from './actionColorUtils'
import type { DataTableAction } from './types'

const DEFAULT_MAX_INLINE = 2

export type DataTableActionsProps<T> = {
  row: T
  actions: DataTableAction<T>[]
  maxInlineActions?: number
  moreActionsLabel?: string
  /** Slightly denser icon buttons for table cells */
  dense?: boolean
}

export function DataTableActions<T>({
  row,
  actions,
  maxInlineActions = DEFAULT_MAX_INLINE,
  moreActionsLabel = 'More actions',
  dense,
}: DataTableActionsProps<T>) {
  const menuId = useId()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const visible = actions.filter((a) => !(a.hidden?.(row) ?? false))
  if (visible.length === 0) return null

  const inlineCount = Math.max(0, maxInlineActions)
  const inline = visible.slice(0, inlineCount)
  const overflow = visible.slice(inlineCount)

  const size = dense ? 'small' : 'medium'

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  return (
    <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
      {inline.map((action) => {
        const Icon = action.icon
        const disabled = action.disabled?.(row) ?? false
        return (
          <Tooltip
            key={action.key}
            title={action.label}
            disableInteractive
            enterDelay={400}
            enterNextDelay={400}
          >
            <span>
              <IconButton
                size={size}
                color={action.color ?? 'inherit'}
                aria-label={action.label}
                disabled={disabled}
                onClick={() => action.onClick(row)}
              >
                {Icon ? <Icon fontSize="small" /> : action.label}
              </IconButton>
            </span>
          </Tooltip>
        )
      })}

      {overflow.length > 0 ? (
        <>
          <Tooltip
            title={moreActionsLabel}
            disableInteractive
            enterDelay={400}
            enterNextDelay={400}
          >
            <IconButton
              size={size}
              aria-label={moreActionsLabel}
              aria-controls={open ? menuId : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={openMenu}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {overflow.map((action) => {
              const Icon = action.icon
              const disabled = action.disabled?.(row) ?? false
              const iconSx = actionMenuIconSx(action.color)
              const textColor = actionMenuTextColor(action.color)
              return (
                <MenuItem
                  key={action.key}
                  disabled={disabled}
                  onClick={() => {
                    closeMenu()
                    action.onClick(row)
                  }}
                >
                  {Icon ? (
                    <ListItemIcon sx={iconSx}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                  ) : null}
                  <ListItemText
                    primary={action.label}
                    primaryTypographyProps={{
                      color: textColor,
                    }}
                  />
                </MenuItem>
              )
            })}
          </Menu>
        </>
      ) : null}
    </Stack>
  )
}
