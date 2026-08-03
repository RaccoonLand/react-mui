function normalizePipelineKey(key: string): string {
  if (!key) {
    return key
  }

  return key[0]!.toLowerCase() + key.slice(1)
}

export function normalizePipelineData<T>(value: T): T {
  if (value === null || value === undefined) {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizePipelineData(item)) as T
  }

  if (typeof value !== 'object') {
    return value
  }

  const record = value as Record<string, unknown>
  const normalized: Record<string, unknown> = {}

  for (const [key, nested] of Object.entries(record)) {
    normalized[normalizePipelineKey(key)] = normalizePipelineData(nested)
  }

  return normalized as T
}
