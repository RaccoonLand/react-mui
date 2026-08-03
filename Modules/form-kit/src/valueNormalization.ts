import type { ValueAs } from './types'

export function normalizeTextValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

export function normalizeSelectValue(value: unknown, valueAs: ValueAs = 'string'): string | number {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  if (valueAs === 'number') {
    const numeric = typeof value === 'number' ? value : Number(value)
    return Number.isNaN(numeric) ? '' : numeric
  }

  return String(value)
}

export function coerceSelectChange(raw: string, valueAs: ValueAs = 'string'): string | number {
  // Empty selection must stay empty for every valueAs.
  // Number('') === 0 would incorrectly write 0 into the form (FormSelect / FormRadioGroup /
  // and FormMultiSelect via coerceMultiSelectChange).
  if (raw === '') {
    return ''
  }

  if (valueAs === 'number') {
    return Number(raw)
  }

  return raw
}

export function normalizeMultiSelectValue(
  value: unknown,
  valueAs: ValueAs = 'string',
): Array<string | number> {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => {
    if (valueAs === 'number') {
      return typeof item === 'number' ? item : Number(item)
    }

    return String(item)
  })
}

export function coerceMultiSelectChange(
  raw: string | string[],
  valueAs: ValueAs = 'string',
): Array<string | number> {
  const values = Array.isArray(raw) ? raw : [raw]

  return values.map((item) => coerceSelectChange(item, valueAs))
}

export function normalizeBooleanValue(value: unknown): boolean {
  return Boolean(value)
}

/** Convert empty optional strings to null before API submit. */
export function emptyToNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null
  }

  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}
