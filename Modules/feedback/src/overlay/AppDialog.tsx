import CloseIcon from '@mui/icons-material/Close'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  type DialogProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import { useEffect, type ReactNode } from 'react'
import { useRaccoonTheme } from '@raccoonland/theme'

type AppDialogVariant = 'default' | 'emphasis'

type AppDialogProps = {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  actions?: ReactNode
  maxWidth?: DialogProps['maxWidth']
  fullWidth?: boolean
  scroll?: DialogProps['scroll']
  dividers?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  variant?: AppDialogVariant
  contentSx?: SxProps<Theme>
  onConfirm?: () => void
  disableRestoreFocus?: boolean
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

/**
 * Enter on focused Cancel/Confirm/links must use native activation.
 * Do not call onConfirm() in that case (would confirm while Cancel is focused).
 */
function isNativeEnterTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false
  }

  return Boolean(target.closest('button, [role="button"], a, [href]'))
}

export function AppDialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  scroll = 'paper',
  dividers = true,
  showCloseButton = true,
  closeLabel,
  variant = 'default',
  contentSx,
  onConfirm,
  disableRestoreFocus = false,
}: AppDialogProps) {
  const raccoon = useRaccoonTheme()

  const paperSx =
    variant === 'emphasis'
      ? {
          bgcolor: raccoon.background.elevated,
          border: `1px solid ${raccoon.border.glow}`,
          boxShadow: `0 0 32px ${raccoon.border.glow}`,
        }
      : {
          bgcolor: raccoon.background.elevated,
          border: `1px solid ${raccoon.border.subtle}`,
        }

  useEffect(() => {
    if (!open || !onConfirm) {
      return
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Enter' || event.defaultPrevented) {
        return
      }

      // Guard: button / link / role=button — leave native Enter behavior alone
      // (Cancel focused + Enter must cancel, not confirm).
      if (isNativeEnterTarget(event.target)) {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      event.preventDefault()
      onConfirm()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onConfirm, open])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll={scroll}
      disableRestoreFocus={disableRestoreFocus}
      PaperProps={{ sx: paperSx }}
    >
      <DialogTitle
        sx={{
          ...(showCloseButton ? { paddingInlineEnd: 6 } : undefined),
        }}
      >
        {typeof title === 'string' ? (
          <Typography variant="h6" fontWeight={700} component="span">
            {title}
          </Typography>
        ) : (
          title
        )}
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            aria-label={closeLabel ?? 'Close'}
            sx={{ position: 'absolute', insetInlineEnd: 12, top: 12 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent
        dividers={dividers}
        sx={{ paddingInline: { xs: 2, sm: 3 }, py: 2, ...contentSx }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ paddingInline: 3, py: 2, gap: 1 }}>{actions}</DialogActions>
      )}
    </Dialog>
  )
}
