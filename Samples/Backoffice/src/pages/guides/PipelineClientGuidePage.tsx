import {
  Alert,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import {
  createPipelineClient,
  createPipelinePayload,
  InvalidPipelineResponseError,
  NetworkError,
  PipelineApiError,
  usePipelineMutation,
  usePipelineQuery,
} from '@raccoonland/pipeline-client'
import { Page } from '@raccoonland/page'
import { useRaccoonTheme } from '@raccoonland/theme'
import axios from 'axios'
import { useMemo, useState } from 'react'
import { fetchPipeline } from '../../api/pipeline'
import { packageGuideBreadcrumbs } from '../../layout/breadcrumbIcons'
import { useLocale } from '../../i18n/LocaleProvider'
import { GuideUsageSection } from './GuideUsageSection'

const PIPELINE_USAGE_CODE = `import axios from 'axios'
import {
  createPipelineClient,
  createPipelinePayload,
  PipelineApiError,
  PipelineHooksProvider,
  PipelineUiMessagesProvider,
  usePipelineMutation,
  usePipelineQuery,
} from '@raccoonland/pipeline-client'

// 1) App owns axios (+ auth interceptors). Package only parses PipelineResponse.
const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })
// http.interceptors.request.use(...)  // attach token here
// http.interceptors.response.use(...) // refresh here

export const api = createPipelineClient(http)

// Optional second API — completely independent auth / base URL.
// const billingHttp = axios.create({ baseURL: 'https://billing.example' })
// export const billingApi = createPipelineClient(billingHttp)

// 2) Wire hooks to your UI adapters (once, near the root).
//    pipeline-client no longer depends on @raccoonland/feedback — you provide
//    whichever toast / loading implementation you like.
export function ApiProviders({ children }: { children: React.ReactNode }) {
  const { showError, showWarning } = useToast()   // your toast hook
  const { withLoading } = useLoading()             // your loader hook
  const adapter = React.useMemo(
    () => ({
      toast: { showError, showWarning },
      loading: { withLoading },
    }),
    [showError, showWarning, withLoading],
  )

  const messages = React.useMemo(
    () => ({
      networkError: 'Could not reach the server',
      invalidPipelineResponse: 'Invalid pipeline response',
      unknownError: 'Unknown error',
    }),
    [],
  )

  return (
    <PipelineUiMessagesProvider messages={messages}>
      <PipelineHooksProvider adapter={adapter}>{children}</PipelineHooksProvider>
    </PipelineUiMessagesProvider>
  )
}

// 3) Query — forward AbortSignal; toasts fire after retries settle
export function PeopleList() {
  const query = usePipelineQuery({
    queryKey: ['people', 'search'],
    queryFn: async ({ signal }) => {
      const result = await api.fetchPipeline<SearchResponse>(
        '/api/People/Search?Page=1&PageSize=10',
        { signal },
      )
      return createPipelinePayload(result) // preserves warnings for toast
    },
  })

  if (query.isPending) return <p>Loading…</p>
  if (query.isError) return <p>{query.error.message}</p>
  return <pre>{JSON.stringify(query.data, null, 2)}</pre>
}

// 4) Mutation — PipelineApiError surfaces server messages via toast
export function CreatePersonButton() {
  const mutation = usePipelineMutation({
    mutationFn: async (body: CreatePersonDto) =>
      createPipelinePayload(
        await api.fetchPipeline<number>('/api/People', {
          method: 'POST',
          data: body,
        }),
      ),
  })

  return (
    <button
      type="button"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ firstName: 'Ali', lastName: 'Reza' })}
    >
      Create
    </button>
  )
}

// Errors you can catch manually:
// - PipelineApiError               → envelope.errors
// - InvalidPipelineResponseError   → malformed body
// - NetworkError                   → no response / transport failure
`

export function PipelineClientGuidePage() {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()
  const [manualResult, setManualResult] = useState<string>('')

  const searchQuery = usePipelineQuery({
    queryKey: ['guide', 'pipeline', 'search'],
    queryFn: async ({ signal }) => {
      const result = await fetchPipeline<{ items: unknown[]; page: number }>(
        '/api/People/Search?Page=1&PageSize=3&IncludeTotalCount=true',
        { signal },
      )
      return createPipelinePayload(result)
    },
    enabled: false,
  })

  const invalidMutation = usePipelineMutation({
    mutationFn: async () =>
      createPipelinePayload(
        await fetchPipeline<unknown>('/api/People', {
          method: 'POST',
          data: { firstName: '', lastName: '' },
        }),
      ),
  })

  const secondClientDemo = useMemo(() => {
    const otherHttp = axios.create({ baseURL: 'https://example.invalid' })
    return createPipelineClient(otherHttp)
  }, [])

  const runManualSuccessShape = async () => {
    try {
      const result = await fetchPipeline<unknown>(
        '/api/People/Search?Page=1&PageSize=1&IncludeTotalCount=false',
      )
      setManualResult(
        `OK — page=${String((result.data as { page?: number })?.page ?? '?')}, warnings=${result.warnings.length}`,
      )
    } catch (error) {
      if (error instanceof PipelineApiError) {
        setManualResult(`PipelineApiError: ${error.message}`)
      } else if (error instanceof InvalidPipelineResponseError) {
        setManualResult(`InvalidPipelineResponseError (status ${error.status})`)
      } else if (error instanceof NetworkError) {
        setManualResult('NetworkError')
      } else {
        setManualResult(String(error))
      }
    }
  }

  const runSecondClientNetworkError = async () => {
    try {
      await secondClientDemo.fetchPipeline('/nope')
      setManualResult('unexpected success')
    } catch (error) {
      setManualResult(
        error instanceof NetworkError
          ? 'Second client → NetworkError (expected for invalid host)'
          : String(error),
      )
    }
  }

  return (
    <Page
      title={t('guidePipelineTitle')}
      direction={direction}
      breadcrumbs={packageGuideBreadcrumbs(t, 'pipeline')}
    >
      <Stack spacing={2}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: raccoon.background.elevated, border: `1px solid ${raccoon.border.subtle}` }}>
          <Typography variant="body2" color="text.secondary">
            {t('guidePipelineBody')}
          </Typography>
        </Paper>

        <GuideUsageSection
          description={t('guideUsageDescription')}
          demo={
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  variant="contained"
                  onClick={() => void searchQuery.refetch()}
                  disabled={searchQuery.isFetching}
                >
                  Fetch People search
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={() => invalidMutation.mutate()}
                  disabled={invalidMutation.isPending}
                >
                  POST invalid body
                </Button>
                <Button variant="outlined" onClick={() => void runManualSuccessShape()}>
                  Default client
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => void runSecondClientNetworkError()}
                >
                  Second client (NetworkError)
                </Button>
              </Stack>
              {searchQuery.isSuccess && (
                <Alert severity="success">Loaded via PipelinePayload.</Alert>
              )}
              {searchQuery.isError && (
                <Alert severity="error">{searchQuery.error.message}</Alert>
              )}
              {manualResult && <Alert severity="info">{manualResult}</Alert>}
            </Stack>
          }
          code={PIPELINE_USAGE_CODE}
        />
      </Stack>
    </Page>
  )
}
