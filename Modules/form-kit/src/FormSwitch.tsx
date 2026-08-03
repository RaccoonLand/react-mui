import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  type FormControlLabelProps,
  type SwitchProps,
} from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FormControlNameProps } from './types'
import { normalizeBooleanValue } from './valueNormalization'

export type FormSwitchProps<T extends FieldValues> = FormControlNameProps<T> & {
  label: FormControlLabelProps['label']
  disabled?: boolean
  switchProps?: Omit<SwitchProps, 'name' | 'checked' | 'onChange'>
}

export function FormSwitch<T extends FieldValues>({
  name,
  label,
  disabled,
  switchProps,
}: FormSwitchProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={Boolean(fieldState.error)} disabled={disabled}>
          <FormControlLabel
            control={
              <Switch
                {...switchProps}
                name={field.name}
                inputRef={field.ref}
                checked={normalizeBooleanValue(field.value)}
                onBlur={field.onBlur}
                onChange={(_, checked) => field.onChange(checked)}
              />
            }
            label={label}
          />
          {fieldState.error?.message && (
            <FormHelperText role="alert">{fieldState.error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}
