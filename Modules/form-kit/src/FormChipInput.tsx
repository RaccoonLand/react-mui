import {
  Autocomplete,
  Chip,
  TextField,
  type AutocompleteProps,
  type TextFieldProps,
} from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { getFieldErrorProps } from './fieldError'
import type { FormControlNameProps } from './types'

export type FormChipInputProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: TextFieldProps['label']
  placeholder?: string
  disabled?: boolean
  /** Suggested chips; free text is always allowed. */
  options?: string[]
  textFieldProps?: Omit<TextFieldProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'label'>
  autocompleteProps?: Omit<
    AutocompleteProps<string, true, false, true>,
    'options' | 'value' | 'defaultValue' | 'onChange' | 'freeSolo' | 'multiple' | 'renderInput' | 'renderTags'
  >
}

export function FormChipInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled,
  options = [],
  textFieldProps,
  autocompleteProps,
}: FormChipInputProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const errorProps = getFieldErrorProps(fieldState.error)
        const value = Array.isArray(field.value)
          ? field.value.map(String)
          : []

        return (
          <Autocomplete
            {...autocompleteProps}
            multiple
            freeSolo
            disabled={disabled}
            options={options}
            value={value}
            onBlur={field.onBlur}
            onChange={(_, next) => {
              const chips = next
                .map((item) => String(item).trim())
                .filter((item, index, all) => item !== '' && all.indexOf(item) === index)
              field.onChange(chips)
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index })
                return <Chip key={key} size="small" label={option} {...tagProps} />
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                {...textFieldProps}
                name={field.name}
                inputRef={field.ref}
                label={label}
                placeholder={placeholder}
                error={errorProps.error}
                helperText={errorProps.helperText ?? textFieldProps?.helperText}
                FormHelperTextProps={{
                  ...textFieldProps?.FormHelperTextProps,
                  ...errorProps.FormHelperTextProps,
                }}
              />
            )}
          />
        )
      }}
    />
  )
}
