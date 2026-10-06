import type { TextStyle } from 'react-native';

// Valores muestreados de las pantallas en design/.
export const colors = {
  background: '#061020',
  surface: '#0D1B2E',
  surfaceRaised: '#0C182A',
  input: '#0A1626',
  border: '#182A42',
  borderStrong: '#334862',
  divider: '#1A2A3F',
  tabBar: '#0A1725',

  accent: '#FC1C3C',
  accentPressed: '#D9142F',
  accentSoft: 'rgba(252, 28, 60, 0.12)',

  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDisabled: '#4C5E78',

  chip: '#22395C',
  chipText: '#9FB8DC',

  overlay: 'rgba(2, 6, 16, 0.7)',
  handle: '#475569',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

type Typography = Record<
  'brand' | 'title' | 'display' | 'emptyTitle' | 'section' | 'body' | 'bodyStrong' | 'label' | 'caption' | 'small',
  TextStyle
>;

export const typography: Typography = {
  brand: { fontSize: 22, fontWeight: '800', letterSpacing: 0.5, color: colors.text },
  title: { fontSize: 19, fontWeight: '700', color: colors.text },
  display: { fontSize: 32, fontWeight: '700', color: colors.text },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', lineHeight: 29 },
  section: { fontSize: 14, fontWeight: '700', color: colors.text },
  body: { fontSize: 14, color: colors.text },
  bodyStrong: { fontSize: 14, fontWeight: '600', color: colors.text },
  label: { fontSize: 14, fontWeight: '500', color: colors.text },
  caption: { fontSize: 12, color: colors.textSecondary },
  small: { fontSize: 11, color: colors.textSecondary },
};

/** Cards que cobran en menos de este número de días llevan el indicador rojo. */
export const URGENT_DAYS = 3;
