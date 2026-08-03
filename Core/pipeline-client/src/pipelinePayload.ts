import type { PipelineMessage, PipelineResult } from './types/pipeline'

export type PipelinePayload<T> = {
  __pipelinePayload: true
  data: T
  warnings: PipelineMessage[]
}

export function createPipelinePayload<T>(result: PipelineResult<T>): PipelinePayload<T> {
  return {
    __pipelinePayload: true,
    data: result.data,
    warnings: result.warnings,
  }
}

export function isPipelinePayload<T>(value: unknown): value is PipelinePayload<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__pipelinePayload' in value &&
    (value as PipelinePayload<T>).__pipelinePayload === true
  )
}
