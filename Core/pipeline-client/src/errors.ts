import type { PipelineMessage } from './types/pipeline'

export class PipelineApiError extends Error {
  readonly errors: PipelineMessage[]
  readonly status: number

  constructor(errors: PipelineMessage[], status: number) {
    const message =
      errors
        .map((error) => error.message)
        .filter((text) => typeof text === 'string' && text.trim().length > 0)
        .join('; ') || 'Pipeline request failed'

    super(message)
    this.name = 'PipelineApiError'
    this.errors = errors
    this.status = status
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message)
    this.name = 'NetworkError'
  }
}

/** HTTP succeeded (or returned a body) but the body is not a valid PipelineResponse. */
export class InvalidPipelineResponseError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown, message = 'Invalid pipeline response') {
    super(message)
    this.name = 'InvalidPipelineResponseError'
    this.status = status
    this.body = body
  }
}

export function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const candidate = error as { name?: string; code?: string }
  return (
    candidate.name === 'AbortError' ||
    candidate.name === 'CanceledError' ||
    candidate.code === 'ERR_CANCELED'
  )
}
