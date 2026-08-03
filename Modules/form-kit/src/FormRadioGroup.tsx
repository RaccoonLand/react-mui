import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  type FormControlProps,
  type RadioGroupProps,
} from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FormControlNameProps, FormOption, ValueAs } from './types'
import { coerceSelectChange, normalizeSelectValue } from './valueNormalization'

export type FormRadioGroupProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: string
  options: FormOption[]
  valueAs?: ValueAs
  row?: boolean
  disabled?: boolean
  formControlProps?: Omit<FormControlProps, 'error' | 'disabled'>
  radioGroupProps?: Omit<RadioGroupProps, 'name' | 'value' | 'onChange'>
}

export function FormRadioGroup<T extends FieldValues>({
  name,
  label,
  options,
  valueAs = 'string',
  row = false,
  disabled,
  formControlProps,
  radioGroupProps,
}: FormRadioGroupProps<T>) {
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
          <RadioGroup
            {...radioGroupProps}
            row={row}
            aria-labelledby={label ? `${String(name)}-label` : undefined}
            name={field.name}
            value={String(normalizeSelectValue(field.value, valueAs))}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(coerceSelectChange(event.target.value, valueAs))}
          >
            {options.map((option) => (
              <FormControlLabel
                key={String(option.value)}
                value={String(option.value)}
                control={<Radio inputRef={field.ref} />}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
          </RadioGroup>
          {fieldState.error?.message && (
            <FormHelperText role="alert">{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}
