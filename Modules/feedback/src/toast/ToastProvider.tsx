import { Button } from '@mui/material'
import { SnackbarProvider, useSnackbar, type SnackbarKey } from 'notistack'
import { createContext, useContext, useMemo, type ReactNode } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastOptions = {
  variant?: ToastVariant
  action?: ToastAction
}

type ToastInput = ToastVariant | ToastOptions

type ToastContextValue = {
  showToast: (message: string, input?: ToastInput) => SnackbarKey
  showSuccess: (message: string, action?: ToastAction) => SnackbarKey
  showError: (message: string, action?: ToastAction) => SnackbarKey
  showWarning: (message: string, action?: ToastAction) => SnackbarKey
  showInfo: (message: string, action?: ToastAction) => SnackbarKey
}

const ToastContext = createContext<ToastContextValue | null>(null)

function resolveToastInput(input: ToastInput = 'info'): ToastOptions {
  return typeof input === 'string' ? { variant: input } : { variant: 'info', ...input }
}

function ToastBridge({ children }: { children: ReactNode }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const value = useMemo<ToastContextValue>(
    () => {
      const enqueue = (message: string, options: ToastOptions) =>
        enqueueSnackbar(message, {
          variant: options.variant,
          action: options.action
            ? (snackbarId) => {
                const action = options.action!
                return (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      action.onClick()
                      closeSnackbar(snackbarId)
                    }}
                  >
                    {action.label}
                  </Button>
                )
              }
            : undefined,
        })

      return {
        showToast: (message, input) => enqueue(message, resolveToastInput(input)),
        showSuccess: (message, action) =>
          enqueue(message, { variant: 'success', action }),
        showError: (message, action) => enqueue(message, { variant: 'error', action }),
        showWarning: (message, action) =>
          enqueue(message, { variant: 'warning', action }),
        showInfo: (message, action) => enqueue(message, { variant: 'info', action }),
      }
    },
    [closeSnackbar, enqueueSnackbar],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

type ToastProviderProps = {
  children: ReactNode
  /** Layout direction — apps should pass locale direction (default `ltr`). */
  direction?: 'ltr' | 'rtl'
  /** Max concurrent snacks. Defaults to `4`. */
  maxSnack?: number
  /** Auto-hide timeout in ms. Defaults to `4000`. Set to `null` for persistent. */
  autoHideDuration?: number | null
  /** Suppress consecutive identical messages. Defaults to `true`. */
  preventDuplicate?: boolean
}

export function ToastProvider({
  children,
  direction = 'ltr',
  maxSnack = 4,
  autoHideDuration = 4000,
  preventDuplicate = true,
}: ToastProviderProps) {
  const anchorOrigin = useMemo(
    () =>
      direction === 'rtl'
        ? ({ vertical: 'top', horizontal: 'left' } as const)
        : ({ vertical: 'top', horizontal: 'right' } as const),
    [direction],
  )

  return (
    <SnackbarProvider
      maxSnack={maxSnack}
      autoHideDuration={autoHideDuration ?? undefined}
      anchorOrigin={anchorOrigin}
      preventDuplicate={preventDuplicate}
    >
      <ToastBridge>{children}</ToastBridge>
    </SnackbarProvider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
