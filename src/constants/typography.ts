import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const Typography = {
  fontFamily,
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, lineHeight: 22, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  captionBold: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const },
  small: { fontSize: 11, lineHeight: 16, fontWeight: '400' as const },
  button: { fontSize: 16, lineHeight: 20, fontWeight: '600' as const },
} as const;

export type TypographyVariant = keyof Omit<typeof Typography, 'fontFamily'>;
