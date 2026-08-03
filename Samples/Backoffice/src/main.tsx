import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeModeProvider } from '@raccoonland/theme'
import App from './app/App'
import { AppErrorBoundary } from './app/AppErrorBoundary'
import { LocaleProvider } from './i18n/LocaleProvider'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element "#root" was not found in the document.')
}

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <LocaleProvider>
        <ThemeModeProvider defaultMode="system" storageKey="raccoonland-sample-theme">
          <App />
        </ThemeModeProvider>
      </LocaleProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
