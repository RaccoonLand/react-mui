import type { DataTableAction } from './types'

export type DataTableActionColor = NonNullable<DataTableAction<unknown>['color']>

/** Icon `sx.color` for overflow / context-menu ListItemIcon. */
export function actionMenuIconSx(
  color: DataTableActionColor | undefined,
): { color: string } | undefined {
  if (color === 'error') return { color: 'error.main' }
  if (color === 'warning') return { color: 'warning.main' }
  if (color === 'primary') return { color: 'primary.main' }
  return undefined
}

/**
 * Typography `color` prop for ListItemText in menus.
 * Mirrors IconButton `color` semantics for primary / error / warning.
 */
export function actionMenuTextColor(
  color: DataTableActionColor | undefined,
): 'primary' | 'error' | 'warning' | undefined {
  if (color === 'primary' || color === 'error' || color === 'warning') {
    return color
  }
  return undefined
}
