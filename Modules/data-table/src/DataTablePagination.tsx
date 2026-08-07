import {
  Box,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import type { DataTableLabels } from './types'

export type DataTablePaginationProps = {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions: number[]
  labels: DataTableLabels
  disabled?: boolean
}

export function DataTablePagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  labels,
  disabled,
}: DataTablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize) || 1)
  const safePage = Math.min(Math.max(0, page), pageCount - 1)
  const from = totalCount === 0 ? 0 : safePage * pageSize + 1
  const to = Math.min(totalCount, (safePage + 1) * pageSize)

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{
        alignItems: 'center',
        justifyContent: { xs: 'center', sm: 'space-between' },
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        width: '100%',
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-start' },
          flexWrap: 'wrap',
          rowGap: 1,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" component="label">
            {labels.rowsPerPage}
          </Typography>
          <FormControl size="small" disabled={disabled}>
            <Select
              value={pageSize}
              onChange={(event) => {
                onPageSizeChange(Number(event.target.value))
              }}
              inputProps={{ 'aria-label': labels.rowsPerPage }}
              sx={{ minWidth: 72 }}
            >
              {pageSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {labels.displayedRows(from, to, totalCount)}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'flex-end' },
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <Pagination
          color="primary"
          shape="rounded"
          size="small"
          count={pageCount}
          page={safePage + 1}
          disabled={disabled || totalCount === 0}
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
          onChange={(_event, nextPage) => {
            onPageChange(nextPage - 1)
          }}
          getItemAriaLabel={(type) => {
            if (type === 'first') return labels.firstPage ?? 'First page'
            if (type === 'last') return labels.lastPage ?? 'Last page'
            if (type === 'next') return labels.nextPage ?? 'Next page'
            if (type === 'previous') return labels.previousPage ?? 'Previous page'
            return ''
          }}
        />
      </Box>
    </Stack>
  )
}
