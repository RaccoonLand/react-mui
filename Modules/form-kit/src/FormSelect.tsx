import { MenuItem, TextField, type TextFieldProps } from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { getFieldErrorProps } from './fieldError'
import type { FormControlNameProps, FormOption, ValueAs } from './types'
import { coerceSelectChange, normalizeSelectValue } from './valueNormalization'

export type FormSelectProps<T extends FieldValues> = FormControlNameProps<T> &
  Omit<TextFieldProps, 'name' | 'defaultValue' | 'value' | 'select' | 'onChange'> & {
    options?: FormOption[]
    valueAs?: ValueAs
  }

export function FormSelect<T extends FieldValues>({
  name,
  options,
  valueAs = 'string',
  children,
  ...props
}: FormSelectProps<T>) {
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
            select
            name={field.name}
            inputRef={field.ref}
            onBlur={field.onBlur}
            value={normalizeSelectValue(field.value, valueAs)}
            onChange={(event) => field.onChange(coerceSelectChange(event.target.value, valueAs))}
            error={errorProps.error}
            helperText={errorProps.helperText ?? props.helperText}
            FormHelperTextProps={{
              ...props.FormHelperTextProps,
              ...errorProps.FormHelperTextProps,
            }}
          >
            {options
              ? options.map((option) => (
                  <MenuItem key={String(option.value)} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </MenuItem>
                ))
              : children}
          </TextField>
        )
      }}
    />
  )
}
