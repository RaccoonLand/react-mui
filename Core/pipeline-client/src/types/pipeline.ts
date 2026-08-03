export type PipelineMessage = {
  code: string
  message: string
}

/**
 * Wire envelope from the backend.
 * Nullability of `result` is expressed via T (e.g. `PersonDetail | null` for get-by-id).
 */
export type PipelineResponse<T> = {
  result: T
  errors: PipelineMessage[]
  warnings: PipelineMessage[]
  statusHint?: number | null
}

/**
 * Parsed success result for app code.
 * Use `T | null` when the endpoint may return a null result.
 */
export type PipelineResult<T> = {
  data: T
  warnings: PipelineMessage[]
}
