import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Alert,
  Avatar,
  Box,
  Button,
  CardActions,
  CardContent,
  Chip,
  FormControlLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { DataTable, type DataTableSortModel, type DataTableViewMode } from '@raccoonland/data-table'
import { Page } from '@raccoonland/page'
import { useRaccoonTheme } from '@raccoonland/theme'
import { useMemo, useState, type ReactNode } from 'react'
import { packageGuideBreadcrumbs } from '../../layout/breadcrumbIcons'
import { useLocale } from '../../i18n/LocaleProvider'
import { GuideUsageSection } from './GuideUsageSection'

type DemoPerson = {
  id: number
  fullName: string
  initials: string
  employeeCode: string
  department: string
  status: 'active' | 'inactive'
}

const DEMO_NAME_POOL = [
  'Hassan Soleimani',
  'Javad Soleimani',
  'Alice Johnson',
  'Benjamin Clark',
  'Charlotte Evans',
  'Daniel Wright',
  'Emily Foster',
  'Frank Mitchell',
  'Grace Parker',
  'Henry Collins',
  'Isabella Reed',
  'James Morgan',
  'Katherine Brooks',
  'Liam Turner',
  'Mia Sullivan',
  'Noah Bennett',
  'Olivia Hayes',
  'Patrick Hughes',
  'Quinn Murphy',
  'Rachel Cooper',
  'Samuel Price',
  'Thomas Bailey',
  'Uma Sharma',
  'Victoria Gray',
  'William Scott',
  'Xavier Young',
  'Yasmine Adler',
  'Zachary Hill',
] as const

const DEMO_DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Operations', 'Finance'] as const

const DEMO_TOTAL = 100

