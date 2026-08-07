import { Box, Card, CardActions, CardContent, Checkbox, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useRaccoonTheme } from '@raccoonland/theme'
import { useCallback, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import {
  buildCardFields,
  getCellValue,
  resolvePrimaryColumn,
} from './cellUtils'
import { DataTableActions } from './DataTableActions'
import {
  DataTableContextMenu,
  type DataTableContextMenuState,
} from './DataTableContextMenu'
import type {
  DataTableAction,
  DataTableCardRenderContext,
  DataTableColumn,
  DataTableContextMenuConfig,
  DataTableLabels,
} from './types'

export type DataTableCardsProps<T> = {
  rows: T[]
  getRowId: (row: T) => string | number
  columns: DataTableColumn<T>[]
  actions: DataTableAction<T>[]
  maxInlineActions: number
  labels: DataTableLabels
  dense?: boolean
  emptyContent?: ReactNode
  renderCard?: (ctx: DataTableCardRenderContext<T>) => ReactNode
  maxHeight?: number | string
  contextMenu?: DataTableContextMenuConfig
  checkboxSelection?: boolean
  selectedRowIds?: Array<string | number>
  defaultSelectedRowIds?: Array<string | number>
  onSelectionChange?: (ids: Array<string | number>) => void
  disableMultipleRowSelection?: boolean
}

function DefaultCardBody({
  title,
  fields,
  actionNodes,
  dense,
}: {
  title: ReactNode
  fields: { id: string; label: ReactNode; value: ReactNode }[]
  actionNodes: ReactNode
  dense?: boolean
}) {
  return (
    <>
      <CardContent sx={{ pb: actionNodes ? 1 : undefined, pt: dense ? 1.5 : 2 }}>
        {title != null && title !== '' ? (
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: fields.length ? 1.25 : 0 }}>
            {title}
          </Typography>
        ) : null}
        <Stack spacing={0.75}>
          {fields.map((field) => (
            <Box
              key={field.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 38%) minmax(0, 1fr)',
                columnGap: 1.5,
                alignItems: 'baseline',
              }}
            >
              <Typography variant="caption" color="text.secondary" component="div">
                {field.label}
              </Typography>
              <Typography variant="body2" component="div" sx={{ wordBreak: 'break-word' }}>
                {field.value ?? '—'}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
      {actionNodes ? (
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0, px: 1.5, pb: 1.25 }}>
          {actionNodes}
        </CardActions>
      ) : null}
    </>
  )
}

function idsEqual(a: Array<string | number>, b: Array<string | number>): boolean {
  if (a.length !== b.length) return false
  const set = new Set(a.map(String))
  return b.every((id) => set.has(String(id)))
}

