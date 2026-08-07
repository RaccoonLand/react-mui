import type { ReactNode } from 'react'
import type { DataTableCardField, DataTableColumn, DataTableViewMode } from './types'

export function isDataTableCardView(
  viewMode: DataTableViewMode,
  isBelowBreakpoint: boolean,
): boolean {
  if (viewMode === 'cards') return true
  if (viewMode === 'table') return false
  return isBelowBreakpoint
}

export function alignToTableAlign(
  align: DataTableColumn<unknown>['align'],
): 'left' | 'center' | 'right' | undefined {
  if (!align || align === 'start') return 'left'
  if (align === 'end') return 'right'
  return 'center'
}

export function getCellValue<T>(
  column: DataTableColumn<T>,
  row: T,
  index: number,
): ReactNode {
  if (column.render) {
    return column.render(row, index)
  }

  if (row != null && typeof row === 'object' && column.id in row) {
    const value = (row as Record<string, unknown>)[column.id]
    if (value == null) return null
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return String(value)
    }
  }

  return null
}

export function resolvePrimaryColumn<T>(
  columns: DataTableColumn<T>[],
): DataTableColumn<T> | undefined {
  const visible = columns.filter((c) => !c.hideOnCard)
  return visible.find((c) => c.cardPrimary) ?? visible[0]
}

export function buildCardFields<T>(
  columns: DataTableColumn<T>[],
  row: T,
  index: number,
  primaryId: string | undefined,
): DataTableCardField[] {
  return columns
    .filter((c) => !c.hideOnCard && c.id !== primaryId)
    .map((c) => ({
      id: c.id,
      label: c.cardLabel ?? c.header,
      value: getCellValue(c, row, index),
    }))
}
