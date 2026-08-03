import { Paper, Typography } from '@mui/material'
import { Page } from '@raccoonland/page'
import { useRaccoonTheme } from '@raccoonland/theme'
import { useLocale } from '../i18n/LocaleProvider'
import type { MessageKey } from '../i18n/messages'

type PlaceholderPageProps = {
  titleKey: MessageKey
  breadcrumbKeys: MessageKey[]
  breadcrumbHrefs?: (string | undefined)[]
}

export function PlaceholderPage({
  titleKey,
  breadcrumbKeys,
  breadcrumbHrefs = [],
}: PlaceholderPageProps) {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()

  const breadcrumbs = breadcrumbKeys.map((key, index) => ({
    label: t(key),
    href: breadcrumbHrefs[index],
  }))

  return (
    <Page title={t(titleKey)} breadcrumbs={breadcrumbs} direction={direction}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: raccoon.background.elevated,
          border: `1px solid ${raccoon.border.subtle}`,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {t('placeholderBody')}
        </Typography>
      </Paper>
    </Page>
  )
}
