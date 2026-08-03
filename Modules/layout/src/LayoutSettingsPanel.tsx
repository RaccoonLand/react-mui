import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import WebAssetOutlinedIcon from '@mui/icons-material/WebAssetOutlined'
import WidthNormalOutlinedIcon from '@mui/icons-material/WidthNormalOutlined'
import {
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useRaccoonTheme, useThemeMode } from '@raccoonland/theme'
import type { ReactNode } from 'react'
import { LAYOUT_MOBILE_BREAKPOINT } from './constants'
import { useLayoutSettings } from './LayoutSettingsContext'
import { useLayoutShell } from './LayoutShellContext'
import type { SidebarOrientation } from './sidebarOrientation'
import type { SidebarVerticalDensity } from './sidebarVerticalDensity'

type OptionCardProps = {
  selected: boolean
  disabled?: boolean
  icon: ReactNode
  title: string
  description: string
  onClick: () => void
}

function OptionCard({ selected, disabled, icon, title, description, onClick }: OptionCardProps) {
  const raccoon = useRaccoonTheme()

  return (
    <Box
      component="button"
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      sx={{
        all: 'unset',
        boxSizing: 'border-box',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        gap: 1.25,
        alignItems: 'flex-start',
        p: 1.5,
        borderRadius: 1.5,
        border: `1px solid ${
          selected
            ? raccoon.nav.activeBorder === 'transparent'
              ? raccoon.primary.main
              : raccoon.nav.activeBorder
            : raccoon.border.subtle
        }`,
        bgcolor: selected ? raccoon.nav.activeBg : raccoon.background.default,
        color: selected ? 'primary.main' : 'text.primary',
        width: '100%',
        transition: (muiTheme) =>
          muiTheme.transitions.create(['background-color', 'border-color'], {
            duration: muiTheme.transitions.duration.shortest,
          }),
        '&:hover': disabled
          ? undefined
          : {
              bgcolor: selected ? raccoon.nav.activeBg : raccoon.nav.activeGroupBg,
            },
      }}
    >
      <Box sx={{ mt: 0.25, color: 'inherit', display: 'grid', placeItems: 'center' }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography fontWeight={700} fontSize={13} color="inherit">
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

/**
 * Presentational layout settings UI. Must render under LayoutSettingsProvider
 * and LayoutShellProvider (typically inside BackofficeLayout).
 */
export function LayoutSettingsPanel() {
  const raccoon = useRaccoonTheme()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down(LAYOUT_MOBILE_BREAKPOINT))
  const { mode, setMode } = useThemeMode()
  const { orientation, setOrientation, density, setDensity } = useLayoutSettings()
  const { labels } = useLayoutShell()

  const densityDisabled = orientation === 'horizontal' || isMobile

  const selectOrientation = (next: SidebarOrientation) => {
    if (next === 'horizontal' && isMobile) {
      return
    }
    setOrientation(next)
  }

  const selectDensity = (next: SidebarVerticalDensity) => {
    if (densityDisabled) {
      return
    }
    setDensity(next)
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 720 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: raccoon.background.elevated,
          border: `1px solid ${raccoon.border.subtle}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {labels.layoutSettingsIntro}
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: raccoon.background.elevated,
          border: `1px solid ${raccoon.border.subtle}`,
        }}
      >
        <Stack spacing={1.5}>
          <Box>
            <Typography fontWeight={700}>{labels.layoutNavOrientation}</Typography>
            <Typography variant="caption" color="text.secondary">
              {labels.layoutNavOrientationHint}
            </Typography>
          </Box>
          <Stack spacing={1}>
            <OptionCard
              selected={orientation === 'vertical'}
              icon={<ViewSidebarOutlinedIcon fontSize="small" />}
              title={labels.layoutVertical}
              description={labels.layoutVerticalDesc}
              onClick={() => selectOrientation('vertical')}
            />
            <OptionCard
              selected={orientation === 'horizontal'}
              disabled={isMobile}
              icon={<WebAssetOutlinedIcon fontSize="small" />}
              title={labels.layoutHorizontal}
              description={
                isMobile ? labels.layoutHorizontalMobileHint : labels.layoutHorizontalDesc
              }
              onClick={() => selectOrientation('horizontal')}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: raccoon.background.elevated,
          border: `1px solid ${raccoon.border.subtle}`,
        }}
      >
        <Stack spacing={1.5}>
          <Box>
            <Typography fontWeight={700}>{labels.layoutNavDensity}</Typography>
            <Typography variant="caption" color="text.secondary">
              {densityDisabled
                ? labels.layoutNavDensityDisabledHint
                : labels.layoutNavDensityHint}
            </Typography>
          </Box>
          <Stack spacing={1}>
            <OptionCard
              selected={density === 'expanded'}
              disabled={densityDisabled}
              icon={<MenuOpenIcon fontSize="small" />}
              title={labels.layoutDensityExpanded}
              description={labels.layoutDensityExpandedDesc}
              onClick={() => selectDensity('expanded')}
            />
            <OptionCard
              selected={density === 'compact'}
              disabled={densityDisabled}
              icon={<WidthNormalOutlinedIcon fontSize="small" />}
              title={labels.layoutDensityCompact}
              description={labels.layoutDensityCompactDesc}
              onClick={() => selectDensity('compact')}
            />
            <OptionCard
              selected={density === 'collapsed'}
              disabled={densityDisabled}
              icon={<MenuIcon fontSize="small" />}
              title={labels.layoutDensityCollapsed}
              description={labels.layoutDensityCollapsedDesc}
              onClick={() => selectDensity('collapsed')}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: raccoon.background.elevated,
          border: `1px solid ${raccoon.border.subtle}`,
        }}
      >
        <Stack spacing={1.5}>
          <Typography fontWeight={700}>{labels.layoutTheme}</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <OptionCard
              selected={mode === 'light'}
              icon={<LightModeOutlinedIcon fontSize="small" />}
              title={labels.themeLight}
              description={labels.layoutThemeLightDesc}
              onClick={() => setMode('light')}
            />
            <OptionCard
              selected={mode === 'dark'}
              icon={<DarkModeOutlinedIcon fontSize="small" />}
              title={labels.themeDark}
              description={labels.layoutThemeDarkDesc}
              onClick={() => setMode('dark')}
            />
          </Stack>
          <Divider />
          <Typography variant="caption" color="text.secondary">
            {labels.layoutSettingsPersistHint}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  )
}
