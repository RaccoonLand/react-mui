import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Button, DialogContentText, Stack } from '@mui/material'
import { AppDialog } from '../overlay/AppDialog'
import type { ConfirmState } from './types'

type ConfirmDialogProps = {
  state: ConfirmState
  onClose: (confirmed: boolean) => void
}

export function ConfirmDialog({ state, onClose }: ConfirmDialogProps) {
  const open = state !== null

  return (
    <AppDialog
      open={open}
      onClose={() => onClose(false)}
      onConfirm={() => onClose(true)}
      maxWidth="xs"
      variant="emphasis"
      showCloseButton={false}
      dividers={false}
      draggable={state?.draggable}
      title={
        state ? (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <WarningAmberOutlinedIcon color={state.destructive ? 'error' : 'primary'} />
            <span>{state.title}</span>
          </Stack>
        ) : (
          ''
        )
      }
      actions={
        state && (
          <>
            <Button onClick={() => onClose(false)} color="inherit">
              {state.cancelText ?? 'Cancel'}
            </Button>
            <Button
              onClick={() => onClose(true)}
              variant="contained"
              color={state.destructive ? 'error' : 'primary'}
            >
              {state.confirmText ?? 'Confirm'}
            </Button>
          </>
        )
      }
    >
      {state && (
        <DialogContentText color="text.secondary">{state.message}</DialogContentText>
      )}
    </AppDialog>
  )
}
