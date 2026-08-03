import { RouterProvider } from 'react-router-dom'
import { AppErrorBoundary } from './AppErrorBoundary'
import { AppProviders } from './AppProviders'
import { router } from './router'

export default function App() {
  return (
    <AppProviders>
      <AppErrorBoundary>
        <RouterProvider router={router} />
      </AppErrorBoundary>
    </AppProviders>
  )
}
