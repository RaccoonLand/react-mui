import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import {
  GlobalStyles,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  alpha,
  useTheme,
  type TextFieldProps,
} from '@mui/material'
import { useMemo, type ComponentType, type CSSProperties, type ReactNode } from 'react'
import MultiDatePickerModule, { type DatePickerProps } from 'react-multi-date-picker'
import DateObjectModule from 'react-date-object'
import gregorian from 'react-date-object/calendars/gregorian'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { getFieldErrorProps } from './fieldError'
import type { FormControlNameProps } from './types'

/** CJS packages often arrive as `{ default: Component }` under Vite ESM. */
function resolveDefaultExport<T>(mod: T | { default: T }): T {
  if (typeof mod === 'function') {
    return mod
  }

  if (mod && typeof mod === 'object' && 'default' in mod) {
    return (mod as { default: T }).default
  }

  return mod as T
}

type DateObjectConstructor = typeof DateObjectModule
type DateObjectInstance = InstanceType<DateObjectConstructor>

const DateObject = resolveDefaultExport(DateObjectModule) as DateObjectConstructor
const DatePicker = resolveDefaultExport(MultiDatePickerModule) as ComponentType<Record<string, unknown>>

/**
 * Stable class name shared by every instance of the picker. Using a stable
 * class (instead of a `useId()`-derived one per instance) means that when a
 * form has multiple Persian pickers, they all bind to the same generated
 * stylesheet — no per-instance CSS scope recomputation and no per-instance
 * duplication of the (identical) selectors.
 */
const PICKER_SCOPE_CLASS = 'rl-persian-datepicker'

/** How the RHF value is stored. */
export type FormPersianDateValueFormat = 'jalali' | 'iso'

export type FormPersianDateRangeValue = [string | null, string | null]

type PickerExtras = Omit<
  DatePickerProps,
  | 'value'
  | 'onChange'
  | 'range'
  | 'calendar'
  | 'locale'
  | 'format'
  | 'render'
  | 'disabled'
  | 'placeholder'
  | 'inputClass'
  | 'minDate'
  | 'maxDate'
  | 'className'
  | 'containerClassName'
>

export type FormPersianDatePickerProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: TextFieldProps['label']
  disabled?: boolean
  placeholder?: string
  /**
   * When true, field value is `[start, end]` and two independent calendars are shown
   * so each side can navigate month/year freely.
   */
  range?: boolean
  /** Labels for the start/end inputs when `range` is enabled. */
  rangeLabels?: { start?: string; end?: string }
  /**
   * - `jalali` → `YYYY/MM/DD` (default)
   * - `iso` → Gregorian `YYYY-MM-DD`
   */
  valueFormat?: FormPersianDateValueFormat
  /** Display format inside the input (Jalali calendar). Default `YYYY/MM/DD`. */
  displayFormat?: string
  textFieldProps?: Omit<
    TextFieldProps,
    'name' | 'value' | 'defaultValue' | 'onChange' | 'label' | 'disabled'
  >
  datePickerProps?: PickerExtras
}

type PickerColors = {
  primary: string
  primaryContrast: string
  primarySoft: string
  bg: string
  text: string
  textSecondary: string
  border: string
  hover: string
  today: string
  shadow: string
  weekDay: string
}

function usePickerColors(): PickerColors {
  const theme = useTheme()
  const raccoon = (theme as { raccoon?: {
    primary: { main: string; light: string; contrastText: string }
    background: { elevated: string; paper: string }
    text: { primary: string; secondary: string }
    border: { subtle: string }
    secondary: { main: string }
  } }).raccoon

  // Theme object identity is stable until mode/direction changes (see
  // createRaccoonTheme cache). Memoizing here keeps downstream GlobalStyles
  // useMemo from recomputing an identical selector map every render.
  return useMemo(() => {
    const primary = raccoon?.primary.main ?? theme.palette.primary.main
    const bg =
      raccoon?.background.elevated ?? raccoon?.background.paper ?? theme.palette.background.paper

    return {
      primary,
      primaryContrast: raccoon?.primary.contrastText ?? theme.palette.primary.contrastText,
      primarySoft: alpha(primary, theme.palette.mode === 'dark' ? 0.28 : 0.16),
      bg,
      text: raccoon?.text.primary ?? theme.palette.text.primary,
      textSecondary: raccoon?.text.secondary ?? theme.palette.text.secondary,
      border: raccoon?.border.subtle ?? theme.palette.divider,
      hover: alpha(primary, theme.palette.mode === 'dark' ? 0.35 : 0.12),
      today: raccoon?.secondary.main ?? theme.palette.secondary.main,
      shadow: theme.shadows[8],
      weekDay: raccoon?.primary.light ?? theme.palette.primary.light,
    }
  }, [theme, raccoon])
}

