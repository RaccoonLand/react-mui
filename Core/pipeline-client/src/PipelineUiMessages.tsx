import { createContext, useContext, useMemo, type ReactNode } from 'react'

export type PipelineUiMessages = {
  networkError: string
  invalidPipelineResponse: string
  unknownError: string
}

const defaultMessages: PipelineUiMessages = {
  networkError: 'Could not reach the server',
  invalidPipelineResponse: 'The server returned an invalid response',
  unknownError: 'An unknown error occurred',
}

const PipelineUiMessagesContext = createContext<PipelineUiMessages>(defaultMessages)

type PipelineUiMessagesProviderProps = {
  messages?: Partial<PipelineUiMessages>
  children: ReactNode
}

/** Optional — apps pass localized strings; English defaults apply otherwise. */
export function PipelineUiMessagesProvider({
  messages,
  children,
}: PipelineUiMessagesProviderProps) {
  // Memoize so consumers of usePipelineUiMessages don't re-render just because
  // the parent re-rendered. Callers should pass a stable `messages` reference
  // (useMemo / module-level constant).
  const value = useMemo<PipelineUiMessages>(
    () => ({ ...defaultMessages, ...messages }),
    [messages],
  )

  return (
    <PipelineUiMessagesContext.Provider value={value}>{children}</PipelineUiMessagesContext.Provider>
  )
}

export function usePipelineUiMessages() {
  return useContext(PipelineUiMessagesContext)
}
