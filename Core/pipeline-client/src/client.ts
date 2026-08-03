import { isAxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import {
  InvalidPipelineResponseError,
  isAbortError,
  NetworkError,
  PipelineApiError,
} from './errors'
import { normalizePipelineData } from './normalizePipelineData'
import type { PipelineMessage, PipelineResponse, PipelineResult } from './types/pipeline'

function isPipelineResponse(value: unknown): value is PipelineResponse<unknown> {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as PipelineResponse<unknown>
  return Array.isArray(candidate.errors) && Array.isArray(candidate.warnings)
}

function normalizePipelineMessages(value: unknown): PipelineMessage[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => {
    if (!item || typeof item !== 'object') {
      return { code: 'InvalidMessage', message: 'Invalid pipeline message' }
    }

    const candidate = item as Partial<PipelineMessage>
    const code = typeof candidate.code === 'string' && candidate.code.trim() ? candidate.code : 'Unknown'
    const message =
      typeof candidate.message === 'string' && candidate.message.trim()
        ? candidate.message
        : 'Pipeline request failed'

    return { code, message }
  })
}

function parsePipelineResponse<T>(body: unknown, status: number): PipelineResult<T> {
  if (!isPipelineResponse(body)) {
    throw new InvalidPipelineResponseError(status, body)
  }

  const errors = normalizePipelineMessages(body.errors)
  const warnings = normalizePipelineMessages(body.warnings)

  if (errors.length > 0) {
    throw new PipelineApiError(errors, status)
  }

  return {
    data: normalizePipelineData(body.result) as T,
    warnings: normalizePipelineData(warnings),
  }
}

export type PipelineClient = {
  fetchPipeline: <T>(path: string, config?: AxiosRequestConfig) => Promise<PipelineResult<T>>
}

/**
 * Bind PipelineResponse parsing to a specific axios instance.
 * Auth (token / refresh) stays on the axios instance — not in this layer.
 */
export function createPipelineClient(http: AxiosInstance): PipelineClient {
  return {
    async fetchPipeline<T>(path: string, config?: AxiosRequestConfig): Promise<PipelineResult<T>> {
      try {
        const response = await http.request<PipelineResponse<T>>({
          url: path,
          ...config,
        })

        return parsePipelineResponse(response.data, response.status)
      } catch (error) {
        if (
          error instanceof PipelineApiError ||
          error instanceof NetworkError ||
          error instanceof InvalidPipelineResponseError
        ) {
          throw error
        }

        if (isAbortError(error)) {
          throw error
        }

        if (isAxiosError(error)) {
          if (error.response) {
            return parsePipelineResponse(error.response.data, error.response.status)
          }

          throw new NetworkError()
        }

        throw new NetworkError()
      }
    },
  }
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}