function persianCalendarGlobalStyles(scope: string, colors: PickerColors) {
  const root = `.${scope}`
  return {
    [`${root}.rmdp-wrapper`]: {
      backgroundColor: `${colors.bg} !important`,
      border: `1px solid ${colors.border} !important`,
      boxShadow: `${colors.shadow} !important`,
      borderRadius: '10px !important',
      fontFamily: 'inherit',
      color: colors.text,
    },
    [`${root}.rmdp-border, ${root} .rmdp-border, ${root} .rmdp-border-top, ${root} .rmdp-border-bottom, ${root} .rmdp-border-left, ${root} .rmdp-border-right`]:
      {
        borderColor: `${colors.border} !important`,
      },
    [`${root} .rmdp-calendar`]: {
      backgroundColor: colors.bg,
      color: colors.text,
    },
    [`${root} .rmdp-header-values, ${root} .rmdp-header-values span`]: {
      color: `${colors.text} !important`,
    },
    [`${root} .rmdp-week-day`]: {
      color: `${colors.weekDay} !important`,
    },
    [`${root} .rmdp-day`]: {
      color: colors.text,
    },
    [`${root} .rmdp-day.rmdp-deactive, ${root} .rmdp-day.rmdp-disabled`]: {
      color: `${colors.textSecondary} !important`,
      opacity: 0.55,
    },
    [`${root} .rmdp-day.rmdp-today span`]: {
      backgroundColor: `${alpha(colors.today, 0.22)} !important`,
      color: `${colors.text} !important`,
      boxShadow: 'none !important',
    },
    [`${root} .rmdp-day.rmdp-selected span:not(.highlight)`]: {
      backgroundColor: `${colors.primary} !important`,
      color: `${colors.primaryContrast} !important`,
      boxShadow: 'none !important',
    },
    [`${root} .rmdp-range`]: {
      backgroundColor: `${colors.primarySoft} !important`,
      color: `${colors.text} !important`,
      boxShadow: 'none !important',
    },
    [`${root} .rmdp-range-hover`]: {
      backgroundColor: `${colors.hover} !important`,
      color: `${colors.text} !important`,
    },
    [`${root} .rmdp-day:not(.rmdp-disabled,.rmdp-day-hidden) span:hover`]: {
      backgroundColor: `${colors.hover} !important`,
      color: `${colors.text} !important`,
    },
    [`${root} .rmdp-arrow`]: {
      borderColor: `${colors.primary} !important`,
      borderWidth: '0 2px 2px 0 !important',
    },
    [`${root} .rmdp-arrow-container:hover`]: {
      backgroundColor: `${colors.primary} !important`,
      boxShadow: 'none !important',
    },
    [`${root} .rmdp-arrow-container:hover .rmdp-arrow`]: {
      borderColor: `${colors.primaryContrast} !important`,
      borderWidth: '0 2px 2px 0 !important',
    },
    [`${root} .rmdp-month-picker, ${root} .rmdp-year-picker`]: {
      backgroundColor: `${colors.bg} !important`,
      color: colors.text,
    },
    [`${root} .rmdp-ym .rmdp-day span`]: {
      color: colors.text,
    },
    [`${root} .rmdp-ym .rmdp-day.rmdp-selected span`]: {
      backgroundColor: `${colors.primary} !important`,
      color: `${colors.primaryContrast} !important`,
    },
    [`${root}.rmdp-ep-arrow:after`]: {
      backgroundColor: `${colors.bg} !important`,
      boxShadow: `0 0 6px ${alpha(colors.text, 0.18)} !important`,
    },
  }
}

