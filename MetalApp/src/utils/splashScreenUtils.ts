/**
 * Splash Screen Utilities
 * 
 * Utility functions for handling splash screen error scenarios,
 * timeout management, and app state tracking.
 */

import { AppState, AppStateStatus } from 'react-native';

export interface SplashScreenConfig {
  minimumDisplayTime: number;
  maximumDisplayTime: number;
  errorFallbackTime: number;
  backgroundResumeSkip: boolean;
}

export const DEFAULT_SPLASH_CONFIG: SplashScreenConfig = {
  minimumDisplayTime: 1500,  // 1.5 seconds minimum
  maximumDisplayTime: 5000,  // 5 seconds maximum
  errorFallbackTime: 2000,   // 2 seconds for error fallback
  backgroundResumeSkip: true, // Skip splash on background resume
};

/**
 * Creates a timeout manager for splash screen with automatic cleanup
 */
export class SplashTimeoutManager {
  private timeouts: Set<ReturnType<typeof setTimeout>> = new Set();
  private startTime: number = Date.now();

  constructor(private config: SplashScreenConfig = DEFAULT_SPLASH_CONFIG) {}

  /**
   * Creates a timeout that automatically cleans up
   */
  createTimeout(callback: () => void, delay: number): ReturnType<typeof setTimeout> {
    const timeout = setTimeout(() => {
      this.timeouts.delete(timeout);
      callback();
    }, delay);
    
    this.timeouts.add(timeout);
    return timeout;
  }

  /**
   * Creates the maximum timeout protection
   */
  createMaxTimeout(callback: () => void): ReturnType<typeof setTimeout> {
    return this.createTimeout(() => {
      console.warn('Splash screen maximum timeout reached, forcing completion');
      callback();
    }, this.config.maximumDisplayTime);
  }

  /**
   * Creates an error fallback timeout
   */
  createErrorTimeout(callback: () => void): ReturnType<typeof setTimeout> {
    return this.createTimeout(() => {
      console.warn('Splash screen error timeout reached, proceeding to main app');
      callback();
    }, this.config.errorFallbackTime);
  }

  /**
   * Calculates remaining minimum display time
   */
  getRemainingMinTime(): number {
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.config.minimumDisplayTime - elapsed);
  }

  /**
   * Calculates remaining maximum display time
   */
  getRemainingMaxTime(): number {
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.config.maximumDisplayTime - elapsed);
  }

  /**
   * Clears all managed timeouts
   */
  cleanup(): void {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

/**
 * Manages app state tracking for splash screen behavior
 */
export class AppStateManager {
  private currentState: AppStateStatus = AppState.currentState;
  private isInitialLaunch: boolean = true;
  private subscription: any = null;

  constructor(private onStateChange?: (state: AppStateStatus, isInitialLaunch: boolean) => void) {
    this.startListening();
  }

  private startListening(): void {
    this.subscription = AppState.addEventListener('change', this.handleAppStateChange);
    
    // Mark initial launch as complete after a delay
    setTimeout(() => {
      this.isInitialLaunch = false;
    }, 3000);
  }

  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    const previousState = this.currentState;
    this.currentState = nextAppState;
    
    // Mark initial launch as complete when app goes to background
    if (nextAppState === 'background') {
      this.isInitialLaunch = false;
    }
    
    // Notify callback if provided
    if (this.onStateChange) {
      this.onStateChange(nextAppState, this.isInitialLaunch);
    }
    
    // Log state changes for debugging
    console.log(`App state changed: ${previousState} -> ${nextAppState}, isInitialLaunch: ${this.isInitialLaunch}`);
  };

  /**
   * Checks if splash screen should be skipped based on app state
   */
  shouldSkipSplash(): boolean {
    return !this.isInitialLaunch && this.currentState === 'active';
  }

  /**
   * Gets current app state
   */
  getCurrentState(): AppStateStatus {
    return this.currentState;
  }

  /**
   * Checks if this is the initial app launch
   */
  getIsInitialLaunch(): boolean {
    return this.isInitialLaunch;
  }

  /**
   * Manually mark initial launch as complete
   */
  markInitialLaunchComplete(): void {
    this.isInitialLaunch = false;
  }

  /**
   * Cleanup the app state listener
   */
  cleanup(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }
}

/**
 * Error handler for splash screen failures
 */
export const handleSplashError = (error: Error, fallbackCallback: () => void): void => {
  console.error('Splash screen error:', error);
  
  // Log error details for debugging
  console.error('Error stack:', error.stack);
  console.error('Error message:', error.message);
  
  // Call fallback after a short delay to allow for error logging
  setTimeout(() => {
    console.warn('Executing splash screen error fallback');
    fallbackCallback();
  }, 100);
};

/**
 * Validates animation values to prevent crashes
 */
export const validateAnimationValue = (value: any): boolean => {
  return value && typeof value._value === 'number' && !isNaN(value._value);
};

/**
 * Safe animation starter with error handling
 */
export const safeStartAnimation = (
  animation: any,
  onComplete?: (finished: boolean) => void,
  onError?: (error: Error) => void
): void => {
  try {
    animation.start((finished: boolean) => {
      if (onComplete) {
        onComplete(finished);
      }
    });
  } catch (error) {
    console.error('Animation start error:', error);
    if (onError) {
      onError(error as Error);
    } else if (onComplete) {
      // Call completion with finished = false to indicate error
      onComplete(false);
    }
  }
};