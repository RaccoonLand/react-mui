import { Checkbox, ListItemText, MenuItem, TextField, type TextFieldProps } from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { getFieldErrorProps } from './fieldError'
import type { FormControlNameProps, FormOption, ValueAs } from './types'
import { coerceMultiSelectChange, normalizeMultiSelectValue } from './valueNormalization'

export type FormMultiSelectProps<T extends FieldValues> = FormControlNameProps<T> &
  Omit<TextFieldProps, 'name' | 'defaultValue' | 'value' | 'select' | 'onChange'> & {
    options: FormOption[]
    valueAs?: ValueAs
    showCheckbox?: boolean
  }

export function FormMultiSelect<T extends FieldValues>({
  name,
  options,
  valueAs = 'string',
  showCheckbox = true,
  ...props
}: FormMultiSelectProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const errorProps = getFieldErrorProps(fieldState.error)
        const selected = normalizeMultiSelectValue(field.value, valueAs)

        return (
          <TextField
            {...props}
            select
            name={field.name}
            inputRef={field.ref}
            onBlur={field.onBlur}
            value={selected}
            onChange={(event) =>
              field.onChange(coerceMultiSelectChange(event.target.value, valueAs))
            }
            error={errorProps.error}
            helperText={errorProps.helperText ?? props.helperText}
            FormHelperTextProps={{
              ...props.FormHelperTextProps,
              ...errorProps.FormHelperTextProps,
            }}
            SelectProps={{
              ...props.SelectProps,
              multiple: true,
              renderValue: (selectedValue) => {
                const values = selectedValue as Array<string | number>
                return values
                  .map(
                    (value) =>
                      options.find((option) => String(option.value) === String(value))?.label ??
                      String(value),
                  )
                  .join(', ')
              },
            }}
          >
            {options.map((option) => {
              const checked = selected.some((value) => String(value) === String(option.value))

              return (
                <MenuItem key={String(option.value)} value={option.value} disabled={option.disabled}>
                  {showCheckbox && <Checkbox checked={checked} size="small" />}
                  <ListItemText primary={option.label} />
                </MenuItem>
              )
            })}
          </TextField>
        )
      }}
    />
  )
}