function createPersianDate(date?: string | Date | DateObjectInstance, format = 'YYYY/MM/DD') {
  if (date instanceof DateObject) {
    return new DateObject(date).setCalendar(persian).setLocale(persian_fa)
  }

  if (date instanceof Date) {
    return new DateObject({ date, calendar: persian, locale: persian_fa })
  }

  if (typeof date === 'string' && date.trim() !== '') {
    return new DateObject({
      date,
      format,
      calendar: persian,
      locale: persian_fa,
    })
  }

  return new DateObject({ calendar: persian, locale: persian_fa })
}

function toStoredValue(
  date: DateObjectInstance | null | undefined,
  valueFormat: FormPersianDateValueFormat,
): string | null {
  if (!date || !date.isValid) {
    return null
  }

  if (valueFormat === 'iso') {
    return new DateObject(date).convert(gregorian).format('YYYY-MM-DD')
  }

  return new DateObject(date).convert(persian).format('YYYY/MM/DD')
}

function fromStoredValue(
  value: unknown,
  valueFormat: FormPersianDateValueFormat,
): DateObjectInstance | null {
  if (value == null || value === '') {
    return null
  }

  if (value instanceof DateObject) {
    return createPersianDate(value)
  }

  if (value instanceof Date) {
    return createPersianDate(value)
  }

  const raw = String(value).trim()
  if (!raw) {
    return null
  }

  if (valueFormat === 'iso') {
    const parsed = new DateObject({
      date: raw,
      format: 'YYYY-MM-DD',
      calendar: gregorian,
    })
    if (!parsed.isValid) {
      return null
    }
    return parsed.convert(persian, persian_fa)
  }

  const parsed = createPersianDate(raw, 'YYYY/MM/DD')
  return parsed.isValid ? parsed : null
}

type SinglePickerProps = {
  scopeClass: string
  value: DateObjectInstance | null
  onChange: (next: DateObjectInstance | null) => void
  onBlur: () => void
  name: string
  inputRef: (instance: unknown) => void
  label?: TextFieldProps['label']
  disabled?: boolean
  placeholder?: string
  displayFormat: string
  error?: boolean
  helperText?: ReactNode
  helperTextProps?: object
  textFieldProps?: FormPersianDatePickerProps<FieldValues>['textFieldProps']
  datePickerProps?: PickerExtras
  minDate?: DateObjectInstance | null
  maxDate?: DateObjectInstance | null
  containerStyle?: CSSProperties
}

