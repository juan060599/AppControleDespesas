// Design System - Consistent styling across the app
// Mobile-first responsive approach

// Breakpoints for responsive design (mobile-first)
export const breakpoints = {
  xs: 320,      // Extra small - Mobile phones
  sm: 480,      // Small - Larger phones
  md: 768,      // Medium - Tablets
  lg: 1024,     // Large - Desktop
  xl: 1280,     // Extra large - Wide screens
  xxl: 1536,    // Ultra wide - TV screens
}

// Media query helpers
export const mediaQueries = {
  mobile: '@media (max-width: 479px)',
  tablet: '@media (min-width: 480px)',
  tabletUp: '@media (min-width: 768px)',
  desktop: '@media (min-width: 1024px)',
  desktopUp: '@media (min-width: 1024px)',
  wide: '@media (min-width: 1280px)',
}

export const colors = {
  primary: {
    50: '#f0f5ff',
    100: '#e0ebff',
    200: '#c1d7ff',
    300: '#a2c3ff',
    400: '#83afff',
    500: '#3b82f6', // Main
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
  },
  background: {
    light: '#ffffff',
    lighter: '#f9fafb',
    gradient: 'linear-gradient(135deg, #f0f5ff 0%, #ffffff 100%)',
  }
}

export const spacing = {
  xs: 'clamp(2px, 1vw, 4px)',      // Responsive tiny spacing
  sm: 'clamp(6px, 1.5vw, 8px)',    // Responsive small spacing
  md: 'clamp(12px, 2vw, 16px)',    // Responsive medium spacing
  lg: 'clamp(18px, 3vw, 24px)',    // Responsive large spacing
  xl: 'clamp(24px, 4vw, 32px)',    // Responsive extra large spacing
  xxl: 'clamp(32px, 5vw, 48px)',   // Responsive ultra large spacing
}

export const typography = {
  h1: {
    fontSize: 'clamp(28px, 6vw, 36px)',
    fontWeight: 700,
    lineHeight: '1.2',
  },
  h2: {
    fontSize: 'clamp(24px, 5vw, 28px)',
    fontWeight: 700,
    lineHeight: '1.3',
  },
  h3: {
    fontSize: 'clamp(18px, 4vw, 24px)',
    fontWeight: 700,
    lineHeight: '1.4',
  },
  h4: {
    fontSize: 'clamp(16px, 3vw, 20px)',
    fontWeight: 600,
    lineHeight: '1.5',
  },
  body: {
    fontSize: 'clamp(13px, 2vw, 14px)',
    fontWeight: 400,
    lineHeight: '1.6',
  },
  small: {
    fontSize: 'clamp(11px, 1.5vw, 12px)',
    fontWeight: 400,
    lineHeight: '1.5',
  },
  label: {
    fontSize: 'clamp(12px, 1.5vw, 13px)',
    fontWeight: 600,
    lineHeight: '1.5',
  },
}

export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.04)',
  md: '0 10px 24px rgba(0, 0, 0, 0.08)',
  lg: '0 20px 40px rgba(0, 0, 0, 0.12)',
  xl: '0 30px 60px rgba(0, 0, 0, 0.15)',
  blue: '0 8px 24px rgba(59, 130, 246, 0.3)',
}

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '50%',
}

export const transitions = {
  fast: 'all 0.2s ease',
  normal: 'all 0.3s ease',
  slow: 'all 0.5s ease',
}

// Common component styles

export const cardStyle = {
  background: colors.background.light,
  borderRadius: borderRadius.xl,
  boxShadow: shadows.md,
  border: `1px solid ${colors.primary[100]}`,
  padding: spacing.xl,
  transition: transitions.normal,
}

export const buttonPrimaryStyle = {
  background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
  color: colors.background.light,
  border: 'none',
  borderRadius: borderRadius.lg,
  padding: `12px 24px`,
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: transitions.normal,
  boxShadow: shadows.blue,
  ':hover': {
    background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
    boxShadow: shadows.lg,
  }
}

export const inputStyle = {
  width: '100%',
  padding: '12px 16px 12px 44px',
  fontSize: '14px',
  border: `1px solid ${colors.secondary[200]}`,
  borderRadius: borderRadius.lg,
  backgroundColor: colors.background.light,
  fontFamily: 'inherit',
  transition: transitions.normal,
  ':focus': {
    outline: 'none',
    borderColor: colors.primary[500],
    boxShadow: `0 0 0 3px ${colors.primary[50]}`,
  },
  ':hover': {
    borderColor: colors.secondary[300],
  }
}

export const statCardStyle = {
  ...cardStyle,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
  minHeight: '140px',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'hidden',
}
