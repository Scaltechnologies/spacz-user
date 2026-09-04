import { Platform } from 'react-native';

const montserrat = {
  regular: 'Montserrat_400Regular',
  semiBold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
} as const;

const fontFamilyFor = (weight: keyof typeof montserrat) =>
  Platform.select({
    ios: 'System',
    android: montserrat[weight],
    default: montserrat[weight],
  });

const fontFamily = fontFamilyFor('regular');

export const Typography = {
  fontFamily,
  h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const, fontFamily: fontFamilyFor('bold') },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const, fontFamily: fontFamilyFor('bold') },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const, fontFamily: fontFamilyFor('semiBold') },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const, fontFamily: fontFamilyFor('regular') },
  bodyBold: { fontSize: 15, lineHeight: 22, fontWeight: '600' as const, fontFamily: fontFamilyFor('semiBold') },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const, fontFamily: fontFamilyFor('regular') },
  captionBold: { fontSize: 13, lineHeight: 18, fontWeight: '600' as const, fontFamily: fontFamilyFor('semiBold') },
  small: { fontSize: 11, lineHeight: 16, fontWeight: '400' as const, fontFamily: fontFamilyFor('regular') },
  button: { fontSize: 16, lineHeight: 20, fontWeight: '600' as const, fontFamily: fontFamilyFor('semiBold') },
} as const;

export type TypographyVariant = keyof Omit<typeof Typography, 'fontFamily'>;
