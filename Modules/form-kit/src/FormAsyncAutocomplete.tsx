import {
  Autocomplete,
  CircularProgress,
  TextField,
  type AutocompleteProps,
  type TextFieldProps,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
  type FieldError,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form'
import { getFieldErrorProps } from './fieldError'
import { mergeRefs } from './mergeRefs'
import type { FormControlNameProps, FormOption } from './types'

type BaseAsyncAutocompleteProps<
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
> = Omit<
  AutocompleteProps<FormOption, Multiple, DisableClearable, false>,
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'renderInput'
  | 'options'
  | 'loading'
  | 'filterOptions'
  | 'onInputChange'
  | 'inputValue'
  | 'freeSolo'
>

export type FormAsyncLoadOptions = (
  query: string,
  signal: AbortSignal,
) => Promise<FormOption[]>

export type FormAsyncAutocompleteProps<
  T extends FieldValues,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
> = FormControlNameProps<T> &
  BaseAsyncAutocompleteProps<Multiple, DisableClearable> & {
    loadOptions: FormAsyncLoadOptions
    label?: TextFieldProps['label']
    placeholder?: string
    textFieldProps?: Omit<TextFieldProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'label'>
    /** When true, form value is option `value` (or array of values). Default `true`. */
    valueAsPrimitive?: boolean
    /** Debounce delay for `loadOptions` after input changes. Default `300`. */
    debounceMs?: number
    /**
     * Minimum trimmed input length before calling `loadOptions`.
     * Below this, options stay empty aside from the current selection / `defaultOptions`.
     * Default `0`.
     */
    minInputLength?: number
    /**
     * Seed options / label resolution for the current form value (edit screens).
     * Merged into the option list and selection cache.
     */
    defaultOptions?: FormOption[]
    /** Fetch when the popup opens (with current input). Default `true`. */
    loadOnOpen?: boolean
  }

function optionKey(option: FormOption): string {
  return String(option.value)
}

function findOption(options: FormOption[], value: unknown): FormOption | null {
  if (value == null || value === '') {
    return null
  }

  if (typeof value === 'object' && value !== null && 'value' in value) {
    return value as FormOption
  }

  return options.find((option) => String(option.value) === String(value)) ?? null
}

function mergeUnique(...lists: FormOption[][]): FormOption[] {
  const map = new Map<string, FormOption>()
  for (const list of lists) {
    for (const option of list) {
      map.set(optionKey(option), option)
    }
  }
  return [...map.values()]
}

/** Stable default so omitting `defaultOptions` does not retrigger the load effect every render. */
const EMPTY_OPTIONS: FormOption[] = []

type InnerProps<
  T extends FieldValues,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
> = Omit<FormAsyncAutocompleteProps<T, Multiple, DisableClearable>, 'name'> & {
  field: ControllerRenderProps<T, FieldPath<T>>
  error: FieldError | undefined
}

function FormAsyncAutocompleteInner<
  T extends FieldValues,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
>({
  field,
  error,
  loadOptions,
  label,
  placeholder,
  textFieldProps,
  valueAsPrimitive = true,
  multiple,
  debounceMs = 300,
  minInputLength = 0,
  defaultOptions = EMPTY_OPTIONS,
  loadOnOpen = true,
  ...props
}: InnerProps<T, Multiple, DisableClearable>) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState<FormOption[]>(() => defaultOptions)
  const [loading, setLoading] = useState(false)

  const selectedCacheRef = useRef<Map<string, FormOption>>(new Map())
  const loadOptionsRef = useRef(loadOptions)
  const requestIdRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const selectedForMergeRef = useRef<FormOption[]>([])

  loadOptionsRef.current = loadOptions

  useEffect(() => {
    for (const option of defaultOptions) {
      selectedCacheRef.current.set(optionKey(option), option)
    }
  }, [defaultOptions])

  const pool = mergeUnique(defaultOptions, [...selectedCacheRef.current.values()], options)

  const selected = multiple
    ? (Array.isArray(field.value) ? field.value : [])
        .map((item) => findOption(pool, item))
        .filter((item): item is FormOption => item != null)
    : findOption(pool, field.value)

  selectedForMergeRef.current = multiple
    ? (selected as FormOption[])
    : selected
      ? [selected as FormOption]
      : []

  useEffect(() => {
    for (const option of selectedForMergeRef.current) {
      selectedCacheRef.current.set(optionKey(option), option)
    }
  }, [field.value, options, defaultOptions, multiple])

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort()
      abortRef.current = null
      setLoading(false)
      return
    }

    const trimmed = inputValue.trim()

    if (trimmed.length < minInputLength) {
      setOptions(mergeUnique(selectedForMergeRef.current, defaultOptions))
      setLoading(false)
      return
    }

    if (!loadOnOpen && trimmed.length === 0) {
      setLoading(false)
      return
    }

    const timer = window.setTimeout(() => {
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac
      const requestId = ++requestIdRef.current
      setLoading(true)

      void loadOptionsRef
        .current(trimmed, ac.signal)
        .then((result) => {
          if (requestId !== requestIdRef.current || ac.signal.aborted) {
            return
          }
          setOptions(mergeUnique(selectedForMergeRef.current, defaultOptions, result))
        })
        .catch((error: unknown) => {
          if (requestId !== requestIdRef.current || ac.signal.aborted) {
            return
          }
          // AbortError from fetch/axios is expected; keep selection-only options.
          if (
            error &&
            typeof error === 'object' &&
            'name' in error &&
            (error as { name?: string }).name === 'AbortError'
          ) {
            return
          }
          setOptions(mergeUnique(selectedForMergeRef.current, defaultOptions))
        })
        .finally(() => {
          if (requestId === requestIdRef.current) {
            setLoading(false)
          }
        })
    }, debounceMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [open, inputValue, debounceMs, minInputLength, loadOnOpen, defaultOptions])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const errorProps = getFieldErrorProps(error)

  return (
    <Autocomplete
      {...props}
      multiple={multiple}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={options}
      loading={loading}
      filterOptions={(opts) => opts}
      inputValue={inputValue}
      onInputChange={(_, next, reason) => {
        // Keep user typing (`input`) and selection/clear resets in sync with MUI.
        // Ignoring `reset` left the field showing the old query after a pick.
        if (reason === 'input' || reason === 'clear' || reason === 'reset') {
          setInputValue(next)
        }
      }}
      value={selected as never}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      isOptionEqualToValue={(option, value) =>
        String(option.value) ===
        String(
          typeof value === 'object' && value && 'value' in value ? value.value : value,
        )
      }
      getOptionDisabled={(option) =>
        Boolean(option.disabled) || Boolean(props.getOptionDisabled?.(option))
      }
      onBlur={field.onBlur}
      onChange={(_, next) => {
        const picked = multiple
          ? Array.isArray(next)
            ? next.filter((item): item is FormOption => typeof item !== 'string')
            : []
          : next && typeof next !== 'string'
            ? [next as FormOption]
            : []

        for (const option of picked) {
          selectedCacheRef.current.set(optionKey(option), option)
        }

        if (!valueAsPrimitive) {
          field.onChange(next as PathValue<T, FieldPath<T>>)
          return
        }

        if (multiple) {
          field.onChange(picked.map((item) => item.value) as PathValue<T, FieldPath<T>>)
          return
        }

        const single = picked[0]
        field.onChange((single ? single.value : null) as PathValue<T, FieldPath<T>>)
      }}
      renderInput={(params) => {
        const {
          inputProps: userInputProps,
          InputProps: userInputPropsRoot,
          inputRef: userInputRef,
          ...restTextFieldProps
        } = textFieldProps ?? {}

        return (
          <TextField
            {...params}
            {...restTextFieldProps}
            name={field.name}
            label={label}
            placeholder={placeholder}
            error={errorProps.error}
            helperText={errorProps.helperText ?? textFieldProps?.helperText}
            FormHelperTextProps={{
              ...textFieldProps?.FormHelperTextProps,
              ...errorProps.FormHelperTextProps,
            }}
            // Host `textFieldProps.inputProps` must merge — replacing params.inputProps
            // drops Autocomplete wiring and crashes (removeAttribute on null).
            inputProps={{
              ...params.inputProps,
              ...userInputProps,
            }}
            inputRef={mergeRefs(field.ref, userInputRef)}
            InputProps={{
              ...params.InputProps,
              ...userInputPropsRoot,
              ref: mergeRefs(params.InputProps.ref, userInputPropsRoot?.ref),
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                  {userInputPropsRoot?.endAdornment}
                </>
              ),
            }}
          />
        )
      }}
    />
  )
}

export function FormAsyncAutocomplete<
  T extends FieldValues,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
>({ name, ...props }: FormAsyncAutocompleteProps<T, Multiple, DisableClearable>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => (
        <FormAsyncAutocompleteInner<T, Multiple, DisableClearable>
          {...props}
          field={field}
          error={fieldState.error}
        />
      )}
    />
  )
}
