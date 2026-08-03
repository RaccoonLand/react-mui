import {
  FormControl,
  FormHelperText,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  type FormControlProps,
  type ToggleButtonGroupProps,
} from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FormControlNameProps, FormOption, ValueAs } from './types'
import { coerceMultiSelectChange, coerceSelectChange, normalizeMultiSelectValue, normalizeSelectValue } from './valueNormalization'

export type FormToggleButtonGroupProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: string
  options: FormOption[]
  valueAs?: ValueAs
  exclusive?: boolean
  disabled?: boolean
  formControlProps?: Omit<FormControlProps, 'error' | 'disabled'>
  toggleButtonGroupProps?: Omit<
    ToggleButtonGroupProps,
    'name' | 'value' | 'defaultValue' | 'onChange' | 'exclusive'
  >
}

export function FormToggleButtonGroup<T extends FieldValues>({
  name,
  label,
  options,
  valueAs = 'string',
  exclusive = true,
  disabled,
  formControlProps,
  toggleButtonGroupProps,
}: FormToggleButtonGroupProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          {...formControlProps}
          error={Boolean(fieldState.error)}
          disabled={disabled}
        >
          {label && <FormLabel id={`${String(name)}-label`}>{label}</FormLabel>}
          <ToggleButtonGroup
            {...toggleButtonGroupProps}
            exclusive={exclusive}
            aria-labelledby={label ? `${String(name)}-label` : undefined}
            value={
              exclusive
                ? normalizeSelectValue(field.value, valueAs)
                : normalizeMultiSelectValue(field.value, valueAs)
            }
            onChange={(_, next) => {
              if (exclusive) {
                field.onChange(
                  next === null || next === undefined
                    ? ''
                    : coerceSelectChange(String(next), valueAs),
                )
                return
              }

              field.onChange(
                coerceMultiSelectChange(
                  (Array.isArray(next) ? next : []).map(String),
                  valueAs,
                ),
              )
            }}
            onBlur={field.onBlur}
          >
            {options.map((option) => (
              <ToggleButton
                key={String(option.value)}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {fieldState.error?.message && (
            <FormHelperText role="alert">{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}
