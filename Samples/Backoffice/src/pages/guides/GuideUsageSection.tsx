import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { useRaccoonTheme } from '@raccoonland/theme'
import { useState, type ReactNode } from 'react'
import { useLocale } from '../../i18n/LocaleProvider'

type GuideUsageSectionProps = {
  /** Section heading, e.g. "Usage" */
  title?: string
  /** Short description above the code */
  description?: string
  /** Full copy-pasteable example */
  code: string
  /** Optional live demo rendered above the code (MUI docs pattern) */
  demo?: ReactNode
}

export function GuideUsageSection({
  title,
  description,
  code,
  demo,
}: GuideUsageSectionProps) {
  const { t } = useLocale()
  const raccoon = useRaccoonTheme()
  const [copied, setCopied] = useState(false)

  const heading = title ?? t('guideUsageTitle')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: raccoon.background.elevated,
        border: `1px solid ${raccoon.border.subtle}`,
      }}
    >
      <Stack spacing={1.5}>
        <Typography fontWeight={700}>{heading}</Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}

        {demo && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              border: `1px solid ${raccoon.border.subtle}`,
              bgcolor: raccoon.background.default,
            }}
          >
            {demo}
          </Box>
        )}

        <Box sx={{ position: 'relative' }}>
          <Tooltip title={copied ? t('guideCodeCopied') : t('guideCodeCopy')}>
            <IconButton
              size="small"
              onClick={() => void handleCopy()}
              aria-label={t('guideCodeCopy')}
              sx={{
                position: 'absolute',
                top: 8,
                insetInlineEnd: 8,
                zIndex: 1,
                bgcolor: raccoon.background.elevated,
                border: `1px solid ${raccoon.border.subtle}`,
                '&:hover': { bgcolor: raccoon.background.elevated },
              }}
            >
              <ContentCopyOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box
            component="pre"
            dir="ltr"
            sx={{
              m: 0,
              p: 2,
              pe: 6,
              overflow: 'auto',
              borderRadius: 1,
              bgcolor: raccoon.background.default,
              border: `1px solid ${raccoon.border.subtle}`,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '0.8125rem',
              lineHeight: 1.55,
              color: 'text.primary',
              whiteSpace: 'pre',
            }}
          >
            <code>{code}</code>
          </Box>
        </Box>
      </Stack>
    </Paper>
  )
}
