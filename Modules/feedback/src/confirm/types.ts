export type ConfirmOptions = {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

type ConfirmRequest = ConfirmOptions & {
  resolve: (confirmed: boolean) => void
}

export type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

export type ConfirmState = ConfirmRequest | null
