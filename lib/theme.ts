/**
 * Design System Theme Tokens
 *
 * These constants mirror the Tailwind CSS v4 @theme configuration
 * in app/globals.css to ensure consistency when CSS utility classes
 * cannot be used (e.g., in canvas, charts, or JS-based animations).
 */

export const THEME = {
  colors: {
    background: '#FAFAF9',
    surface: '#FFFFFF',
    borderSubtle: '#F5F5F4',
    primary: {
      DEFAULT: '#A85238',
      hover: '#8F4530',
      active: '#763A28',
    },
    text: {
      main: '#1C1917',
      muted: '#78716C',
    },
    border: '#E7E5E4',
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  }
} as const;

export type ThemeColors = typeof THEME.colors;
