import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import { Button, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { Page } from '@raccoonland/page'
import { crumbIcons } from '../layout/breadcrumbIcons'
import { useLocale } from '../i18n/LocaleProvider'
import { useRaccoonTheme } from '@raccoonland/theme'

export function NotFoundPage() {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()

  return (
    <Page
      title={t('notFoundTitle')}
      direction={direction}
      breadcrumbs={[
        { label: t('navDashboard'), href: '/', icon: crumbIcons.dashboard },
        { label: t('notFoundTitle'), icon: crumbIcons.notFound },
      ]}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: raccoon.background.elevated,
          border: `1px solid ${raccoon.border.subtle}`,
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <SearchOffOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              {t('notFoundTitle')}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {t('notFoundMessage')}
          </Typography>
          <Stack direction="row">
            <Button component={RouterLink} to="/" variant="contained" color="secondary">
              {t('backToDashboard')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Page>
  )
}
