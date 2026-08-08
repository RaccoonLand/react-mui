import type { SvgIconComponent } from '@mui/icons-material'
import { Box, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridRowClassNameParams,
  type GridRowSelectionModel,
  type GridSortModel,
  type GridValidRowModel,
} from '@mui/x-data-grid'
import { useRaccoonTheme } from '@raccoonland/theme'
import { useCallback, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import { alignToTableAlign, getCellValue } from './cellUtils'
import { DataTableActions } from './DataTableActions'
import {
  DataTableContextMenu,
  type DataTableContextMenuState,
} from './DataTableContextMenu'
import { resolveDataTableEmptyNode } from './DataTableEmptyState'
import type {
  DataTableAction,
  DataTableColumn,
  DataTableContextMenuConfig,
  DataTableLabels,
  DataTableSortModel,
} from './types'

/** Local stacking only — must stay below Page breadcrumb (`headerZIndex` default 9). */
const TABLE_HEADER_Z_INDEX = 2
const ACTIONS_FIELD = '__actions'

export type DataTableGridProps<T> = {
  rows: T[]
  getRowId: (row: T) => string | number
  columns: DataTableColumn<T>[]
  actions: DataTableAction<T>[]
  maxInlineActions: number
  labels: DataTableLabels
  dense?: boolean
  emptyContent?: ReactNode
  emptyIcon?: SvgIconComponent
  emptyMessage?: ReactNode
  maxHeight?: number | string
  loading?: boolean
  checkboxSelection?: boolean
  selectedRowIds?: Array<string | number>
  defaultSelectedRowIds?: Array<string | number>
  onSelectionChange?: (ids: Array<string | number>) => void
  disableMultipleRowSelection?: boolean
  sortable?: boolean
  sortModel?: DataTableSortModel
  defaultSortModel?: DataTableSortModel
  onSortModelChange?: (model: DataTableSortModel) => void
  sortingMode?: 'server' | 'client'
  contextMenu?: DataTableContextMenuConfig
}

function parseWidth(width: number | string | undefined): {
  width?: number
  flex?: number
  minWidth?: number
} {
  if (width == null) return { flex: 1, minWidth: 100 }
  if (typeof width === 'number') return { width }
  const asNumber = Number.parseFloat(width)
  if (!Number.isNaN(asNumber) && String(asNumber) === String(width).replace(/px$/i, '')) {
    return { width: asNumber }
  }
  return { flex: 1, minWidth: 100 }
}

function toGridSelectionModel(ids: Array<string | number>): GridRowSelectionModel {
  return { type: 'include', ids: new Set(ids) }
}

/**
 * Convert Data Grid selection model to a flat id list.
 * V8+ may emit `{ type: 'exclude', ids }` for “select all” — expand against known row ids.
 */
function fromGridSelectionModel(
  model: GridRowSelectionModel,
  allRowIds: Array<string | number>,
): Array<string | number> {
  if (model.type === 'include') {
    return Array.from(model.ids)
  }
  const excluded = new Set(Array.from(model.ids, String))
  return allRowIds.filter((id) => !excluded.has(String(id)))
}

function toGridSortModel(model: DataTableSortModel): GridSortModel {
  return model.map((item) => ({ field: item.field, sort: item.sort }))
}

function fromGridSortModel(model: GridSortModel): DataTableSortModel {
  return model
    .filter((item): item is { field: string; sort: 'asc' | 'desc' } => item.sort === 'asc' || item.sort === 'desc')
    .map((item) => ({ field: item.field, sort: item.sort }))
}

export function DataTableGrid<T>({
  rows,
  getRowId,
  columns,
  actions,
  maxInlineActions,
  labels,
  dense,
  emptyContent,
  emptyIcon,
  emptyMessage,
  maxHeight,
  loading = false,
  checkboxSelection = false,
  selectedRowIds,
  defaultSelectedRowIds = [],
  onSelectionChange,
  disableMultipleRowSelection = false,
  sortable = false,
  sortModel: sortModelProp,
  defaultSortModel = [],
  onSortModelChange,
  sortingMode = 'server',
  contextMenu,
}: DataTableGridProps<T>) {
  const theme = useTheme()
  const raccoon = useRaccoonTheme()
  const showActions = actions.length > 0
  const actionsLabel = labels.labelActions ?? 'Actions'

  const contextEnabled = contextMenu?.enabled ?? false
  const showRowContext = contextEnabled && contextMenu?.row !== false
  const showTableContext = contextEnabled && contextMenu?.table !== false
  const tableMenuItems = contextMenu?.tableItems ?? []

  const [menuState, setMenuState] = useState<DataTableContextMenuState<T> | null>(null)

  const closeContextMenu = useCallback(() => {
    setMenuState(null)
  }, [])

  /** Capture-phase so we always get the event before Data Grid internals. */
  const handleContextMenuCapture = useCallback(
    (event: MouseEvent) => {
      if (!contextEnabled) return

      const target = event.target
      if (!(target instanceof Element)) return

      // Ignore clicks that originate inside an already-open MUI menu portal.
      if (target.closest('.MuiMenu-root, .MuiPopover-root, .MuiModal-root')) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const rowEl = target.closest('.MuiDataGrid-row[data-id], [role="row"][data-id]')
      let row: T | null = null
      if (rowEl) {
        const rowId = rowEl.getAttribute('data-id')
        if (rowId != null) {
          row = rows.find((r) => String(getRowId(r)) === rowId) ?? null
        }
      }

      setMenuState({
        mouseX: event.clientX + 2,
        mouseY: event.clientY - 6,
        row,
      })
    },
    [contextEnabled, getRowId, rows],
  )

  const primaryMix = theme.palette.mode === 'light' ? 32 : 36
  const headerBg = `color-mix(in srgb, ${raccoon.primary.main} ${primaryMix}%, ${raccoon.background.elevated})`
  const headerShadow = `0 6px 20px ${alpha(raccoon.text.primary, 0.12)}`

  const selectionControlled = selectedRowIds !== undefined
  const [uncontrolledSelection, setUncontrolledSelection] = useState(() =>
    toGridSelectionModel(defaultSelectedRowIds),
  )
  const selectionModel = selectionControlled
    ? toGridSelectionModel(selectedRowIds)
    : uncontrolledSelection

  const sortControlled = sortModelProp !== undefined
  const [uncontrolledSort, setUncontrolledSort] = useState(() => toGridSortModel(defaultSortModel))
  const gridSortModel = sortControlled ? toGridSortModel(sortModelProp) : uncontrolledSort

  const handleSelectionChange = useCallback(
    (model: GridRowSelectionModel) => {
      const allRowIds = rows.map((r) => getRowId(r))
      const nextIds = fromGridSelectionModel(model, allRowIds)
      if (!selectionControlled) {
        // Always store as include so controlled/uncontrolled stay consistent.
        setUncontrolledSelection(toGridSelectionModel(nextIds))
      }
      onSelectionChange?.(nextIds)
    },
    [getRowId, onSelectionChange, rows, selectionControlled],
  )

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      const next = fromGridSortModel(model)
      if (!sortControlled) {
        setUncontrolledSort(toGridSortModel(next))
      }
      onSortModelChange?.(next)
    },
    [onSortModelChange, sortControlled],
  )

  /**
   * O(1) row-id → page-index lookup, so `renderCell` doesn't do O(n) findIndex
   * on every cell (which is O(n²) across the visible page).
   */
  const rowIndexById = useMemo(() => {
    const map = new Map<string, number>()
    rows.forEach((row, index) => {
      map.set(String(getRowId(row)), index)
    })
    return map
  }, [getRowId, rows])

  const gridColumns = useMemo((): GridColDef[] => {
    const mapped: GridColDef[] = columns.map((column) => {
      const size = parseWidth(column.width)
      const align = alignToTableAlign(column.align)
      const columnSortable = sortable && column.sortable !== false
      return {
        field: column.id,
        headerName: typeof column.header === 'string' ? column.header : column.id,
        sortable: columnSortable,
        filterable: false,
        disableColumnMenu: true,
        ...size,
        align,
        headerAlign: align,
        renderHeader: () => (
          <Box
            component="span"
            sx={[
              { fontWeight: 700, whiteSpace: 'nowrap' },
              ...(Array.isArray(column.headerSx)
                ? column.headerSx
                : column.headerSx
                  ? [column.headerSx]
                  : []),
            ]}
          >
            {column.renderHeader ? column.renderHeader() : column.header}
          </Box>
        ),
        renderCell: (params: GridRenderCellParams) => {
          const row = params.row as T
          const index = rowIndexById.get(String(params.id)) ?? 0
          return getCellValue(column, row, index)
        },
      }
    })

    if (showActions) {
      mapped.push({
        field: ACTIONS_FIELD,
        headerName: actionsLabel,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        width: 120,
        align: 'right',
        headerAlign: 'right',
        renderHeader: () => (
          <Box component="span" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
            {actionsLabel}
          </Box>
        ),
        renderCell: (params: GridRenderCellParams) => (
          <DataTableActions
            row={params.row as T}
            actions={actions}
            maxInlineActions={maxInlineActions}
            moreActionsLabel={labels.moreActions}
            dense={dense}
          />
        ),
      })
    }

    return mapped
  }, [
    actions,
    actionsLabel,
    columns,
    dense,
    labels.moreActions,
    maxInlineActions,
    rowIndexById,
    showActions,
    sortable,
  ])

  const gridRows = rows as GridValidRowModel[]

  const contextRowId =
    menuState?.row != null ? String(getRowId(menuState.row)) : null

  const getRowClassName = useCallback(
    (params: GridRowClassNameParams<GridValidRowModel>) =>
      contextRowId != null && String(params.id) === contextRowId
        ? 'DataTable-contextMenuRow'
        : '',
    [contextRowId],
  )

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        ...(maxHeight != null ? { height: maxHeight, maxHeight } : null),
        ...(contextEnabled ? { '& .MuiDataGrid-row': { cursor: 'context-menu' } } : null),
      }}
      onContextMenuCapture={contextEnabled ? handleContextMenuCapture : undefined}
    >
      <DataGrid
        rows={gridRows}
        columns={gridColumns}
        getRowId={(row) => getRowId(row as T)}
        getRowClassName={contextEnabled ? getRowClassName : undefined}
        loading={loading}
        hideFooter
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableRowSelectionOnClick
        checkboxSelection={checkboxSelection}
        disableMultipleRowSelection={disableMultipleRowSelection}
        disableRowSelectionExcludeModel
        rowSelectionModel={checkboxSelection ? selectionModel : undefined}
        onRowSelectionModelChange={checkboxSelection ? handleSelectionChange : undefined}
        sortingMode={sortingMode}
        sortModel={sortable ? gridSortModel : []}
        onSortModelChange={sortable ? handleSortModelChange : undefined}
        density={dense ? 'compact' : 'standard'}
        autoHeight={maxHeight == null}
        slots={{
          noRowsOverlay: () => (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
              }}
            >
              {resolveDataTableEmptyNode({ emptyContent, emptyIcon, emptyMessage })}
            </Box>
          ),
        }}
        sx={{
          border: 'none',
          bgcolor: raccoon.background.paper,
          ...(maxHeight != null ? { height: '100%' } : null),
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: headerBg,
            backgroundImage: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            borderBottom: `1px solid ${raccoon.border.subtle}`,
            boxShadow: headerShadow,
            zIndex: TABLE_HEADER_Z_INDEX,
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: headerBg,
            backgroundImage: 'none',
            color: raccoon.text.primary,
            fontWeight: 700,
          },
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottomColor: raccoon.border.subtle,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: alpha(raccoon.primary.main, 0.04),
          },
          '& .MuiDataGrid-row.DataTable-contextMenuRow': {
            bgcolor: alpha(raccoon.primary.main, 0.12),
          },
          '& .MuiDataGrid-row.DataTable-contextMenuRow:hover': {
            bgcolor: alpha(raccoon.primary.main, 0.14),
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: raccoon.background.paper,
          },
          '& .MuiDataGrid-overlayWrapper': {
            minHeight: rows.length === 0 ? 120 : undefined,
          },
        }}
      />
      <DataTableContextMenu
        state={menuState}
        onClose={closeContextMenu}
        showRowSection={showRowContext}
        showTableSection={showTableContext}
        rowActions={actions}
        tableItems={tableMenuItems}
      />
    </Box>
  )
}
