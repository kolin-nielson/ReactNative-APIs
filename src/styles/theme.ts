import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Define common sizes and fonts first
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

// Define Color Palettes
export const lightColors = {
  primary: '#0d6efd',
  secondary: '#6c757d',
  background: '#f1f3f5',
  white: '#ffffff',
  black: '#000000',
  gray: '#adb5bd',
  lightGray: '#dee2e6',
  lightGray2: '#e9ecef', // Add another light gray for subtle backgrounds
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
  primary: '#4dabf7', // Lighter primary for dark mode
  secondary: '#adb5bd', // Lighter gray
  background: '#18191a', // Very dark gray/off-black
  white: '#ffffff',
  black: '#000000',
  gray: '#6c757d', // Medium gray
  lightGray: '#495057', // Darker gray for borders
  lightGray2: '#343a40', // Darker gray for subtle backgrounds
  darkGray: '#f1f3f5', // Light gray for contrast elements
  success: '#20c997',
  danger: '#fa5252',
  warning: '#ffc107',
  info: '#3bc9db',
  textPrimary: '#f8f9fa', // Light text
  textSecondary: '#adb5bd', // Lighter gray text
  textLight: '#212529', // Dark text for light backgrounds (if needed)
};

// Export COLORS initially pointing to lightColors (or based on system preference later)
// We will override this with context
export const COLORS = lightColors;

// Consolidate theme export if needed, but context will handle dynamic theme
const appTheme = { COLORS, SIZES, FONTS };
export default appTheme; 