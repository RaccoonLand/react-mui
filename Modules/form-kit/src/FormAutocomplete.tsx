import {
  Autocomplete,
  TextField,
  type AutocompleteProps,
  type TextFieldProps,
} from '@mui/material'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { getFieldErrorProps } from './fieldError'
import type { FormControlNameProps, FormOption } from './types'

type BaseAutocompleteProps<
  Value,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> = Omit<
  AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo>,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'renderInput' | 'options'
>

export type FormAutocompleteProps<
  T extends FieldValues,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> = FormControlNameProps<T> &
  BaseAutocompleteProps<FormOption, Multiple, DisableClearable, FreeSolo> & {
    options: FormOption[]
    label?: TextFieldProps['label']
    placeholder?: string
    textFieldProps?: Omit<TextFieldProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'label'>
    /** When true, form value is option `value` (or array of values) instead of full option objects. */
    valueAsPrimitive?: boolean
  }

function findOption(options: FormOption[], value: unknown): FormOption | null {
  if (value == null || value === '') {
    return null
  }

  if (typeof value === 'object' && value !== null && 'value' in value) {
    return (value as FormOption) ?? null
  }

  return options.find((option) => String(option.value) === String(value)) ?? null
}

export function FormAutocomplete<
  T extends FieldValues,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>({
  name,
  options,
  label,
  placeholder,
  textFieldProps,
  valueAsPrimitive = true,
  multiple,
  ...props
}: FormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const errorProps = getFieldErrorProps(fieldState.error)

        const selected = multiple
          ? (Array.isArray(field.value) ? field.value : [])
              .map((item) => findOption(options, item))
              .filter((item): item is FormOption => item != null)
          : findOption(options, field.value)

        return (
          <Autocomplete
            {...props}
            multiple={multiple}
            options={options}
            value={selected as never}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.label
            }
            isOptionEqualToValue={(option, value) =>
              String(option.value) === String(typeof value === 'object' && value && 'value' in value ? value.value : value)
            }
            onBlur={field.onBlur}
            onChange={(_, next) => {
              if (!valueAsPrimitive) {
                field.onChange(next)
                return
              }

              if (multiple) {
                const list = Array.isArray(next) ? next : []
                field.onChange(
                  list.map((item) => (typeof item === 'string' ? item : item.value)),
                )
                return
              }

              if (next == null || typeof next === 'string') {
                field.onChange(next ?? null)
                return
              }

              field.onChange((next as FormOption).value)
            }}
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
