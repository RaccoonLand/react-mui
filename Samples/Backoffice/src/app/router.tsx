import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BackofficeLayout } from '../layout/BackofficeLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { DataTableGuidePage } from '../pages/guides/DataTableGuidePage'
import { FeedbackGuidePage } from '../pages/guides/FeedbackGuidePage'
import { FormKitGuidePage } from '../pages/guides/FormKitGuidePage'
import { LayoutGuidePage } from '../pages/guides/LayoutGuidePage'
import { PageGuidePage } from '../pages/guides/PageGuidePage'
import { PipelineClientGuidePage } from '../pages/guides/PipelineClientGuidePage'
import { ThemeGuidePage } from '../pages/guides/ThemeGuidePage'
import { LayoutSettingsPage } from '../pages/settings/LayoutSettingsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RouteErrorPage } from './RouteErrorPage'

export const router = createBrowserRouter([
  {
    element: <BackofficeLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/packages/pipeline-client', element: <PipelineClientGuidePage /> },
      { path: '/packages/theme', element: <ThemeGuidePage /> },
      { path: '/packages/feedback', element: <FeedbackGuidePage /> },
      { path: '/packages/form-kit', element: <FormKitGuidePage /> },
      { path: '/packages/page', element: <PageGuidePage /> },
      { path: '/packages/data-table', element: <DataTableGuidePage /> },
      { path: '/packages/layout', element: <LayoutGuidePage /> },
      { path: '/settings', element: <Navigate to="/settings/layout" replace /> },
      { path: '/settings/layout', element: <LayoutSettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
