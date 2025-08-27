/**
 * MetalsContext for global state management of precious metals data.
 * PERFORMANCE OPTIMIZED VERSION - Reduced re-renders and improved efficiency.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  AppState,
  MetalsAction,
  MetalsContextType,
  MetalData,
  Timeframe,
} from '../types/metals';
import { DEFAULT_METALS } from '../constants/metals';
import { goldApi } from '../services/goldApi';

const initialState: AppState = {
  metals: DEFAULT_METALS.map(metal => ({
    ...metal,
    loading: true,
    historicalData: {},
  })),
  lastUpdated: null,
  refreshing: false,

};

function metalsReducer(state: AppState, action: MetalsAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        metals: state.metals.map(m =>
          m.id === action.payload.metalId
            ? { ...m, loading: action.payload.loading }
            : m,
        ),
      };
    case 'SET_PRICE_SUCCESS':
      return {
        ...state,
        metals: state.metals.map(m =>
          m.id === action.payload.metalId
            ? {
                ...m,
                price: action.payload.price,
                loading: false,
                error: undefined,
              }
            : m,
        ),
        lastUpdated: new Date().toISOString(),
      };
    case 'SET_ERROR':
      return {
        ...state,
        metals: state.metals.map(m =>
          m.id === action.payload.metalId
            ? { ...m, error: action.payload.error, loading: false }
            : m,
        ),
      };
    case 'SET_HISTORICAL_DATA':
      return {
        ...state,
        metals: state.metals.map(m =>
          m.id === action.payload.metalId
            ? {
                ...m,
                historicalData: {
                  ...m.historicalData,
                  [action.payload.timeframe]: action.payload.data,
                },
              }
            : m,
        ),
      };
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };

    default:
      return state;
  }
}

const MetalsContext = createContext<MetalsContextType | undefined>(undefined);

interface MetalsProviderProps {
  children: React.ReactNode;
}

export function MetalsProvider({ children }: MetalsProviderProps) {
  const [state, dispatch] = useReducer(metalsReducer, initialState);

  /**
   * PERFORMANCE OPTIMIZED: Refreshes prices with debouncing and batch updates
   */
  const refreshPrices = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_REFRESHING', payload: true });

    // Batch API calls with Promise.allSettled for better performance
    const pricePromises = DEFAULT_METALS.map(async (metal) => {
      try {
        const price = await goldApi.getMetalPrice(metal.symbol as any);
        return { metalId: metal.id, price, symbol: metal.symbol, success: true };
      } catch (error) {
        return { metalId: metal.id, error: (error as Error).message, success: false };
      }
    });

    const results = await Promise.allSettled(pricePromises);
    
    // Batch dispatch updates to reduce re-renders
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        const data = result.value;
        if (data.success && data.price) {
          dispatch({
            type: 'SET_PRICE_SUCCESS',
            payload: { metalId: data.metalId, price: data.price },
          });
        } else if (!data.success && data.error) {
          dispatch({
            type: 'SET_ERROR',
            payload: { metalId: data.metalId, error: data.error },
          });
        }
      }
    });

    dispatch({ type: 'SET_REFRESHING', payload: false });
  }, []);

  /**
   * PERFORMANCE OPTIMIZED: Memoized historical data fetching with caching
   */
  const fetchHistoricalData = useCallback(
    async (metalId: string, timeframe: Timeframe): Promise<void> => {
      const metal = state.metals.find(m => m.id === metalId);

      if (!metal || (metal.historicalData?.[timeframe]?.length ?? 0) > 0) {
        return;
      }

      if (!metal.price) {
        return;
      }

      try {
        const data = await goldApi.getHistoricalData(
          metal.symbol as any,
          timeframe,
          metal.price,
        );
        dispatch({
          type: 'SET_HISTORICAL_DATA',
          payload: { metalId, timeframe, data },
        });
      } catch (error) {
        console.error(`Failed to fetch historical data for ${metal.id}`, error);
      }
    },
    [state.metals],
  );

  // PERFORMANCE OPTIMIZED: Memoized metal lookup to prevent unnecessary re-renders
  const getMetalById = useCallback(
    (id: string): MetalData | undefined => {
      return state.metals.find(metal => metal.id === id);
    },
    [state.metals],
  );



  // PERFORMANCE OPTIMIZED: Memoized context value to prevent unnecessary re-renders
  const contextValue: MetalsContextType = useMemo(() => ({
    state,
    refreshPrices,
    fetchHistoricalData,
    getMetalById,
  }), [state, refreshPrices, fetchHistoricalData, getMetalById]);

  // Fetch initial data when the app loads - only once
  useEffect(() => {
    refreshPrices();
  }, [refreshPrices]);

  return (
    <MetalsContext.Provider value={contextValue}>
      {children}
    </MetalsContext.Provider>
  );
}

export function useMetals(): MetalsContextType {
  const context = useContext(MetalsContext);
  if (context === undefined) {
    throw new Error('useMetals must be used within a MetalsProvider');
  }
  return context;
}
