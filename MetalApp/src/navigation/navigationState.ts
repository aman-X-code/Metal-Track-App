/**
 * Navigation state management to prevent animation glitches
 */

import { useRef, useCallback } from 'react';

interface NavigationStateManager {
  isNavigating: boolean;
  canNavigate: () => boolean;
  setNavigating: (navigating: boolean) => void;
  throttledNavigate: (navigationFn: () => void) => void;
}

// Debounce time to prevent rapid navigation taps
const NAVIGATION_DEBOUNCE_TIME = 300;

export function useNavigationState(): NavigationStateManager {
  const isNavigatingRef = useRef(false);
  const lastNavigationTimeRef = useRef(0);

  const canNavigate = useCallback((): boolean => {
    const now = Date.now();
    const timeSinceLastNavigation = now - lastNavigationTimeRef.current;
    
    return !isNavigatingRef.current && timeSinceLastNavigation > NAVIGATION_DEBOUNCE_TIME;
  }, []);

  const setNavigating = useCallback((navigating: boolean) => {
    isNavigatingRef.current = navigating;
    if (navigating) {
      lastNavigationTimeRef.current = Date.now();
    }
  }, []);

  const throttledNavigate = useCallback((navigationFn: () => void) => {
    if (canNavigate()) {
      setNavigating(true);
      navigationFn();
      
      // Reset navigation state after animation completes
      setTimeout(() => {
        setNavigating(false);
      }, NAVIGATION_DEBOUNCE_TIME);
    }
  }, [canNavigate, setNavigating]);

  return {
    isNavigating: isNavigatingRef.current,
    canNavigate,
    setNavigating,
    throttledNavigate,
  };
}