export type ConfirmOptions = {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
  /** When true, the confirm dialog title bar can be dragged (sm+). */
  draggable?: boolean
}

type ConfirmRequest = ConfirmOptions & {
  resolve: (confirmed: boolean) => void
}

export type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

export type ConfirmState = ConfirmRequest | null
