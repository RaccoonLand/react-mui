import { TextField, type TextFieldProps } from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { getFieldErrorProps } from './fieldError'
import type { FormControlNameProps } from './types'
import { normalizeTextValue } from './valueNormalization'

export type FormTextFieldProps<T extends FieldValues> = FormControlNameProps<T> &
  Omit<TextFieldProps, 'name' | 'defaultValue' | 'value'>

export function FormTextField<T extends FieldValues>({
  name,
  ...props
}: FormTextFieldProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const errorProps = getFieldErrorProps(fieldState.error)

        return (
          <TextField
            {...props}
            {...field}
            value={normalizeTextValue(field.value)}
            error={errorProps.error}
            helperText={errorProps.helperText ?? props.helperText}
            FormHelperTextProps={{
              ...props.FormHelperTextProps,
              ...errorProps.FormHelperTextProps,
            }}
          />
        )
      }}
    />
  )
}
