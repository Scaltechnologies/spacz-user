export const Colors = {
  primary: '#1976ED',
  primaryDark: '#123B6D',
  primaryLight: '#E8F1FD',

  background: '#FFFFFF',
  surface: '#F6F7F9',
  surfaceAlt: '#EEF1F5',

  text: '#1A1D1F',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  divider: '#EDEFF2',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  overlay: 'rgba(17, 24, 39, 0.5)',

  seatAvailable: '#FFFFFF',
  seatOccupied: '#F3D9DC',
  seatSelected: '#1976ED',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorName = keyof typeof Colors;
