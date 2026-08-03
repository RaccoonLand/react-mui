import { type TextFieldProps } from '@mui/material'
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
  type DatePickerProps,
  type DateTimePickerProps,
  type TimePickerProps,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { type Dayjs } from 'dayjs'
import { type ReactNode } from 'react'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { getFieldErrorProps } from './fieldError'
import type { FormControlNameProps } from './types'

export type FormDateValueFormat = 'iso' | 'date' | 'time'

export type FormDateLocalizationProviderProps = {
  children: ReactNode
  /** dayjs locale code, e.g. `fa` or `en`. */
  adapterLocale?: string
}

/** Host apps should wrap forms that use date/time pickers with this (or their own LocalizationProvider). */
export function FormDateLocalizationProvider({
  children,
  adapterLocale,
}: FormDateLocalizationProviderProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={adapterLocale}>
      {children}
    </LocalizationProvider>
  )
}

function toDayjs(value: unknown, format: FormDateValueFormat): Dayjs | null {
  if (value == null || value === '') {
    return null
  }

  if (dayjs.isDayjs(value)) {
    return value.isValid() ? value : null
  }

  if (value instanceof Date) {
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed : null
  }

  const raw = String(value)
  if (format === 'time') {
    const withDate = dayjs(`1970-01-01T${raw}`)
    if (withDate.isValid()) {
      return withDate
    }
    const parsed = dayjs(raw, 'HH:mm')
    return parsed.isValid() ? parsed : null
  }

  const parsed = dayjs(raw)
  return parsed.isValid() ? parsed : null
}

function fromDayjs(value: Dayjs | null, format: FormDateValueFormat): string | null {
  if (!value || !value.isValid()) {
    return null
  }

  if (format === 'date') {
    return value.format('YYYY-MM-DD')
  }

  if (format === 'time') {
    return value.format('HH:mm')
  }

  return value.toISOString()
}

type SharedPickerProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: TextFieldProps['label']
  disabled?: boolean
  /** How the RHF value is stored. Default: `date` / `time` / `iso` per picker. */
  valueFormat?: FormDateValueFormat
  textFieldProps?: Omit<TextFieldProps, 'name' | 'value' | 'defaultValue' | 'onChange'>
}

export type FormDatePickerProps<T extends FieldValues> = SharedPickerProps<T> & {
  datePickerProps?: Omit<
    DatePickerProps,
    'value' | 'defaultValue' | 'onChange' | 'label' | 'disabled'
  >
}

export type FormTimePickerProps<T extends FieldValues> = SharedPickerProps<T> & {
  timePickerProps?: Omit<
    TimePickerProps,
    'value' | 'defaultValue' | 'onChange' | 'label' | 'disabled'
  >
}

export type FormDateTimePickerProps<T extends FieldValues> = SharedPickerProps<T> & {
  dateTimePickerProps?: Omit<
    DateTimePickerProps,
    'value' | 'defaultValue' | 'onChange' | 'label' | 'disabled'
  >
}

export function FormDatePicker<T extends FieldValues>({
  name,
  label,
  disabled,
  valueFormat = 'date',
  textFieldProps,
  datePickerProps,
}: FormDatePickerProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const errorProps = getFieldErrorProps(fieldState.error)

        return (
          <DatePicker
            {...datePickerProps}
            label={label}
            disabled={disabled}
            value={toDayjs(field.value, valueFormat)}
            onChange={(next) => field.onChange(fromDayjs(next, valueFormat))}
            slotProps={{
              ...datePickerProps?.slotProps,
              textField: {
                ...textFieldProps,
                name: field.name,
                inputRef: field.ref,
                onBlur: field.onBlur,
                error: errorProps.error,
                helperText: errorProps.helperText ?? textFieldProps?.helperText,
                fullWidth: textFieldProps?.fullWidth ?? true,
                FormHelperTextProps: {
                  ...textFieldProps?.FormHelperTextProps,
                  ...errorProps.FormHelperTextProps,
                },
              },
            }}
          />
        )
      }}
    />
  )
}

export function FormTimePicker<T extends FieldValues>({
  name,
  label,
  disabled,
  valueFormat = 'time',
  textFieldProps,
  timePickerProps,
}: FormTimePickerProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const errorProps = getFieldErrorProps(fieldState.error)

        return (
          <TimePicker
            {...timePickerProps}
            label={label}
            disabled={disabled}
            value={toDayjs(field.value, valueFormat)}
            onChange={(next) => field.onChange(fromDayjs(next, valueFormat))}
            slotProps={{
              ...timePickerProps?.slotProps,
              textField: {
                ...textFieldProps,
                name: field.name,
                inputRef: field.ref,
                onBlur: field.onBlur,
                error: errorProps.error,
                helperText: errorProps.helperText ?? textFieldProps?.helperText,
                fullWidth: textFieldProps?.fullWidth ?? true,
                FormHelperTextProps: {
                  ...textFieldProps?.FormHelperTextProps,
                  ...errorProps.FormHelperTextProps,
                },
              },
            }}
          />
        )
      }}
    />
  )
}

export function FormDateTimePicker<T extends FieldValues>({
  name,
  label,
  disabled,
  valueFormat = 'iso',
  textFieldProps,
  dateTimePickerProps,
}: FormDateTimePickerProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const errorProps = getFieldErrorProps(fieldState.error)

        return (
          <DateTimePicker
            {...dateTimePickerProps}
            label={label}
            disabled={disabled}
            value={toDayjs(field.value, valueFormat)}
            onChange={(next) => field.onChange(fromDayjs(next, valueFormat))}
            slotProps={{
              ...dateTimePickerProps?.slotProps,
              textField: {
                ...textFieldProps,
                name: field.name,
                inputRef: field.ref,
                onBlur: field.onBlur,
                error: errorProps.error,
                helperText: errorProps.helperText ?? textFieldProps?.helperText,
                fullWidth: textFieldProps?.fullWidth ?? true,
                FormHelperTextProps: {
                  ...textFieldProps?.FormHelperTextProps,
                  ...errorProps.FormHelperTextProps,
                },
              },
            }}
          />
        )
      }}
    />
  )
}

export type { Dayjs }
