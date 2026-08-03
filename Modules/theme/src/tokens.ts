export type ThemeMode = 'light' | 'dark'

export type RaccoonTokens = {
  primary: {
    main: string
    light: string
    dark: string
    contrastText: string
  }
  secondary: {
    main: string
    light: string
    dark: string
    contrastText: string
  }
  background: {
    default: string
    paper: string
    elevated: string
    header: string
  }
  text: {
    primary: string
    secondary: string
    disabled: string
  }
  divider: string
  border: {
    glow: string
    subtle: string
  }
  input: {
    bg: string
    border: string
    borderHover: string
    borderFocus: string
  }
  error: { main: string }
  success: { main: string }
  overlay: string
  shellGradient: string
  nav: {
    activeBg: string
    activeGroupBg: string
    activeBorder: string
    activeIndicatorWidth: number
  }
}

const brandPrimary = {
  main: '#9b4dff',
  light: '#b47aff',
  dark: '#7c3aed',
  contrastText: '#ffffff',
} as const

const brandSecondary = {
  dark: {
    main: '#7a8494',
    light: '#9aa3b2',
    dark: '#5c6573',
    contrastText: '#ffffff',
  },
  light: {
    main: '#5c6370',
    light: '#8b93a1',
    dark: '#434954',
    contrastText: '#ffffff',
  },
} as const

export const darkTokens: RaccoonTokens = {
  primary: brandPrimary,
  secondary: brandSecondary.dark,
  background: {
    default: '#0a0a0f',
    paper: '#121218',
    elevated: '#1a1a24',
    header: 'rgba(18, 18, 24, 0.92)',
  },
  text: {
    primary: '#f0f0f5',
    secondary: '#8b8b9e',
    disabled: '#5c5c6f',
  },
  divider: 'rgba(155, 77, 255, 0.12)',
  border: {
    glow: 'rgba(155, 77, 255, 0.25)',
    subtle: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    bg: '#1e1e2a',
    border: 'rgba(255, 255, 255, 0.2)',
    borderHover: 'rgba(255, 255, 255, 0.32)',
    borderFocus: '#9b4dff',
  },
  error: { main: '#ef4444' },
  success: { main: '#22c55e' },
  overlay: 'rgba(10, 10, 15, 0.72)',
  shellGradient: `
    radial-gradient(ellipse at 10% 0%, rgba(155, 77, 255, 0.08) 0%, transparent 45%),
    radial-gradient(ellipse at 90% 100%, rgba(124, 58, 237, 0.06) 0%, transparent 40%)
  `,
  nav: {
    activeBg: 'rgba(155, 77, 255, 0.14)',
    activeGroupBg: 'rgba(255, 255, 255, 0.04)',
    activeBorder: 'transparent',
    activeIndicatorWidth: 3,
  },
}

export const lightTokens: RaccoonTokens = {
  primary: brandPrimary,
  secondary: brandSecondary.light,
  background: {
    default: '#e4e6ed',
    paper: '#eceef4',
    elevated: '#f2f4f8',
    header: 'rgba(236, 238, 244, 0.95)',
  },
  text: {
    primary: '#12121a',
    secondary: '#4b4b5c',
    disabled: '#7a7a8c',
  },
  divider: 'rgba(155, 77, 255, 0.16)',
  border: {
    glow: 'rgba(155, 77, 255, 0.24)',
    subtle: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    bg: '#ffffff',
    border: 'rgba(0, 0, 0, 0.18)',
    borderHover: 'rgba(0, 0, 0, 0.32)',
    borderFocus: '#7c3aed',
  },
  error: { main: '#ef4444' },
  success: { main: '#16a34a' },
  overlay: 'rgba(228, 230, 237, 0.75)',
  shellGradient: `
    radial-gradient(ellipse at 10% 0%, rgba(155, 77, 255, 0.07) 0%, transparent 45%),
    radial-gradient(ellipse at 90% 100%, rgba(124, 58, 237, 0.05) 0%, transparent 40%)
  `,
  nav: {
    activeBg: 'rgba(124, 58, 237, 0.14)',
    activeGroupBg: 'rgba(0, 0, 0, 0.04)',
    activeBorder: 'rgba(124, 58, 237, 0.22)',
    activeIndicatorWidth: 4,
  },
}

export function getRaccoonTokens(mode: ThemeMode): RaccoonTokens {
  return mode === 'light' ? lightTokens : darkTokens
}
