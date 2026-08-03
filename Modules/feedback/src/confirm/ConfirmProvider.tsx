import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import type { ConfirmContextValue, ConfirmOptions, ConfirmState } from './types'

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

type ConfirmProviderProps = {
  children: ReactNode
}

type QueuedConfirm = {
  options: ConfirmOptions
  resolve: (confirmed: boolean) => void
}

export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [state, setState] = useState<ConfirmState>(null)
  const activeRef = useRef<ConfirmState>(null)
  const queueRef = useRef<QueuedConfirm[]>([])

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      // Side effects stay outside setState so Strict Mode double-invoke cannot
      // enqueue twice or drop a resolver.
      if (activeRef.current) {
        queueRef.current.push({ options, resolve })
        return
      }

      const request: NonNullable<ConfirmState> = { ...options, resolve }
      activeRef.current = request
      setState(request)
    })
  }, [])

  const handleClose = useCallback((confirmed: boolean) => {
    const current = activeRef.current
    if (!current) {
      return
    }

    current.resolve(confirmed)

    const next = queueRef.current.shift()
    if (next) {
      const request: NonNullable<ConfirmState> = {
        ...next.options,
        resolve: next.resolve,
      }
      activeRef.current = request
      setState(request)
      return
    }

    activeRef.current = null
    setState(null)
  }, [])

  const value = useMemo(() => ({ confirm }), [confirm])

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <ConfirmDialog state={state} onClose={handleClose} />
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider')
  }
  return context.confirm
}