const DEMO_ROWS: DemoPerson[] = Array.from({ length: DEMO_TOTAL }, (_, index) => {
  const fullName = DEMO_NAME_POOL[index % DEMO_NAME_POOL.length]!
  const parts = fullName.split(' ')
  const initials = `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
  return {
    id: index + 1,
    fullName,
    initials,
    employeeCode: `EMP-${String(1001 + index).padStart(4, '0')}`,
    department: DEMO_DEPARTMENTS[index % DEMO_DEPARTMENTS.length]!,
    status: index % 3 === 1 ? 'inactive' : 'active',
  }
})

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

const USAGE_CODE = `import { DataTable } from '@raccoonland/data-table'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CopyIcon from '@mui/icons-material/ContentCopy'

<DataTable
  rows={data.items}
  getRowId={(r) => r.id}
  columns={[
    { id: 'rowNumber', header: '#', width: 56, align: 'center', hideOnCard: true, render: (r) => r.id },
    {
      id: 'name',
      header: t('name'),
      cardPrimary: true,
      renderHeader: () => <><PersonIcon /> {t('name')}</>,
      headerSx: { minWidth: 160 },
      render: (r) => r.fullName,
    },
    { id: 'employeeCode', header: t('code'), render: (r) => r.employeeCode },
    // cardLabel overrides the label shown on mobile cards
    { id: 'department', header: t('department'), cardLabel: t('deptShort'), render: (r) => r.department },
    { id: 'status', header: t('status'), align: 'center', render: (r) => <StatusChip v={r.status} /> },
  ]}
  maxInlineActions={2} // 3rd+ actions → MoreVert menu
  actions={[
    { key: 'view', label: t('view'), icon: VisibilityIcon, onClick: open },
    { key: 'edit', label: t('edit'), icon: EditIcon, disabled: (r) => r.id === 1, onClick: edit },
    { key: 'copy', label: t('copy'), icon: CopyIcon, onClick: copy },
    {
      key: 'delete',
      label: t('delete'),
      icon: DeleteIcon,
      color: 'error',
      hidden: (r) => r.status === 'inactive',
      onClick: async (r) => { if (await confirm(…)) remove(r.id) },
    },
  ]}
  page={page}
  pageSize={pageSize}
  pageSizeOptions={[5, 10, 25, 50]}
  totalCount={data.totalCount}
  onPageChange={setPage}
  onPageSizeChange={(s) => { setPageSize(s); setPage(0) }}
  viewMode="auto"           // auto | table | cards
  cardBreakpoint="md"
  maxHeight={360}
  dense
  loading={isFetching}
  checkboxSelection
  selectedRowIds={selectedIds}
  onSelectionChange={setSelectedIds}
  sortable
  sortingMode="server"
  sortModel={sortModel}
  onSortModelChange={(model) => { setSortModel(model); setPage(0) }}
  emptyContent={<EmptyState />}
  renderCard={({ title, fields, actionNodes, row, selectionControl }) => (/* custom card */)}
  labels={{
    rowsPerPage: t('rowsPerPage'),
    displayedRows: (from, to, count) => \`\${from}–\${to} / \${count}\`,
    labelActions: t('actions'),
    moreActions: t('more'),
    firstPage: t('first'),
    lastPage: t('last'),
    nextPage: t('next'),
    previousPage: t('prev'),
  }}
/>`

export function DataTableGuidePage() {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [viewMode, setViewMode] = useState<DataTableViewMode>('auto')
  const [lastAction, setLastAction] = useState('')
  const [customCards, setCustomCards] = useState(true)
  const [dense, setDense] = useState(true)
  const [loading, setLoading] = useState(false)
  const [useMaxHeight, setUseMaxHeight] = useState(true)
  const [showEmpty, setShowEmpty] = useState(false)
  const [maxInlineActions, setMaxInlineActions] = useState(2)
  const [checkboxSelection, setCheckboxSelection] = useState(true)
  const [sortable, setSortable] = useState(true)
  const [selectedRowIds, setSelectedRowIds] = useState<Array<string | number>>([])
  const [sortModel, setSortModel] = useState<DataTableSortModel>([])
  const [ctxEnabled, setCtxEnabled] = useState(true)
  const [ctxRow, setCtxRow] = useState(true)
  const [ctxTable, setCtxTable] = useState(true)

  const labels = useMemo(
    () => ({
      rowsPerPage: t('guideDataTableRowsPerPage'),
      displayedRows: (from: number, to: number, count: number) =>
        t('guideDataTableDisplayedRows')
          .replace('{from}', String(from))
          .replace('{to}', String(to))
          .replace('{count}', String(count)),
      labelActions: t('guideDataTableActions'),
      moreActions: t('guideDataTableMoreActions'),
      firstPage: t('guideDataTableFirstPage'),
      lastPage: t('guideDataTableLastPage'),
      nextPage: t('guideDataTableNextPage'),
      previousPage: t('guideDataTablePreviousPage'),
    }),
    [t],
  )

  const sourceRows = showEmpty ? [] : DEMO_ROWS
  const totalCount = showEmpty ? 0 : DEMO_TOTAL

  const orderedRows = useMemo(() => {
    if (sortModel.length === 0) return sourceRows
    const { field, sort } = sortModel[0]!
    const direction = sort === 'desc' ? -1 : 1
    return [...sourceRows].sort((a, b) => {
      const left = (a as Record<string, unknown>)[field]
      const right = (b as Record<string, unknown>)[field]
      if (left == null && right == null) return 0
      if (left == null) return -1 * direction
      if (right == null) return 1 * direction
      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * direction
      }
      return String(left).localeCompare(String(right), undefined, { sensitivity: 'base' }) * direction
    })
  }, [sourceRows, sortModel])

  const pageRows = useMemo(
    () => orderedRows.slice(page * pageSize, page * pageSize + pageSize),
    [orderedRows, page, pageSize],
  )

  const simulateLoading = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1200)
  }

  return (
    <Page
      title={t('guideDataTableTitle')}
      direction={direction}
      breadcrumbs={packageGuideBreadcrumbs(t, 'dataTable')}
    >
      <Stack spacing={2}>
        <Alert severity="info" icon={<TableChartOutlinedIcon fontSize="inherit" />}>
          {t('guideDataTableBody')}
        </Alert>

        <Paperish raccoon={raccoon}>
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">{t('guideDataTableDemoTitle')}</Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ alignItems: 'center' }}>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={viewMode}
                onChange={(_e, next: DataTableViewMode | null) => {
                  if (next) setViewMode(next)
                }}
              >
                <ToggleButton value="auto">{t('guideDataTableViewAuto')}</ToggleButton>
                <ToggleButton value="table">{t('guideDataTableViewTable')}</ToggleButton>
                <ToggleButton value="cards">{t('guideDataTableViewCards')}</ToggleButton>
              </ToggleButtonGroup>

              <ToggleButtonGroup
                exclusive
                size="small"
                value={maxInlineActions}
                onChange={(_e, next: number | null) => {
                  if (next != null) setMaxInlineActions(next)
                }}
              >
                <ToggleButton value={1}>{t('guideDataTableInline1')}</ToggleButton>
                <ToggleButton value={2}>{t('guideDataTableInline2')}</ToggleButton>
                <ToggleButton value={3}>{t('guideDataTableInline3')}</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={customCards}
                    onChange={(_e, checked) => setCustomCards(checked)}
                  />
                }
                label={t('guideDataTableCustomCards')}
              />
              <FormControlLabel
                control={
                  <Switch size="small" checked={dense} onChange={(_e, checked) => setDense(checked)} />
                }
                label={t('guideDataTableDense')}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={useMaxHeight}
                    onChange={(_e, checked) => setUseMaxHeight(checked)}
                  />
                }
                label={t('guideDataTableMaxHeight')}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={checkboxSelection}
                    onChange={(_e, checked) => {
                      setCheckboxSelection(checked)
                      if (!checked) setSelectedRowIds([])
                    }}
                  />
                }
                label={t('guideDataTableSelection')}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={sortable}
                    onChange={(_e, checked) => {
                      setSortable(checked)
                      if (!checked) setSortModel([])
                    }}
                  />
                }
                label={t('guideDataTableSortable')}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={ctxEnabled}
                    onChange={(_e, checked) => setCtxEnabled(checked)}
                  />
                }
                label={t('guideDataTableCtxEnabled')}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={ctxRow}
                    disabled={!ctxEnabled}
                    onChange={(_e, checked) => setCtxRow(checked)}
                  />
                }
                label={t('guideDataTableCtxRow')}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={ctxTable}
                    disabled={!ctxEnabled}
                    onChange={(_e, checked) => setCtxTable(checked)}
                  />
                }
                label={t('guideDataTableCtxTable')}
              />
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={showEmpty}
                    onChange={(_e, checked) => {
                      setShowEmpty(checked)
                      setPage(0)
                    }}
                  />
                }
                label={t('guideDataTableEmpty')}
              />
              <Button size="small" variant="outlined" onClick={simulateLoading} disabled={loading}>
                {t('guideDataTableLoading')}
              </Button>
            </Stack>
          </Stack>

          <DataTable
            rows={pageRows}
            getRowId={(r) => r.id}
            viewMode={viewMode}
            cardBreakpoint="md"
            maxHeight={useMaxHeight ? 360 : undefined}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            maxInlineActions={maxInlineActions}
            dense={dense}
            loading={loading}
            checkboxSelection={checkboxSelection}
            selectedRowIds={selectedRowIds}
            onSelectionChange={setSelectedRowIds}
            sortable={sortable}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={(model) => {
              setSortModel(model)
              setPage(0)
            }}
            contextMenu={{
              enabled: ctxEnabled,
              row: ctxRow,
              table: ctxTable,
              tableItems: [
                {
                  key: 'refresh',
                  label: t('guideDataTableCtxRefresh'),
                  icon: RefreshOutlinedIcon,
                  onClick: () => setLastAction('table:refresh'),
                },
                {
                  key: 'export',
                  label: t('guideDataTableCtxExport'),
                  icon: DownloadOutlinedIcon,
                  onClick: () => setLastAction('table:export'),
                },
              ],
            }}
            emptyContent={
              <Typography color="text.secondary" variant="body2">
                {t('guideDataTableEmptyContent')}
              </Typography>
            }
            columns={[
              {
                id: 'rowNumber',
                header: '#',
                width: 56,
                align: 'center',
                hideOnCard: true,
                sortable: false,
                render: (r) => r.id,
              },
              {
                id: 'name',
                header: t('guideDataTableColName'),
                cardPrimary: true,
                headerSx: { minWidth: 160 },
                renderHeader: () => (
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                    <PersonOutlineIcon fontSize="small" color="action" />
                    <span>{t('guideDataTableColName')}</span>
                  </Stack>
                ),
                render: (r) => r.fullName,
              },
              {
                id: 'employeeCode',
                header: t('guideDataTableColCode'),
                render: (r) => (
                  <Chip size="small" label={r.employeeCode} sx={{ fontFamily: 'monospace' }} />
                ),
              },
              {
                id: 'department',
                header: t('guideDataTableColDepartment'),
                cardLabel: t('guideDataTableColDeptShort'),
              },
              {
                id: 'status',
                header: t('guideDataTableColStatus'),
                align: 'center',
                width: 120,
                sortable: false,
                render: (r) => (
                  <Chip
                    size="small"
                    color={r.status === 'active' ? 'success' : 'default'}
                    label={
                      r.status === 'active'
                        ? t('guideDataTableStatusActive')
                        : t('guideDataTableStatusInactive')
                    }
                  />
                ),
              },
            ]}
            actions={[
              {
                key: 'view',
                label: t('guideDataTableActionView'),
                icon: VisibilityOutlinedIcon,
                onClick: (r) => setLastAction(`view:${r.id}`),
              },
              {
                key: 'edit',
                label: t('guideDataTableActionEdit'),
                icon: EditOutlinedIcon,
                color: 'primary',
                disabled: (r) => r.id === 1,
                onClick: (r) => setLastAction(`edit:${r.id}`),
              },
              {
                key: 'copy',
                label: t('guideDataTableActionCopy'),
                icon: ContentCopyOutlinedIcon,
                onClick: (r) => setLastAction(`copy:${r.id}`),
              },
              {
                key: 'delete',
                label: t('guideDataTableActionDelete'),
                icon: DeleteOutlineIcon,
                color: 'error',
                hidden: (r) => r.status === 'inactive',
                onClick: (r) => setLastAction(`delete:${r.id}`),
              },
            ]}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(0)
            }}
            labels={labels}
            renderCard={
              customCards
                ? ({ row, title, fields, actionNodes, selectionControl }) => (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      {selectionControl ? (
                        <Box sx={{ pl: 0.75, pt: 1.25 }}>{selectionControl}</Box>
                      ) : null}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <CardContent>
                          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 1.5 }}>
                            <Avatar sx={{ bgcolor: raccoon.primary.main, width: 40, height: 40 }}>
                              {row.initials}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {row.employeeCode}
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack spacing={0.75}>
                            {fields
                              .filter((f) => f.id !== 'employeeCode')
                              .map((f) => (
                                <Stack
                                  key={f.id}
                                  direction="row"
                                  spacing={1}
                                  justifyContent="space-between"
                                >
                                  <Typography variant="caption" color="text.secondary">
                                    {f.label}
                                  </Typography>
                                  <Box>{f.value}</Box>
                                </Stack>
                              ))}
                          </Stack>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end' }}>{actionNodes}</CardActions>
                      </Box>
                    </Box>
                  )
                : undefined
            }
          />

          {selectedRowIds.length > 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {t('guideDataTableSelected')}: {selectedRowIds.join(', ')}
            </Typography>
          ) : null}
          {sortModel[0] ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {t('guideDataTableSortState')}: {sortModel[0].field} ({sortModel[0].sort})
            </Typography>
          ) : null}
          {lastAction ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {t('guideDataTableLastAction')}: {lastAction}
            </Typography>
          ) : null}
        </Paperish>

        <GuideUsageSection code={USAGE_CODE} />
      </Stack>
    </Page>
  )
}

function Paperish({
  children,
  raccoon,
}: {
  children: ReactNode
  raccoon: ReturnType<typeof useRaccoonTheme>
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        border: `1px solid ${raccoon.border.subtle}`,
        bgcolor: raccoon.background.elevated,
      }}
    >
      {children}
    </Box>
  )
}
