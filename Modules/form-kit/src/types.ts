import type { FieldPath, FieldValues } from 'react-hook-form'

/** Shared contract for RHF-bound form controls. */
export type FormControlNameProps<T extends FieldValues> = {
  name: FieldPath<T>
}

export type ValueAs = 'string' | 'number'

export type FormOption<T = string | number> = {
  value: T
  label: string
  disabled?: boolean
}
