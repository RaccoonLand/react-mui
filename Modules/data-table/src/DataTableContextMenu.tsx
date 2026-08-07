import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import { useRef, type MouseEvent as ReactMouseEvent } from 'react'
import type { DataTableAction, DataTableTableMenuItem } from './types'

export type DataTableContextMenuState<T> = {
  mouseX: number
  mouseY: number
  /** Present when opened from a row / card. */
  row: T | null
}

export type DataTableContextMenuProps<T> = {
  state: DataTableContextMenuState<T> | null
  onClose: () => void
  /** Show row-actions section when `state.row` is set. */
  showRowSection: boolean
  /** Show table-level items section. */
  showTableSection: boolean
  rowActions: DataTableAction<T>[]
  tableItems: DataTableTableMenuItem[]
}

function isTableItemHidden(item: DataTableTableMenuItem): boolean {
  if (typeof item.hidden === 'function') return item.hidden()
  return item.hidden ?? false
}

function isTableItemDisabled(item: DataTableTableMenuItem): boolean {
  if (typeof item.disabled === 'function') return item.disabled()
  return item.disabled ?? false
}

export function DataTableContextMenu<T>({
  state,
  onClose,
  showRowSection,
  showTableSection,
  rowActions,
  tableItems,
}: DataTableContextMenuProps<T>) {
  const open = state != null

  // Keep last content while the close animation runs so row items don't
  // disappear one frame early (which looked like a flashing table-only menu).
  const displayRef = useRef<DataTableContextMenuState<T> | null>(null)
  if (state != null) {
    displayRef.current = state
  }
  const display = state ?? displayRef.current
  const row = display?.row ?? null

  const visibleRowActions =
    showRowSection && row != null
      ? rowActions.filter((a) => !(a.hidden?.(row) ?? false))
      : []

  const visibleTableItems = showTableSection
    ? tableItems.filter((item) => !isTableItemHidden(item))
    : []

  const showSeparator = visibleRowActions.length > 0 && visibleTableItems.length > 0
  const hasItems = visibleRowActions.length > 0 || visibleTableItems.length > 0

  return (
    <Menu
      open={open && hasItems}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        display ? { top: display.mouseY, left: display.mouseX } : undefined
      }
      TransitionProps={{
        onExited: () => {
          displayRef.current = null
        },
      }}
      slotProps={{
        list: { dense: true },
        root: {
          onContextMenu: (event: ReactMouseEvent) => {
            event.preventDefault()
            const target = event.target
            if (!(target instanceof Element)) return
            // Right-click on the backdrop dismisses; keep open if on the paper itself.
            if (!target.closest('.MuiMenu-paper')) {
              onClose()
            }
          },
        },
      }}
    >
      {visibleRowActions.map((action) => {
        const Icon = action.icon
        const disabled = action.disabled?.(row as T) ?? false
        return (
          <MenuItem
            key={`row-${action.key}`}
            disabled={disabled}
            onClick={() => {
              onClose()
              action.onClick(row as T)
            }}
          >
            {Icon ? (
              <ListItemIcon sx={{ color: action.color === 'error' ? 'error.main' : undefined }}>
                <Icon fontSize="small" />
              </ListItemIcon>
            ) : null}
            <ListItemText
              primary={action.label}
              primaryTypographyProps={{
                color: action.color === 'error' ? 'error' : undefined,
              }}
            />
          </MenuItem>
        )
      })}

      {showSeparator ? <Divider component="li" /> : null}

      {visibleTableItems.map((item) => {
        const Icon = item.icon
        const disabled = isTableItemDisabled(item)
        return (
          <MenuItem
            key={`table-${item.key}`}
            disabled={disabled}
            onClick={() => {
              onClose()
              item.onClick()
            }}
          >
            {Icon ? (
              <ListItemIcon sx={{ color: item.color === 'error' ? 'error.main' : undefined }}>
                <Icon fontSize="small" />
              </ListItemIcon>
            ) : null}
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                color: item.color === 'error' ? 'error' : undefined,
              }}
            />
          </MenuItem>
        )
      })}
    </Menu>
  )
}
