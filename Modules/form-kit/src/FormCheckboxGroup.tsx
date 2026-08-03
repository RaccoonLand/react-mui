import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  type CheckboxProps,
  type FormControlProps,
  type FormGroupProps,
} from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FormControlNameProps, FormOption, ValueAs } from './types'
import { coerceSelectChange, normalizeMultiSelectValue } from './valueNormalization'

export type FormCheckboxGroupProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: string
  options: FormOption[]
  valueAs?: ValueAs
  row?: boolean
  disabled?: boolean
  formControlProps?: Omit<FormControlProps, 'error' | 'disabled'>
  formGroupProps?: Omit<FormGroupProps, 'row'>
  checkboxProps?: Omit<CheckboxProps, 'name' | 'checked' | 'onChange'>
}

export function FormCheckboxGroup<T extends FieldValues>({
  name,
  label,
  options,
  valueAs = 'string',
  row = false,
  disabled,
  formControlProps,
  formGroupProps,
  checkboxProps,
}: FormCheckboxGroupProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const selected = normalizeMultiSelectValue(field.value, valueAs)

        const toggle = (optionValue: string | number, checked: boolean) => {
          const coerced = coerceSelectChange(String(optionValue), valueAs)
          if (checked) {
            field.onChange([...selected, coerced])
            return
          }

          field.onChange(selected.filter((item) => String(item) !== String(coerced)))
        }

        return (
          <FormControl
            {...formControlProps}
            variant="standard"
            error={Boolean(fieldState.error)}
            disabled={disabled}
          >
            {label && <FormLabel component="legend">{label}</FormLabel>}
            <FormGroup {...formGroupProps} row={row}>
              {options.map((option) => {
                const checked = selected.some(
                  (item) => String(item) === String(option.value),
                )

                return (
                  <FormControlLabel
                    key={String(option.value)}
                    disabled={option.disabled}
                    control={
                      <Checkbox
                        {...checkboxProps}
                        name={field.name}
                        checked={checked}
                        onBlur={field.onBlur}
                        onChange={(_, next) => toggle(option.value, next)}
                      />
                    }
                    label={option.label}
                  />
                )
              })}
            </FormGroup>
            {fieldState.error?.message && (
              <FormHelperText role="alert">{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}
