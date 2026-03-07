export const colors = {
  // Core
  background: '#FAF7F2',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F0E8',
  surfaceBorder: 'rgba(45, 42, 38, 0.08)',

  // Accent
  gold: '#C4704B',
  goldMuted: 'rgba(196, 112, 75, 0.6)',
  goldSubtle: 'rgba(196, 112, 75, 0.08)',

  // Secondary
  sage: '#7B9E87',
  sageMuted: 'rgba(123, 158, 135, 0.15)',

  // Text
  textPrimary: '#2D2A26',
  textSecondary: '#7A756E',
  textMuted: '#B5AFA6',

  // Semantic
  success: '#7B9E87',
  error: '#C4554B',
  warning: '#D4A574',

  // Overlays
  overlay: 'rgba(45, 42, 38, 0.3)',
  divider: 'rgba(45, 42, 38, 0.06)',

  // Warm shadow (used as shadowColor)
  shadow: '#8B7355',
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
    fontWeight: '600' as const,
    letterSpacing: -0.5,
    color: '#2D2A26',
  },
  displayMedium: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    color: '#2D2A26',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    color: '#2D2A26',
  },
  subheading: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    color: '#7A756E',
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    color: '#7A756E',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    color: '#B5AFA6',
  },
  price: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    color: '#C4704B',
  },
};

export const cardShadow = {
  shadowColor: '#8B7355',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};
