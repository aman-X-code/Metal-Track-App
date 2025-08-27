/**
 * Color constants for the app
 */

export const colors = {
  background: '#0D0D0D',
  surface: 'rgba(28, 28, 30, 0.8)',
  primary: '#4CFFB2',
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0A0',
    muted: '#666666',
  },
  error: '#FF6B6B',
  success: '#4CFFB2',
  warning: '#FFB84D',
  border: 'rgba(255, 255, 255, 0.2)',
} as const;

export const getMetalColor = (symbol: string): string => {
  switch (symbol) {
    case 'XAU': return '#FFD700';
    case 'XAG': return '#C0C0C0';
    case 'XPT': return '#E5E4E2';
    case 'XPD': return '#CED0DD';
    default: return colors.primary;
  }
};

export const getPriceChangeColor = (change: number): string => {
  return change >= 0 ? colors.success : colors.error;
};