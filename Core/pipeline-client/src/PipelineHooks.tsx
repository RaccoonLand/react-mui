import { createContext, useContext, useMemo, type ReactNode } from 'react'

/**
 * Adapters wire pipeline-client hooks to whichever toast / loading
 * implementation the host app uses. The package no longer depends on
 * `@raccoonland/feedback` — apps supply their own adapter.
 */

export type PipelineLoadingScope = 'global' | 'local'

export type PipelineLoadingAdapter = {
  withLoading: <T>(
    action: () => Promise<T>,
    options?: { scope?: PipelineLoadingScope; message?: string },
  ) => Promise<T>
}

export type PipelineToastAdapter = {
  showError: (message: string) => void
  showWarning: (message: string) => void
}

export type PipelineHooksAdapter = {
  toast: PipelineToastAdapter
  loading: PipelineLoadingAdapter
}

/**
 * Silent fallback so `usePipelineQuery` / `usePipelineMutation` still work
 * (throwing errors, but no crash) when the app has not mounted any UI adapter.
 */
const defaultAdapter: PipelineHooksAdapter = {
  toast: {
    showError: () => {},
    showWarning: () => {},
  },
  loading: {
    withLoading: (action) => action(),
  },
}

const PipelineHooksContext = createContext<PipelineHooksAdapter>(defaultAdapter)

type PipelineHooksProviderProps = {
  adapter: PipelineHooksAdapter
  children: ReactNode
}

/**
 * Provides toast + loading adapters to `usePipelineQuery` / `usePipelineMutation`.
 * Wire this once near the root of your app, using whichever UI library you prefer.
 */
export function PipelineHooksProvider({
  adapter,
  children,
}: PipelineHooksProviderProps) {
  const value = useMemo<PipelineHooksAdapter>(
    () => ({
      toast: adapter.toast,
      loading: adapter.loading,
    }),
    [adapter.toast, adapter.loading],
  )

  return (
    <PipelineHooksContext.Provider value={value}>
      {children}
    </PipelineHooksContext.Provider>
  )
}

export function usePipelineHooks(): PipelineHooksAdapter {
  return useContext(PipelineHooksContext)
}
