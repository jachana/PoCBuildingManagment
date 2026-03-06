export const colors = {
  // Core
  background: '#0C0C0C',
  surface: '#161616',
  surfaceElevated: '#1E1E1E',
  surfaceBorder: 'rgba(201, 169, 110, 0.12)',

  // Accent
  gold: '#C9A96E',
  goldMuted: 'rgba(201, 169, 110, 0.5)',
  goldSubtle: 'rgba(201, 169, 110, 0.08)',

  // Text
  textPrimary: '#F0EBE3',
  textSecondary: '#9B9590',
  textMuted: '#5E5A56',

  // Semantic
  success: '#7BA68C',
  error: '#D4553A',
  warning: '#C9A96E',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  divider: 'rgba(201, 169, 110, 0.1)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  displayLarge: {
    fontSize: 32,
    fontWeight: '200' as const,
    letterSpacing: 2,
    color: colors.textPrimary,
  },
  displayMedium: {
    fontSize: 24,
    fontWeight: '300' as const,
    letterSpacing: 1.5,
    color: colors.textPrimary,
  },
  heading: {
    fontSize: 18,
    fontWeight: '400' as const,
    letterSpacing: 0.8,
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: colors.gold,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  price: {
    fontSize: 18,
    fontWeight: '300' as const,
    letterSpacing: 0.5,
    color: colors.gold,
  },
};
