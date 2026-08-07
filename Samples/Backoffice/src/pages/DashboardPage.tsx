import ApiOutlinedIcon from '@mui/icons-material/ApiOutlined'
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import DynamicFormOutlinedIcon from '@mui/icons-material/DynamicFormOutlined'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import WebAssetOutlinedIcon from '@mui/icons-material/WebAssetOutlined'
import { Button, Grid, Paper, Stack, Typography } from '@mui/material'
import { Page } from '@raccoonland/page'
import { useRaccoonTheme } from '@raccoonland/theme'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { crumbIcons } from '../layout/breadcrumbIcons'
import { useLocale } from '../i18n/LocaleProvider'

function PackageCard({
  title,
  description,
  to,
  icon,
}: {
  title: string
  description: string
  to: string
  icon: ReactNode
}) {
  const raccoon = useRaccoonTheme()

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        bgcolor: raccoon.background.elevated,
        border: `1px solid ${raccoon.border.subtle}`,
      }}
    >
      <Stack spacing={1.5} sx={{ height: '100%' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'primary.main' }}>
          {icon}
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          {description}
        </Typography>
        <Button component={RouterLink} to={to} variant="outlined" size="small" sx={{ alignSelf: 'start' }}>
          Open guide
        </Button>
      </Stack>
    </Paper>
  )
}

export function DashboardPage() {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()

  return (
    <Page
      title={t('navDashboard')}
      direction={direction}
      breadcrumbs={[{ label: t('navDashboard'), icon: crumbIcons.dashboard }]}
    >
      <Stack spacing={2}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: raccoon.background.elevated,
            border: `1px solid ${raccoon.border.glow}`,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {t('dashboardWelcome')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('dashboardPackagesIntro')}
          </Typography>
        </Paper>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <PackageCard
              title="@raccoonland/pipeline-client"
              description={t('guidePipelineBlurb')}
              to="/packages/pipeline-client"
              icon={<ApiOutlinedIcon fontSize="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <PackageCard
              title="@raccoonland/theme"
              description={t('guideThemeBlurb')}
              to="/packages/theme"
              icon={<PaletteOutlinedIcon fontSize="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <PackageCard
              title="@raccoonland/feedback"
              description={t('guideFeedbackBlurb')}
              to="/packages/feedback"
              icon={<WidgetsOutlinedIcon fontSize="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <PackageCard
              title="@raccoonland/form-kit"
              description={t('guideFormKitBlurb')}
              to="/packages/form-kit"
              icon={<DynamicFormOutlinedIcon fontSize="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <PackageCard
              title="@raccoonland/page"
              description={t('guidePageBlurb')}
              to="/packages/page"
              icon={<WebAssetOutlinedIcon fontSize="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <PackageCard
              title="@raccoonland/data-table"
              description={t('guideDataTableBlurb')}
              to="/packages/data-table"
              icon={<TableChartOutlinedIcon fontSize="small" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <PackageCard
              title="@raccoonland/layout"
              description={t('guideLayoutBlurb')}
              to="/packages/layout"
              icon={<ViewSidebarOutlinedIcon fontSize="small" />}
            />
          </Grid>
        </Grid>
      </Stack>
    </Page>
  )
}
