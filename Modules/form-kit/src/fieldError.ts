import type { FieldError } from 'react-hook-form'

export function getFieldErrorProps(error?: FieldError) {
  const hasError = Boolean(error)

  return {
    error: hasError,
    helperText: error?.message,
    FormHelperTextProps: {
      role: hasError ? ('alert' as const) : undefined,
    },
  }
}