export function DataTableCards<T>({
  rows,
  getRowId,
  columns,
  actions,
  maxInlineActions,
  labels,
  dense,
  emptyContent,
  renderCard,
  maxHeight,
  contextMenu,
  checkboxSelection = false,
  selectedRowIds,
  defaultSelectedRowIds = [],
  onSelectionChange,
  disableMultipleRowSelection = false,
}: DataTableCardsProps<T>) {
  const raccoon = useRaccoonTheme()
  const primary = resolvePrimaryColumn(columns)

  const contextEnabled = contextMenu?.enabled ?? false
  const showRowContext = contextEnabled && contextMenu?.row !== false
  const showTableContext = contextEnabled && contextMenu?.table !== false
  const tableMenuItems = contextMenu?.tableItems ?? []

  const [menuState, setMenuState] = useState<DataTableContextMenuState<T> | null>(null)

  const selectionControlled = selectedRowIds !== undefined
  const [uncontrolledSelection, setUncontrolledSelection] =
    useState<Array<string | number>>(defaultSelectedRowIds)
  const selectedIds = selectionControlled ? selectedRowIds : uncontrolledSelection

  const selectedIdSet = useMemo(
    () => new Set(selectedIds.map(String)),
    [selectedIds],
  )

  const setSelection = useCallback(
    (next: Array<string | number>) => {
      if (!selectionControlled) {
        setUncontrolledSelection(next)
      }
      onSelectionChange?.(next)
    },
    [onSelectionChange, selectionControlled],
  )

  const toggleRow = useCallback(
    (rowId: string | number) => {
      const key = String(rowId)
      const isSelected = selectedIdSet.has(key)
      if (disableMultipleRowSelection) {
        setSelection(isSelected ? [] : [rowId])
        return
      }
      if (isSelected) {
        setSelection(selectedIds.filter((id) => String(id) !== key))
      } else {
        setSelection([...selectedIds, rowId])
      }
    },
    [disableMultipleRowSelection, selectedIdSet, selectedIds, setSelection],
  )

  const pageIds = useMemo(() => rows.map((r) => getRowId(r)), [getRowId, rows])
  const selectedOnPage = pageIds.filter((id) => selectedIdSet.has(String(id)))
  const allPageSelected = pageIds.length > 0 && selectedOnPage.length === pageIds.length
  const somePageSelected = selectedOnPage.length > 0 && !allPageSelected

  const toggleAllOnPage = useCallback(() => {
    if (disableMultipleRowSelection) return
    if (allPageSelected) {
      const pageKeys = new Set(pageIds.map(String))
      setSelection(selectedIds.filter((id) => !pageKeys.has(String(id))))
      return
    }
    const merged = [...selectedIds]
    for (const id of pageIds) {
      if (!selectedIdSet.has(String(id))) merged.push(id)
    }
    if (!idsEqual(merged, selectedIds)) setSelection(merged)
  }, [
    allPageSelected,
    disableMultipleRowSelection,
    pageIds,
    selectedIdSet,
    selectedIds,
    setSelection,
  ])

  const openContextMenu = useCallback((event: MouseEvent, row: T | null) => {
    event.preventDefault()
    event.stopPropagation()
    setMenuState({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      row,
    })
  }, [])

  const handleCapture = useCallback(
    (event: MouseEvent) => {
      if (!contextEnabled) return
      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest('.MuiMenu-root, .MuiPopover-root, .MuiModal-root')) return

      const cardEl = target.closest('[data-dt-card-id]')
      if (cardEl) {
        const rowId = cardEl.getAttribute('data-dt-card-id')
        const row =
          rowId == null ? null : (rows.find((r) => String(getRowId(r)) === rowId) ?? null)
        openContextMenu(event, row)
        return
      }

      openContextMenu(event, null)
    },
    [contextEnabled, getRowId, openContextMenu, rows],
  )

  if (rows.length === 0) {
    return (
      <Box
        sx={{ py: 4, textAlign: 'center' }}
        onContextMenuCapture={contextEnabled ? handleCapture : undefined}
      >
        {emptyContent ?? (
          <Typography color="text.secondary" variant="body2">
            —
          </Typography>
        )}
        <DataTableContextMenu
          state={menuState}
          onClose={() => setMenuState(null)}
          showRowSection={showRowContext}
          showTableSection={showTableContext}
          rowActions={actions}
          tableItems={tableMenuItems}
        />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        ...(maxHeight != null
          ? {
              maxHeight,
              overflowY: 'auto',
              overflowX: 'hidden',
              minHeight: 0,
              WebkitOverflowScrolling: 'touch',
            }
          : null),
        ...(contextEnabled ? { '& .MuiCard-root': { cursor: 'context-menu' } } : null),
      }}
      onContextMenuCapture={contextEnabled ? handleCapture : undefined}
    >
      {checkboxSelection && !disableMultipleRowSelection && pageIds.length > 0 ? (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, px: 0.5 }}>
          <Checkbox
            size="small"
            checked={allPageSelected}
            indeterminate={somePageSelected}
            onChange={toggleAllOnPage}
            inputProps={{
              'aria-label': labels.selectAll ?? 'Select all rows on this page',
            }}
          />
        </Box>
      ) : null}

      <Stack spacing={1.5}>
        {rows.map((row, index) => {
          const rowId = getRowId(row)
          const rowIdKey = String(rowId)
          const isSelected = selectedIdSet.has(rowIdKey)
          const isContextTarget =
            menuState?.row != null && String(getRowId(menuState.row)) === rowIdKey
          const title = primary ? getCellValue(primary, row, index) : null
          const fields = buildCardFields(columns, row, index, primary?.id)
          const actionNodes =
            actions.length > 0 ? (
              <DataTableActions
                row={row}
                actions={actions}
                maxInlineActions={maxInlineActions}
                moreActionsLabel={labels.moreActions}
                dense={dense}
              />
            ) : null

          const selectionControl = checkboxSelection ? (
            <Checkbox
              size="small"
              checked={isSelected}
              onChange={() => toggleRow(rowId)}
              onClick={(event) => event.stopPropagation()}
              inputProps={{
                'aria-label':
                  labels.selectRow?.(rowId) ?? `Select row ${rowIdKey}`,
              }}
              sx={{ mt: 0.5 }}
            />
          ) : null

          const ctx: DataTableCardRenderContext<T> = {
            row,
            index,
            title,
            fields,
            actionNodes,
            selected: isSelected,
            selectionControl,
          }

          return (
            <Card
              key={rowIdKey}
              variant="outlined"
              data-dt-card-id={rowIdKey}
              aria-selected={checkboxSelection ? isSelected : undefined}
              sx={{
                bgcolor: isContextTarget
                  ? alpha(raccoon.primary.main, 0.12)
                  : isSelected
                    ? alpha(raccoon.primary.main, 0.08)
                    : raccoon.background.paper,
                borderColor: isContextTarget
                  ? alpha(raccoon.primary.main, 0.4)
                  : isSelected
                    ? alpha(raccoon.primary.main, 0.35)
                    : raccoon.border.subtle,
                flexShrink: 0,
              }}
            >
              {renderCard ? (
                renderCard(ctx)
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  {selectionControl ? (
                    <Box sx={{ pl: 0.75, pt: dense ? 1 : 1.25 }}>{selectionControl}</Box>
                  ) : null}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <DefaultCardBody
                      title={title}
                      fields={fields}
                      actionNodes={actionNodes}
                      dense={dense}
                    />
                  </Box>
                </Box>
              )}
            </Card>
          )
        })}
      </Stack>
      <DataTableContextMenu
        state={menuState}
        onClose={() => setMenuState(null)}
        showRowSection={showRowContext}
        showTableSection={showTableContext}
        rowActions={actions}
        tableItems={tableMenuItems}
      />
    </Box>
  )
}
