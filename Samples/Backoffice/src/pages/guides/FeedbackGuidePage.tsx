import { Alert, Button, Paper, Stack, Typography } from '@mui/material'
import {
  AppDialog,
  AppDrawer,
  useConfirm,
  useLoading,
  useToast,
} from '@raccoonland/feedback'
import { Page } from '@raccoonland/page'
import { useRaccoonTheme } from '@raccoonland/theme'
import { useState } from 'react'
import { packageGuideBreadcrumbs } from '../../layout/breadcrumbIcons'
import { useLocale } from '../../i18n/LocaleProvider'
import { GuideUsageSection } from './GuideUsageSection'

const FEEDBACK_USAGE_CODE = `import { useState } from 'react'
import {
  AppDialog,
  AppDrawer,
  ConfirmProvider,
  LoadingProvider,
  ToastProvider,
  useConfirm,
  useLoading,
  useToast,
} from '@raccoonland/feedback'

// 1) Providers (order matters: Toast → Loading → Confirm)
//    ToastProvider accepts maxSnack / autoHideDuration / preventDuplicate.
export function FeedbackRoot({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider direction="rtl" maxSnack={4} autoHideDuration={4000} preventDuplicate>
      <LoadingProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </LoadingProvider>
    </ToastProvider>
  )
}

// 2) Typical screen usage
export function FeedbackDemo() {
  const { showSuccess, showError } = useToast()
  const confirm = useConfirm()
  const { withLoading, isLoading, isAnyLoading } = useLoading()
  const [open, setOpen] = useState(false)

  // isLoading  → only true while the global backdrop is visible.
  //              Use this to disable buttons that trigger global work.
  // isAnyLoading → true if any operation is in-flight (any scope).

  const onDelete = async () => {
    const ok = await confirm({
      title: 'Delete item',
      message: 'This cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    })
    if (!ok) return

    await withLoading(async () => {
      await api.deleteItem()
    }, { message: 'Deleting…' })

    showSuccess('Deleted')
  }

  // Concurrent confirm() calls are queued — each Promise resolves in order.

  return (
    <>
      <button type="button" disabled={isLoading} onClick={() => showError('Something failed')}>
        Toast
      </button>
      <button type="button" onClick={() => void onDelete()}>Confirm + loader</button>
      <button type="button" onClick={() => setOpen(true)}>Dialog</button>
      <span>isAnyLoading: {String(isAnyLoading)}</span>

      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Details"
        closeLabel="Close"
        actions={
          <>
            <button type="button" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" onClick={() => setOpen(false)}>OK</button>
          </>
        }
      >
        Body content
      </AppDialog>

      <AppDrawer open={open} onClose={() => setOpen(false)} title="Filters" closeLabel="Close">
        Drawer body
      </AppDrawer>
    </>
  )
}`

export function FeedbackGuidePage() {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()
  const { showSuccess, showError, showWarning, showInfo } = useToast()
  const confirm = useConfirm()
  const { withLoading, isLoading, isAnyLoading } = useLoading()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastConfirm, setLastConfirm] = useState<string>('')

  const runLoader = async () => {
    await withLoading(
      () => new Promise((resolve) => window.setTimeout(resolve, 1200)),
      { message: t('guideFeedbackLoadingMessage') },
    )
    showSuccess(t('guideFeedbackLoadingDone'))
  }

  const runLocalLoader = async () => {
    // Local scope: no backdrop, no isLoading flip — only isAnyLoading toggles.
    await withLoading(
      () => new Promise((resolve) => window.setTimeout(resolve, 1200)),
      { scope: 'local' },
    )
    showInfo('Local operation done (no backdrop)')
  }

  const runConfirm = async (destructive: boolean) => {
    const ok = await confirm({
      title: destructive ? t('confirmDeleteTitle') : t('confirmTitle'),
      message: destructive ? t('confirmDeleteMessage') : t('confirmMessage'),
      confirmText: destructive ? t('delete') : t('confirm'),
      cancelText: t('cancel'),
      destructive,
    })
    setLastConfirm(ok ? 'confirmed' : 'cancelled')
  }

  const runQueuedConfirms = async () => {
    const first = confirm({
      title: 'Confirm A',
      message: 'First dialog in queue',
      confirmText: t('confirm'),
      cancelText: t('cancel'),
    })
    const second = confirm({
      title: 'Confirm B',
      message: 'Second dialog waits until A closes',
      confirmText: t('confirm'),
      cancelText: t('cancel'),
    })
    const [a, b] = await Promise.all([first, second])
    setLastConfirm(`A=${a} · B=${b}`)
  }

  return (
    <Page
      title={t('guideFeedbackTitle')}
      direction={direction}
      breadcrumbs={packageGuideBreadcrumbs(t, 'feedback')}
    >
      <Stack spacing={2}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: raccoon.background.elevated, border: `1px solid ${raccoon.border.subtle}` }}>
          <Typography variant="body2" color="text.secondary">
            {t('guideFeedbackBody')}
          </Typography>
        </Paper>

        <GuideUsageSection
          description={t('guideUsageDescription')}
          demo={
            <Stack spacing={1.5}>
              <Alert severity="info">
                isLoading (global): <strong>{String(isLoading)}</strong> · isAnyLoading:{' '}
                <strong>{String(isAnyLoading)}</strong>
              </Alert>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button onClick={() => showSuccess('Success toast')}>Success</Button>
                <Button color="error" onClick={() => showError('Error toast')}>
                  Error
                </Button>
                <Button color="warning" onClick={() => showWarning('Warning toast')}>
                  Warning
                </Button>
                <Button color="info" onClick={() => showInfo('Info toast')}>
                  Info
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button variant="outlined" onClick={() => void runConfirm(false)}>
                  Confirm
                </Button>
                <Button variant="outlined" color="error" onClick={() => void runConfirm(true)}>
                  Destructive
                </Button>
                <Button variant="contained" onClick={() => void runQueuedConfirms()}>
                  Queue two confirms
                </Button>
                <Button variant="contained" onClick={() => void runLoader()} disabled={isLoading}>
                  Global loader
                </Button>
                <Button variant="outlined" onClick={() => void runLocalLoader()}>
                  Local loader (no backdrop)
                </Button>
                <Button variant="outlined" onClick={() => setDialogOpen(true)}>
                  Dialog
                </Button>
                <Button variant="outlined" onClick={() => setDrawerOpen(true)}>
                  Drawer
                </Button>
              </Stack>
              {lastConfirm && <Alert severity="info">Result: {lastConfirm}</Alert>}
            </Stack>
          }
          code={FEEDBACK_USAGE_CODE}
        />
      </Stack>

      <AppDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => setDialogOpen(false)}
        title="AppDialog demo"
        closeLabel={t('close')}
        actions={
          <>
            <Button onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
            <Button variant="contained" onClick={() => setDialogOpen(false)}>
              {t('confirm')}
            </Button>
          </>
        }
      >
        <Typography variant="body2">
          Enter confirms when focus is not on a button. Focus Cancel + Enter cancels (native).
        </Typography>
      </AppDialog>

      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="AppDrawer demo"
        closeLabel={t('close')}
        anchor={direction === 'rtl' ? 'left' : 'right'}
      >
        <Typography variant="body2" color="text.secondary">
          Drawer content for forms / filters.
        </Typography>
      </AppDrawer>
    </Page>
  )
}
