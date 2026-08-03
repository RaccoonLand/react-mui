import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { isRouteErrorResponse, Link as RouterLink, useRouteError } from 'react-router-dom'
import { useLocale } from '../i18n/LocaleProvider'
import { useRaccoonTheme } from '@raccoonland/theme'

export function RouteErrorPage() {
  const error = useRouteError()
  const { t } = useLocale()
  const raccoon = useRaccoonTheme()

  let title = t('routeErrorTitle')
  let message = t('routeErrorMessage')

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`.trim()
    message =
      typeof error.data === 'string' && error.data
        ? error.data
        : t('routeErrorMessage')
  } else if (error instanceof Error && error.message) {
    message = error.message
  }

  return (
    <Stack
      sx={{
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: raccoon.background.default,
        backgroundImage: raccoon.shellGradient,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          maxWidth: 440,
          width: '100%',
          bgcolor: raccoon.background.elevated,
          border: `1px solid ${raccoon.border.subtle}`,
        }}
      >
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <ErrorOutlineIcon color="error" />
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" color="secondary">
            {t('backToDashboard')}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
