import CloseIcon from '@mui/icons-material/Close'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  type DialogProps,
  type PaperProps,
  type SxProps,
  type Theme,
} from '@mui/material'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useRaccoonTheme } from '@raccoonland/theme'
import { APP_DIALOG_DRAG_HANDLE_ATTR, DraggablePaper } from './DraggablePaper'

type AppDialogVariant = 'default' | 'emphasis'

export type AppDialogProps = {
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
  /**
   * When true, the dialog can be moved by dragging the title bar.
   * Disabled automatically below the `sm` breakpoint.
   */
  draggable?: boolean
  /**
   * When true, clicking the backdrop calls `onClose`.
   * Default `false` — Escape / header close / actions still dismiss.
   * (AppDialog's `onClose` has no MUI `reason`, so hosts cannot filter this themselves.)
   */
  closeOnBackdropClick?: boolean
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
  draggable = false,
  closeOnBackdropClick = false,
}: AppDialogProps) {
  const raccoon = useRaccoonTheme()
  const isNarrow = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const dragEnabled = draggable && !isNarrow
  const [backdropDenyPulse, setBackdropDenyPulse] = useState(false)

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
    if (!open) {
      setBackdropDenyPulse(false)
    }
  }, [open])

  useEffect(() => {
    if (!backdropDenyPulse) {
      return
    }

    const timer = window.setTimeout(() => setBackdropDenyPulse(false), 320)
    return () => window.clearTimeout(timer)
  }, [backdropDenyPulse])

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

  const pulseBackdropDeny = useCallback(() => {
    setBackdropDenyPulse(false)
    window.requestAnimationFrame(() => setBackdropDenyPulse(true))
  }, [])

  const PaperComponent = useCallback(
    (props: PaperProps) => <DraggablePaper {...props} resetKey={open} />,
    [open],
  )

  const lockedPulseSx = {
    animation: 'appDialogBackdropDeny 300ms ease',
    '@keyframes appDialogBackdropDeny': {
      '0%, 100%': {
        boxShadow:
          variant === 'emphasis' ? `0 0 32px ${raccoon.border.glow}` : 'none',
        borderColor: variant === 'emphasis' ? raccoon.border.glow : raccoon.border.subtle,
      },
      '40%': {
        boxShadow: `0 0 0 3px ${raccoon.border.glow}, 0 0 28px ${raccoon.border.glow}`,
        borderColor: raccoon.border.glow,
      },
    },
  } satisfies SxProps<Theme>

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' && !closeOnBackdropClick) {
          pulseBackdropDeny()
          return
        }
        onClose()
      }}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll={scroll}
      disableRestoreFocus={disableRestoreFocus}
      PaperComponent={dragEnabled ? PaperComponent : undefined}
      PaperProps={{
        sx: backdropDenyPulse ? [paperSx, lockedPulseSx] : paperSx,
      }}
      slotProps={
        !closeOnBackdropClick
          ? {
              backdrop: {
                // Visual lock cue lives on the paper (pulse). Avoid animating backdrop
                // opacity — it fights MUI Fade's inline opacity.
                sx: { cursor: 'default' },
              },
            }
          : undefined
      }
    >
      <DialogTitle
        {...(dragEnabled ? { [APP_DIALOG_DRAG_HANDLE_ATTR]: '' } : undefined)}
        sx={{
          ...(showCloseButton ? { paddingInlineEnd: 6 } : undefined),
          ...(dragEnabled
            ? {
                cursor: 'move',
                userSelect: 'none',
                touchAction: 'none',
              }
            : undefined),
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
