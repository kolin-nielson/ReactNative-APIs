import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SIZES = {
  base: 8,
  font: 14,
  radius: 10,
  padding: 16,
  padding2: 24,
  largeTitle: 40,
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 16,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
  width,
  height,
};

export const FONTS = {
  largeTitle: { fontSize: SIZES.largeTitle, lineHeight: 55 },
  h1: { fontSize: SIZES.h1, lineHeight: 36, fontWeight: 'bold' as const },
  h2: { fontSize: SIZES.h2, lineHeight: 30, fontWeight: 'bold' as const },
  h3: { fontSize: SIZES.h3, lineHeight: 28, fontWeight: 'bold' as const },
  h4: { fontSize: SIZES.h4, lineHeight: 22, fontWeight: '600' as const },
  body1: { fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontSize: SIZES.body4, lineHeight: 20 },
  body5: { fontSize: SIZES.body5, lineHeight: 18 },
};

export const lightColors = {
  primary: '#0d6efd',
  secondary: '#6c757d',
  background: '#f1f3f5',
  white: '#ffffff',
  black: '#000000',
  gray: '#adb5bd',
  lightGray: '#dee2e6',
  lightGray2: '#e9ecef',
  darkGray: '#343a40',
  success: '#198754',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#0dcaf0',
  textPrimary: '#212529',
  textSecondary: '#6c757d',
  textLight: '#f8f9fa',
};

export const darkColors = {
  primary: '#4dabf7',
  secondary: '#adb5bd',
  background: '#18191a',
  white: '#ffffff',
  black: '#000000',
  gray: '#6c757d',
  lightGray: '#495057',
  lightGray2: '#343a40',
  darkGray: '#f1f3f5',
  success: '#20c997',
  danger: '#fa5252',
  warning: '#ffc107',
  info: '#3bc9db',
  textPrimary: '#f8f9fa',
  textSecondary: '#adb5bd',
  textLight: '#212529',
};

export const COLORS = lightColors;

const appTheme = { COLORS, SIZES, FONTS };
export default appTheme; 