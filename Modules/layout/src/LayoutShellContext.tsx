import { createContext, useContext, type ReactNode } from 'react'
import type { LayoutShellConfig } from './types'

const LayoutShellContext = createContext<LayoutShellConfig | null>(null)

export function LayoutShellProvider({
  value,
  children,
}: {
  value: LayoutShellConfig
  children: ReactNode
}) {
  return <LayoutShellContext.Provider value={value}>{children}</LayoutShellContext.Provider>
}

export function useLayoutShell(): LayoutShellConfig {
  const context = useContext(LayoutShellContext)
  if (!context) {
    throw new Error('useLayoutShell must be used within BackofficeLayout / LayoutShellProvider')
  }
  return context
}
