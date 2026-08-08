import { Box, LinearProgress, Paper, useMediaQuery, useTheme } from '@mui/material'
import { useRaccoonTheme } from '@raccoonland/theme'
import { DataTableCards } from './DataTableCards'
import { DataTableGrid } from './DataTableGrid'
import { DataTablePagination } from './DataTablePagination'
import { isDataTableCardView } from './cellUtils'
import type { DataTableProps } from './types'

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50]
const DEFAULT_MAX_INLINE_ACTIONS = 2

export function DataTable<T>({
  rows,
  getRowId,
  columns,
  actions = [],
  maxInlineActions = DEFAULT_MAX_INLINE_ACTIONS,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  cardBreakpoint = 'md',
  cardColumns,
  viewMode = 'auto',
  renderCard,
  loading = false,
  emptyContent,
  emptyIcon,
  emptyMessage,
  labels,
  dense,
  maxHeight,
  checkboxSelection = false,
  selectedRowIds,
  defaultSelectedRowIds,
  onSelectionChange,
  disableMultipleRowSelection = false,
  sortable = false,
  sortModel,
  defaultSortModel,
  onSortModelChange,
  sortingMode = 'server',
  contextMenu,
}: DataTableProps<T>) {
  const theme = useTheme()
  const raccoon = useRaccoonTheme()
  const isBelowBreakpoint = useMediaQuery(theme.breakpoints.down(cardBreakpoint))
  const useCards = isDataTableCardView(viewMode, isBelowBreakpoint)

  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: raccoon.background.paper,
        borderColor: raccoon.border.subtle,
      }}
    >
      {loading ? (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            height: 2,
          }}
        />
      ) : null}

      <Box
        aria-busy={loading || undefined}
        sx={{
          opacity: loading ? 0.65 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          transition: 'opacity 120ms ease',
        }}
      >
        {useCards ? (
          <DataTableCards
            rows={rows}
            getRowId={getRowId}
            columns={columns}
            actions={actions}
            maxInlineActions={maxInlineActions}
            labels={labels}
            dense={dense}
            emptyContent={emptyContent}
            emptyIcon={emptyIcon}
            emptyMessage={emptyMessage}
            renderCard={renderCard}
            maxHeight={maxHeight}
            cardColumns={cardColumns}
            contextMenu={contextMenu}
            checkboxSelection={checkboxSelection}
            selectedRowIds={selectedRowIds}
            defaultSelectedRowIds={defaultSelectedRowIds}
            onSelectionChange={onSelectionChange}
            disableMultipleRowSelection={disableMultipleRowSelection}
          />
        ) : (
          <DataTableGrid
            rows={rows}
            getRowId={getRowId}
            columns={columns}
            actions={actions}
            maxInlineActions={maxInlineActions}
            labels={labels}
            dense={dense}
            emptyContent={emptyContent}
            emptyIcon={emptyIcon}
            emptyMessage={emptyMessage}
            maxHeight={maxHeight}
            loading={loading}
            checkboxSelection={checkboxSelection}
            selectedRowIds={selectedRowIds}
            defaultSelectedRowIds={defaultSelectedRowIds}
            onSelectionChange={onSelectionChange}
            disableMultipleRowSelection={disableMultipleRowSelection}
            sortable={sortable}
            sortModel={sortModel}
            defaultSortModel={defaultSortModel}
            onSortModelChange={onSortModelChange}
            sortingMode={sortingMode}
            contextMenu={contextMenu}
          />
        )}
      </Box>

      <DataTablePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={pageSizeOptions}
        labels={labels}
        disabled={loading}
      />
    </Paper>
  )
}
