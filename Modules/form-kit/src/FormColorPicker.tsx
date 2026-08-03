import {
  Box,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  type FormControlProps,
  type TextFieldProps,
} from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { getFieldErrorProps } from './fieldError'
import type { FormControlNameProps } from './types'
import { normalizeTextValue } from './valueNormalization'

export type FormColorPickerProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: string
  disabled?: boolean
  formControlProps?: Omit<FormControlProps, 'error' | 'disabled'>
  textFieldProps?: Omit<TextFieldProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'label' | 'type'>
}

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

function normalizeHex(value: unknown): string {
  const raw = normalizeTextValue(value).trim()
  if (HEX_PATTERN.test(raw)) {
    return raw.length === 4
      ? `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`
      : raw
  }
  return '#000000'
}

export function FormColorPicker<T extends FieldValues>({
  name,
  label,
  disabled,
  formControlProps,
  textFieldProps,
}: FormColorPickerProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const errorProps = getFieldErrorProps(fieldState.error)
        const hex = normalizeHex(field.value)

        return (
          <FormControl
            {...formControlProps}
            fullWidth
            error={errorProps.error}
            disabled={disabled}
          >
            {label && <FormLabel sx={{ mb: 1 }}>{label}</FormLabel>}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box
                component="input"
                type="color"
                name={`${field.name}-swatch`}
                value={hex}
                disabled={disabled}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.currentTarget.value)}
                sx={{
                  width: 44,
                  height: 40,
                  p: 0.25,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              />
              <TextField
                {...textFieldProps}
                name={field.name}
                inputRef={field.ref}
                value={normalizeTextValue(field.value)}
                disabled={disabled}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.value)}
                error={errorProps.error}
                helperText={errorProps.helperText ?? textFieldProps?.helperText}
                FormHelperTextProps={{
                  ...textFieldProps?.FormHelperTextProps,
                  ...errorProps.FormHelperTextProps,
                }}
                placeholder="#000000"
                fullWidth
              />
            </Stack>
          </FormControl>
        )
      }}
    />
  )
}
