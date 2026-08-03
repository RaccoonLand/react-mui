import { useCallback, useEffect, useRef } from 'react'
import {
  useMutation,
  useQuery,
  type QueryFunctionContext,
  type QueryKey,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import {
  InvalidPipelineResponseError,
  isAbortError,
  NetworkError,
  PipelineApiError,
} from '../errors'
import { isPipelinePayload, type PipelinePayload } from '../pipelinePayload'
import { reportSystemError } from '../monitoring'
import { usePipelineHooks, type PipelineLoadingScope } from '../PipelineHooks'
import { usePipelineUiMessages } from '../PipelineUiMessages'

export type PipelineRequestOptions = {
  showGlobalLoader?: boolean
  loadingMessage?: string
  showErrorToast?: boolean
  showWarningToast?: boolean
}

type PipelineQueryOptions<TData, TQueryKey extends QueryKey> = Omit<
  UseQueryOptions<TData, Error, TData, TQueryKey>,
  'queryFn'
> &
  PipelineRequestOptions & {
    queryFn: (
      context: QueryFunctionContext<TQueryKey>,
    ) => Promise<TData | PipelinePayload<TData>>
  }

type PipelineMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
> &
  PipelineRequestOptions & {
    mutationFn: (variables: TVariables) => Promise<TData | PipelinePayload<TData>>
  }

function usePipelineExecutor(options: PipelineRequestOptions) {
  const {
    showGlobalLoader = true,
    loadingMessage,
    showErrorToast = true,
    showWarningToast = true,
  } = options
  const { toast, loading } = usePipelineHooks()
  const messages = usePipelineUiMessages()

  const loadingScope: PipelineLoadingScope = showGlobalLoader ? 'global' : 'local'

  const notifyError = useCallback(
    (error: unknown) => {
      if (isAbortError(error)) {
        return
      }

      if (showErrorToast) {
        if (error instanceof PipelineApiError) {
          error.errors.forEach((item) => toast.showError(item.message))
        } else if (error instanceof NetworkError) {
          toast.showError(messages.networkError)
          reportSystemError(error, { kind: 'network' })
        } else if (error instanceof InvalidPipelineResponseError) {
          toast.showError(messages.invalidPipelineResponse)
          reportSystemError(error, { kind: 'invalid-pipeline-response' })
        } else {
          toast.showError(messages.unknownError)
          reportSystemError(error, { kind: 'unknown' })
        }
      } else if (!(error instanceof PipelineApiError)) {
        reportSystemError(error, { kind: 'silent' })
      }
    },
    [showErrorToast, toast, messages],
  )

  const execute = useCallback(
    async <T,>(
      action: () => Promise<T | PipelinePayload<T>>,
      notifyOnError = true,
    ): Promise<T> => {
      const run = async (): Promise<T> => {
        try {
          const result = await action()

          if (isPipelinePayload<T>(result)) {
            if (showWarningToast) {
              result.warnings.forEach((warning) => toast.showWarning(warning.message))
            }
            return result.data
          }

          return result
        } catch (error) {
          if (notifyOnError) {
            notifyError(error)
          }
          throw error
        }
      }

      return loading.withLoading(run, { scope: loadingScope, message: loadingMessage })
    },
    [loading, loadingScope, loadingMessage, showWarningToast, toast, notifyError],
  )

  return { execute, notifyError }
}

export function usePipelineQuery<TData, TQueryKey extends QueryKey = QueryKey>(
  options: PipelineQueryOptions<TData, TQueryKey>,
): UseQueryResult<TData, Error> {
  const {
    queryFn,
    showGlobalLoader,
    loadingMessage,
    showErrorToast,
    showWarningToast,
    ...queryOptions
  } = options

  const { execute, notifyError } = usePipelineExecutor({
    showGlobalLoader,
    loadingMessage,
    showErrorToast,
    showWarningToast,
  })

  const query = useQuery({
    ...queryOptions,
    // Do not toast inside queryFn — retries would duplicate notifications.
    queryFn: (context) => execute(() => queryFn(context), false),
  })

  const lastNotifiedErrorAt = useRef(0)

  useEffect(() => {
    if (!query.isError || !query.error) {
      return
    }

    if (query.errorUpdatedAt === lastNotifiedErrorAt.current) {
      return
    }

    lastNotifiedErrorAt.current = query.errorUpdatedAt
    notifyError(query.error)
  }, [query.isError, query.error, query.errorUpdatedAt, notifyError])

  return query
}

export function usePipelineMutation<TData, TVariables = void>(
  options: PipelineMutationOptions<TData, TVariables>,
): UseMutationResult<TData, Error, TVariables> {
  const {
    mutationFn,
    showGlobalLoader,
    loadingMessage,
    showErrorToast,
    showWarningToast,
    ...mutationOptions
  } = options

  const { execute } = usePipelineExecutor({
    showGlobalLoader,
    loadingMessage,
    showErrorToast,
    showWarningToast,
  })

  return useMutation({
    ...mutationOptions,
    mutationFn: (variables) =>
      execute(() => {
        // Mutations default to no retry; toast immediately on failure.
        return mutationFn(variables)
      }, true),
  })
}
