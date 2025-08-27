/**
 * Metal symbols, names, and configuration constants
 */

import { MetalData, MetalSymbol } from '../types/metals';

export const METAL_SYMBOLS: Record<string, MetalSymbol> = {
  GOLD: 'XAU',
  SILVER: 'XAG',
  PLATINUM: 'XPT',
  PALLADIUM: 'XPD',
} as const;

export const METAL_NAMES: Record<MetalSymbol, string> = {
  XAU: 'Gold',
  XAG: 'Silver',
  XPT: 'Platinum',
  XPD: 'Palladium',
} as const;

export const METAL_COLORS: Record<MetalSymbol, string> = {
  XAU: '#F7931A', // Bitcoin-inspired gold
  XAG: '#8E9AAF', // Modern silver
  XPT: '#E8E8E8', // Clean platinum
  XPD: '#B8BCC8', // Subtle palladium
} as const;

export const METAL_ICONS: Record<MetalSymbol, string> = {
  XAU: '🥇', // Gold medal emoji as placeholder
  XAG: '🥈', // Silver medal emoji as placeholder
  XPT: '⚪', // White circle for platinum
  XPD: '⚫', // Black circle for palladium
} as const;

export const DEFAULT_METALS: Omit<MetalData, 'price'>[] = [
  {
    id: 'gold',
    name: METAL_NAMES.XAU,
    symbol: METAL_SYMBOLS.GOLD,
    icon: METAL_ICONS.XAU,
    loading: false,
  },
  {
    id: 'silver',
    name: METAL_NAMES.XAG,
    symbol: METAL_SYMBOLS.SILVER,
    icon: METAL_ICONS.XAG,
    loading: false,
  },
  {
    id: 'platinum',
    name: METAL_NAMES.XPT,
    symbol: METAL_SYMBOLS.PLATINUM,
    icon: METAL_ICONS.XPT,
    loading: false,
  },
  {
    id: 'palladium',
    name: METAL_NAMES.XPD,
    symbol: METAL_SYMBOLS.PALLADIUM,
    icon: METAL_ICONS.XPD,
    loading: false,
  },
];

// Mock API Configuration
export const API_CONFIG = {
  CURRENCY: 'INR',
  MOCK_DELAY_MIN: 500,
  MOCK_DELAY_MAX: 1500,
  PRICE_VARIATION: 0.02, // 2% variation for realistic mock data
} as const;

export const REFRESH_INTERVALS = {
  AUTO_REFRESH: 30000, // 30 seconds for demo
  MANUAL_REFRESH_COOLDOWN: 2000, // 2 seconds
} as const;