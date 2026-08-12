import type { Ref } from 'react'

/** Assign a value to a callback ref or object ref. */
export function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (ref == null) return
  if (typeof ref === 'function') {
    ref(value)
    return
  }
  ;(ref as { current: T | null }).current = value
}

/** Compose multiple refs into one callback (Autocomplete + RHF + host). */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (value: T | null) => void {
  return (value) => {
    for (const ref of refs) {
      assignRef(ref, value)
    }
  }
}
