import type { Breakpoint, SxProps, Theme } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'
import type { ReactNode } from 'react'

export type DataTableAlign = 'start' | 'center' | 'end'

export type DataTableSortDirection = 'asc' | 'desc'

export type DataTableSortItem = {
  field: string
  sort: DataTableSortDirection
}

export type DataTableSortModel = DataTableSortItem[]

export type DataTableColumn<T> = {
  id: string
  header: ReactNode
  /** Optional header cell content override (defaults to `header`). */
  renderHeader?: () => ReactNode
  /** Extra `sx` merged into this column’s header cell. */
  headerSx?: SxProps<Theme>
  align?: DataTableAlign
  width?: number | string
  /**
   * When table-level `sortable` is on, controls this column (default `true`).
   * Ignored when `sortable` prop on `DataTable` is false.
   */
  sortable?: boolean
  /** Skip this column in the default card field list. */
  hideOnCard?: boolean
  /** Use this column’s cell as the card title (first match wins; else first visible column). */
  cardPrimary?: boolean
  /** Label beside the value on cards (defaults to `header`). */
  cardLabel?: ReactNode
  /** Cell content; if omitted, uses `row[id]` when `id` is a key of `T`. */
  render?: (row: T, index: number) => ReactNode
}

export type DataTableAction<T> = {
  key: string
  /** a11y / tooltip — host i18n */
  label: string
  icon?: SvgIconComponent
  color?: 'inherit' | 'primary' | 'error' | 'warning'
  disabled?: (row: T) => boolean
  hidden?: (row: T) => boolean
  onClick: (row: T) => void
}

/** Table-scoped context-menu entries (no row). */
export type DataTableTableMenuItem = {
  key: string
  label: string
  icon?: SvgIconComponent
  color?: 'inherit' | 'primary' | 'error' | 'warning'
  disabled?: boolean | (() => boolean)
  hidden?: boolean | (() => boolean)
  onClick: () => void
}

/**
 * Right-click menu controls.
 * - `enabled` — master switch (کلی)
 * - `row` — show row actions section (ردیف), same as the actions column
 * - `table` — show `tableItems` section (جدول)
 * On a row: row section, then separator, then table section (when both visible).
 * On empty grid chrome: table section only.
 */
export type DataTableContextMenuConfig = {
  /** Master switch. Default `false`. */
  enabled?: boolean
  /** Show actions column items on row right-click. Default `true` when enabled. */
  row?: boolean
  /** Show table-level items. Default `true` when enabled. */
  table?: boolean
  tableItems?: DataTableTableMenuItem[]
}

export type DataTableLabels = {
  rowsPerPage: string
  displayedRows: (from: number, to: number, count: number) => string
  /** Actions column header / card actions region label */
  labelActions?: string
  /** Tooltip / aria for the overflow “more” control */
  moreActions?: string
  /** Aria labels for numbered pagination controls */
  firstPage?: string
  lastPage?: string
  nextPage?: string
  previousPage?: string
  /** Aria label for the “select all on current page” checkbox (cards). */
  selectAll?: string
  /** Aria label for a per-row select checkbox. Receives the row id. */
  selectRow?: (rowId: string | number) => string
}

export type DataTableCardField = {
  id: string
  label: ReactNode
  value: ReactNode
}

/**
 * Context passed to `renderCard` so the host can compose or fully replace
 * the default card layout while reusing package-built pieces.
 */
export type DataTableCardRenderContext<T> = {
  row: T
  index: number
  title: ReactNode
  fields: DataTableCardField[]
  /** Inline + overflow action controls (same behavior as the table). */
  actionNodes: ReactNode
  /** Whether this row is currently selected (`checkboxSelection`). */
  selected?: boolean
  /** Checkbox control when `checkboxSelection` is on — host may place it in a custom layout. */
  selectionControl?: ReactNode
}

export type DataTableViewMode = 'auto' | 'table' | 'cards'

export type DataTableProps<T> = {
  rows: T[]
  getRowId: (row: T) => string | number
  columns: DataTableColumn<T>[]
  actions?: DataTableAction<T>[]
  /**
   * How many visible actions render as icon buttons before the overflow menu.
   * Default `2`.
   */
  maxInlineActions?: number

  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]

  cardBreakpoint?: Breakpoint | number
  viewMode?: DataTableViewMode
  /**
   * Customize card layout per row. Receives default `title`, `fields`, and
   * `actionNodes` for composition; return any ReactNode.
   */
  renderCard?: (ctx: DataTableCardRenderContext<T>) => ReactNode

  loading?: boolean
  emptyContent?: ReactNode
  labels: DataTableLabels
  dense?: boolean
  /** Max height for the scrollable table/cards body (header stays sticky in table mode). */
  maxHeight?: number | string

  /**
   * Show checkbox selection for rows (table + cards).
   * Default `false`.
   */
  checkboxSelection?: boolean
  /** Controlled selected row ids. */
  selectedRowIds?: Array<string | number>
  /** Uncontrolled initial selection when `selectedRowIds` is omitted. */
  defaultSelectedRowIds?: Array<string | number>
  onSelectionChange?: (ids: Array<string | number>) => void
  /** Default `false` (multi-select when checkboxSelection is on). */
  disableMultipleRowSelection?: boolean

  /**
   * Enable column header sorting (table / Data Grid mode only).
   * Default `false`. Per-column override via `column.sortable`.
   */
  sortable?: boolean
  /** Controlled sort model. */
  sortModel?: DataTableSortModel
  /** Uncontrolled initial sort when `sortModel` is omitted. */
  defaultSortModel?: DataTableSortModel
  onSortModelChange?: (model: DataTableSortModel) => void
  /**
   * Default `server` — host re-fetches / re-orders; grid does not reorder current page.
   * Use `client` to sort only the rows currently passed in.
   */
  sortingMode?: 'server' | 'client'

  /** Right-click context menu (table + cards). Off by default. */
  contextMenu?: DataTableContextMenuConfig
}
