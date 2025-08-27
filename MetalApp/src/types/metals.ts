/**
 * Core type definitions for the Precious Metals Tracker app.
 * Final version with 24k price support.
 */

// From the API: Defines the detailed price data for a metal
export interface MetalPrice {
  metal: 'XAU' | 'XAG' | 'XPT' | 'XPD';
  currency: 'INR';
  price: number; // Price per troy ounce
  price_gram_24k: number; // Price per gram, 24k
  timestamp: string;
  prev_close_price: number;
  open_price: number;
  low_price: number;
  high_price: number;
  ch: number; // Change
  chp: number; // Change percentage
}

// For the charts: A single point in a historical data series
export interface HistoricalDataPoint {
  date: string;
  price: number;
}

// In the App State: The complete data model for a single metal
export interface MetalData {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  loading: boolean;
  price?: MetalPrice;
  error?: string;
  historicalData?: {
    '24h'?: HistoricalDataPoint[];
    'Week'?: HistoricalDataPoint[];
    'Month'?: HistoricalDataPoint[];
  };
}

// The shape of our entire global state in the context
export interface AppState {
  metals: MetalData[];
  lastUpdated: string | null;
  refreshing: boolean;
}

export type MetalSymbol = 'XAU' | 'XAG' | 'XPT' | 'XPD';
export type Timeframe = '24h' | 'Week' | 'Month';

// Defines the functions and state available from the `useMetals` hook
export interface MetalsContextType {
  state: AppState;
  refreshPrices: () => Promise<void>;
  fetchHistoricalData: (metalId: string, timeframe: Timeframe) => Promise<void>;
  getMetalById: (id: string) => MetalData | undefined;
}

// All possible actions that can be dispatched to the reducer
export type MetalsAction =
  | { type: 'SET_LOADING'; payload: { metalId: string; loading: boolean } }
  | { type: 'SET_PRICE_SUCCESS'; payload: { metalId: string; price: MetalPrice } }
  | { type: 'SET_ERROR'; payload: { metalId: string; error: string } }
  | { type: 'SET_HISTORICAL_DATA'; payload: { metalId: string; timeframe: Timeframe; data: HistoricalDataPoint[] } }
  | { type: 'SET_REFRESHING'; payload: boolean };