function SinglePersianPicker({
  scopeClass,
  value,
  onChange,
  onBlur,
  name,
  inputRef,
  label,
  disabled,
  placeholder,
  displayFormat,
  error,
  helperText,
  helperTextProps,
  textFieldProps,
  datePickerProps,
  minDate,
  maxDate,
  containerStyle,
}: SinglePickerProps) {
  return (
    <DatePicker
      {...datePickerProps}
      calendar={persian}
      locale={persian_fa}
      format={displayFormat}
      range={false}
      numberOfMonths={1}
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      minDate={minDate ?? undefined}
      maxDate={maxDate ?? undefined}
      containerStyle={containerStyle}
      className={scopeClass}
      containerClassName={scopeClass}
      onOpenPickNewDate={false}
      // Keep month/year pickers available so users can jump across years.
      disableMonthPicker={false}
      disableYearPicker={false}
      onChange={(next: DateObjectInstance | DateObjectInstance[] | null) => {
        const single = Array.isArray(next) ? (next[0] ?? null) : next
        onChange(single && single.isValid ? single : null)
      }}
      render={(displayValue: string, openCalendar: () => void) => (
        <TextField
          {...textFieldProps}
          name={name}
          label={label}
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          onClick={openCalendar}
          onFocus={openCalendar}
          onBlur={onBlur}
          inputRef={inputRef}
          fullWidth={textFieldProps?.fullWidth ?? true}
          error={error}
          helperText={helperText ?? textFieldProps?.helperText}
          FormHelperTextProps={{
            ...textFieldProps?.FormHelperTextProps,
            ...helperTextProps,
          }}
          slotProps={{
            ...textFieldProps?.slotProps,
            input: {
              ...textFieldProps?.slotProps?.input,
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    disabled={disabled}
                    aria-label={typeof label === 'string' ? label : 'open calendar'}
                    onClick={openCalendar}
                  >
                    <CalendarMonthOutlinedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  )
}

export function FormPersianDatePicker<T extends FieldValues>({
  name,
  label,
  disabled,
  placeholder,
  range = false,
  rangeLabels,
  valueFormat = 'jalali',
  displayFormat = 'YYYY/MM/DD',
  textFieldProps,
  datePickerProps,
}: FormPersianDatePickerProps<T>) {
  const { control } = useFormContext<T>()
  const colors = usePickerColors()
  const scopeClass = PICKER_SCOPE_CLASS

  // Memoize the compiled styles per theme so N pickers on the same page do
  // not each recompute the same selector map every render.
  const globalStyles = useMemo(
    () => persianCalendarGlobalStyles(scopeClass, colors),
    [scopeClass, colors],
  )

  const containerStyle = useMemo(
    () => ({
      width: '100%',
      ...(datePickerProps?.containerStyle as object | undefined),
    }),
    [datePickerProps?.containerStyle],
  )

  const startLabel = rangeLabels?.start ?? (typeof label === 'string' ? `${label} (از)` : 'از تاریخ')
  const endLabel = rangeLabels?.end ?? (typeof label === 'string' ? `${label} (تا)` : 'تا تاریخ')

  return (
    <>
      <GlobalStyles styles={globalStyles} />
      <Controller
        name={name as FieldPath<T>}
        control={control}
        render={({ field, fieldState }) => {
          const errorProps = getFieldErrorProps(fieldState.error)

          if (range) {
            const pair = Array.isArray(field.value) ? field.value : [null, null]
            const start = fromStoredValue(pair[0], valueFormat)
            const end = fromStoredValue(pair[1], valueFormat)

            return (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <SinglePersianPicker
                    scopeClass={scopeClass}
                    value={start}
                    minDate={null}
                    maxDate={end}
                    onChange={(next) => {
                      const nextStart = toStoredValue(next, valueFormat)
                      const nextEnd = toStoredValue(end, valueFormat)
                      // If start moves after end, clear end so the user can re-pick freely.
                      if (next && end && next > end) {
                        field.onChange([nextStart, null] satisfies FormPersianDateRangeValue)
                        return
                      }
                      field.onChange([nextStart, nextEnd] satisfies FormPersianDateRangeValue)
                    }}
                    onBlur={field.onBlur}
                    name={`${field.name}-start`}
                    inputRef={field.ref}
                    label={startLabel}
                    disabled={disabled}
                    placeholder={placeholder}
                    displayFormat={displayFormat}
                    error={errorProps.error}
                    helperText={errorProps.helperText}
                    helperTextProps={errorProps.FormHelperTextProps}
                    textFieldProps={textFieldProps}
                    datePickerProps={datePickerProps}
                    containerStyle={containerStyle}
                  />
                  <SinglePersianPicker
                    scopeClass={scopeClass}
                    value={end}
                    minDate={start}
                    maxDate={null}
                    onChange={(next) => {
                      const nextStart = toStoredValue(start, valueFormat)
                      const nextEnd = toStoredValue(next, valueFormat)
                      field.onChange([nextStart, nextEnd] satisfies FormPersianDateRangeValue)
                    }}
                    onBlur={field.onBlur}
                    name={`${field.name}-end`}
                    inputRef={() => undefined}
                    label={endLabel}
                    disabled={disabled}
                    placeholder={placeholder}
                    displayFormat={displayFormat}
                    error={errorProps.error}
                    textFieldProps={textFieldProps}
                    datePickerProps={datePickerProps}
                    containerStyle={containerStyle}
                  />
              </Stack>
            )
          }

          const single = fromStoredValue(field.value, valueFormat)

          return (
            <SinglePersianPicker
              scopeClass={scopeClass}
              value={single}
              onChange={(next) => field.onChange(toStoredValue(next, valueFormat))}
              onBlur={field.onBlur}
              name={field.name}
              inputRef={field.ref}
              label={label}
              disabled={disabled}
              placeholder={placeholder}
              displayFormat={displayFormat}
              error={errorProps.error}
              helperText={errorProps.helperText}
              helperTextProps={errorProps.FormHelperTextProps}
              textFieldProps={textFieldProps}
              datePickerProps={datePickerProps}
              containerStyle={containerStyle}
            />
          )
        }}
      />
    </>
  )
}
