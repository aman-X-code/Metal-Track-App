/**
 * Precious Metals Tracker App
 *
 * Main application component with React Navigation and context providers.
 */

import React from 'react';
import { StatusBar, AccessibilityInfo, StyleSheet, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MetalsProvider } from './src/context/MetalsContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/constants/colors';
import { AccessibilityProvider } from './src/context/AccessibilityContext';
import SplashScreen from './src/components/splash/SplashScreen';
import SplashScreenErrorBoundary from './src/components/splash/SplashScreenErrorBoundary';

// We have removed the import for the old `usePerformanceMonitoring` hook.

function App() {
  // The entire `usePerformanceMonitoring` hook and its related state have been removed
  // as they were part of the old, obsolete performance system.

  // Splash screen state management
  const [showSplashScreen, setShowSplashScreen] = React.useState(true);
  const [appState, setAppState] = React.useState<string>(AppState.currentState);
  const isInitialLaunchRef = React.useRef(true);

  // Accessibility state management
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = React.useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = React.useState(false);

  // Initialize accessibility settings
  React.useEffect(() => {
    const checkAccessibilitySettings = async () => {
      try {
        const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();

        setIsScreenReaderEnabled(screenReaderEnabled);
        setIsReduceMotionEnabled(reduceMotionEnabled);
      } catch (error) {
        console.warn('Failed to check accessibility settings:', error);
      }
    };

    checkAccessibilitySettings();

    // Listen for accessibility changes
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled
    );

    return () => {
      screenReaderListener?.remove();
      reduceMotionListener?.remove();
    };
  }, []);

  // Handle app state changes to prevent splash screen on resume from background
  React.useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      const previousState = appState;
      setAppState(nextAppState);
      
      // If app is coming from background to active and this is not the initial launch,
      // skip the splash screen
      if (previousState === 'background' && nextAppState === 'active' && !isInitialLaunchRef.current) {
        console.log('App resumed from background, skipping splash screen');
        setShowSplashScreen(false);
        return;
      }
      
      // Mark that initial launch is complete after app goes to background
      if (nextAppState === 'background') {
        isInitialLaunchRef.current = false;
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Mark initial launch as complete after a delay
    const initialLaunchTimeout = setTimeout(() => {
      isInitialLaunchRef.current = false;
    }, 3000);

    return () => {
      appStateSubscription?.remove();
      clearTimeout(initialLaunchTimeout);
    };
  }, [appState]);

  // The second useEffect for logging performance metrics has also been removed.

  // Handle splash screen completion
  const handleSplashComplete = React.useCallback(() => {
    setShowSplashScreen(false);
  }, []);

  // Handle splash screen errors
  const handleSplashError = React.useCallback(() => {
    console.warn('Splash screen encountered an error, proceeding to main app');
    setShowSplashScreen(false);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background || '#0D0D0D'} // Added a fallback color
          translucent={false}
        />
        <AccessibilityProvider
          isScreenReaderEnabled={isScreenReaderEnabled}
          isReduceMotionEnabled={isReduceMotionEnabled}
        >
          <MetalsProvider>
            {showSplashScreen ? (
              <SplashScreenErrorBoundary
                onError={handleSplashError}
                fallbackTimeout={2000}
              >
                <SplashScreen
                  onAnimationComplete={handleSplashComplete}
                  onError={handleSplashError}
                  isReduceMotionEnabled={isReduceMotionEnabled}
                />
              </SplashScreenErrorBoundary>
            ) : (
              <AppNavigator />
            )}
          </MetalsProvider>
        </AccessibilityProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;