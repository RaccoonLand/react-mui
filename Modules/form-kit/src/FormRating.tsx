import {
  FormControl,
  FormHelperText,
  FormLabel,
  Rating,
  type FormControlProps,
  type RatingProps,
} from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FormControlNameProps } from './types'

export type FormRatingProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: string
  disabled?: boolean
  formControlProps?: Omit<FormControlProps, 'error' | 'disabled'>
  ratingProps?: Omit<RatingProps, 'name' | 'value' | 'defaultValue' | 'onChange'>
}

export function FormRating<T extends FieldValues>({
  name,
  label,
  disabled,
  formControlProps,
  ratingProps,
}: FormRatingProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const numeric =
          typeof field.value === 'number'
            ? field.value
            : field.value == null || field.value === ''
              ? null
              : Number(field.value)

        return (
          <FormControl
            {...formControlProps}
            error={Boolean(fieldState.error)}
            disabled={disabled}
          >
            {label && <FormLabel id={`${String(name)}-label`}>{label}</FormLabel>}
            <Rating
              {...ratingProps}
              name={field.name}
              value={Number.isNaN(numeric as number) ? null : numeric}
              onChange={(_, next) => field.onChange(next)}
              onBlur={field.onBlur}
            />
            {fieldState.error?.message && (
              <FormHelperText role="alert">{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}
