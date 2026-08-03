import { useLoading, useToast } from '@raccoonland/feedback'
import { PipelineHooksProvider, type PipelineHooksAdapter } from '@raccoonland/pipeline-client'
import { useMemo, type ReactNode } from 'react'

/**
 * Wires `@raccoonland/pipeline-client` hooks to this sample's toast + loading
 * providers from `@raccoonland/feedback`. Kept in the app (not the package) so
 * pipeline-client stays UI-agnostic.
 */
export function PipelineHooksBridge({ children }: { children: ReactNode }) {
  const { showError, showWarning } = useToast()
  const { withLoading } = useLoading()

  const adapter = useMemo<PipelineHooksAdapter>(
    () => ({
      toast: { showError, showWarning },
      loading: { withLoading },
    }),
    [showError, showWarning, withLoading],
  )

  return <PipelineHooksProvider adapter={adapter}>{children}</PipelineHooksProvider>
}
