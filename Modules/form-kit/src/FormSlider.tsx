import {
  FormControl,
  FormHelperText,
  FormLabel,
  Slider,
  type FormControlProps,
  type SliderProps,
} from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FormControlNameProps } from './types'

export type FormSliderProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: string
  disabled?: boolean
  /** When true, field value is `[min, max]` (number[]). */
  range?: boolean
  formControlProps?: Omit<FormControlProps, 'error' | 'disabled'>
  sliderProps?: Omit<SliderProps, 'name' | 'value' | 'defaultValue' | 'onChange'>
}

function normalizeSliderValue(value: unknown, range: boolean): number | number[] {
  if (range) {
    if (Array.isArray(value) && value.length >= 2) {
      return [Number(value[0]) || 0, Number(value[1]) || 0]
    }
    return [0, 100]
  }

  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value
  }

  const numeric = Number(value)
  return Number.isNaN(numeric) ? 0 : numeric
}

export function FormSlider<T extends FieldValues>({
  name,
  label,
  disabled,
  range = false,
  formControlProps,
  sliderProps,
}: FormSliderProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          {...formControlProps}
          fullWidth
          error={Boolean(fieldState.error)}
          disabled={disabled}
        >
          {label && <FormLabel id={`${String(name)}-label`}>{label}</FormLabel>}
          <Slider
            {...sliderProps}
            name={field.name}
            aria-labelledby={label ? `${String(name)}-label` : undefined}
            value={normalizeSliderValue(field.value, range || Array.isArray(field.value))}
            onChange={(_, next) => field.onChange(next)}
            onChangeCommitted={() => field.onBlur()}
          />
          {fieldState.error?.message && (
            <FormHelperText role="alert">{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}
