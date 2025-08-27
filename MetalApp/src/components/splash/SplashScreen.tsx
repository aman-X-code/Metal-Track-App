/**
 * SplashScreen Component
 *
 * Displays a professional splash screen with app branding while the app initializes.
 * Includes smooth animations and respects accessibility settings for reduced motion.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useAccessibility } from '../../context/AccessibilityContext';
import { colors } from '../../constants/colors';

// Animation configuration for professional timing
const ANIMATION_CONFIG = {
  logoFadeInDuration: 800, // Logo fade-in duration
  titleFadeInDuration: 600, // Title fade-in duration
  titleFadeInDelay: 400, // Stagger delay for title
  fadeOutDuration: 500, // Fade-out duration
  minimumDisplayTime: 1500, // Minimum total display time (1.5 seconds)
  maximumDisplayTime: 5000, // Maximum total display time (5 seconds)
  reducedMotionDuration: 100, // Duration for reduced motion animations
} as const;

export interface SplashScreenProps {
  onAnimationComplete: () => void;
  isReduceMotionEnabled?: boolean;
  onError?: () => void;
}

interface SplashScreenState {
  logoOpacity: Animated.Value;
  titleOpacity: Animated.Value;
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
  isReduceMotionEnabled: propReduceMotion,
  onError,
}) => {
  const { isReduceMotionEnabled: contextReduceMotion } = useAccessibility();
  const isReduceMotionEnabled = propReduceMotion ?? contextReduceMotion;

  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  // Timing control refs
  const startTimeRef = useRef<number>(0);
  const maxTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const hasCompletedRef = useRef<boolean>(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    // Handle app state changes to prevent splash screen on resume from background
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextAppState;

      // If app is coming from background to active and this is not the initial load,
      // immediately complete the splash screen to prevent showing it again
      if (
        previousState === 'background' &&
        nextAppState === 'active' &&
        !isInitialLoadRef.current
      ) {
        console.log('App resumed from background, skipping splash screen');
        completeTransition();
        return;
      }

      // If app goes to background during splash screen, mark as no longer initial load
      if (nextAppState === 'background') {
        isInitialLoadRef.current = false;
      }
    };

    // Add app state listener
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Record start time for timing calculations
    startTimeRef.current = Date.now();

    // Set maximum timeout protection to prevent infinite loading
    maxTimeoutRef.current = setTimeout(() => {
      if (!hasCompletedRef.current) {
        console.warn(
          'Splash screen reached maximum timeout, forcing transition',
        );
        completeTransition();
      }
    }, ANIMATION_CONFIG.maximumDisplayTime);

    // Start animations when component mounts (with error handling)
    try {
      startAnimations();
    } catch (error) {
      console.error('Error starting splash screen animations:', error);
      // If animation fails, proceed to main app after a short delay
      setTimeout(() => {
        if (onError) {
          onError();
        } else {
          completeTransition();
        }
      }, 1000);
    }

    // Mark that initial load is complete after a short delay
    const initialLoadTimeout = setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 2000);

    // Cleanup function to clear timeouts and listeners
    return () => {
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      clearTimeout(initialLoadTimeout);
      appStateSubscription?.remove();
    };
  }, [onError]);

  const completeTransition = () => {
    // Prevent multiple completion calls
    if (hasCompletedRef.current) {
      return;
    }
    hasCompletedRef.current = true;

    // Clear any pending timeouts
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Call the completion callback
    onAnimationComplete();
  };

  const scheduleCompletion = () => {
    const elapsedTime = Date.now() - startTimeRef.current;
    const remainingMinTime = Math.max(
      0,
      ANIMATION_CONFIG.minimumDisplayTime - elapsedTime,
    );
    const remainingMaxTime = Math.max(
      0,
      ANIMATION_CONFIG.maximumDisplayTime - elapsedTime,
    );

    // Use the minimum of remaining minimum time and remaining maximum time
    const waitTime = Math.min(remainingMinTime, remainingMaxTime);

    animationTimeoutRef.current = setTimeout(() => {
      fadeOutAndComplete();
    }, waitTime);
  };

  const startAnimations = () => {
    try {
      if (isReduceMotionEnabled) {
        // Reduced motion: instant appearance with minimal animation
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: ANIMATION_CONFIG.reducedMotionDuration,
            useNativeDriver: true,
          }),
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: ANIMATION_CONFIG.reducedMotionDuration,
            useNativeDriver: true,
          }),
        ]).start(finished => {
          if (finished) {
            // Schedule completion based on timing requirements
            scheduleCompletion();
          } else {
            // Animation was interrupted, proceed anyway
            console.warn(
              'Reduced motion animation interrupted, proceeding to completion',
            );
            scheduleCompletion();
          }
        });
      } else {
        // Standard animation sequence with staggered timing for professional appearance
        // Logo fade-in first
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: ANIMATION_CONFIG.logoFadeInDuration,
          useNativeDriver: true,
        }).start(finished => {
          if (!finished) {
            console.warn(
              'Logo animation interrupted, proceeding to title animation',
            );
          }

          // Title fade-in after logo (staggered for professional appearance)
          animationTimeoutRef.current = setTimeout(() => {
            try {
              Animated.timing(titleOpacity, {
                toValue: 1,
                duration: ANIMATION_CONFIG.titleFadeInDuration,
                useNativeDriver: true,
              }).start(titleFinished => {
                if (!titleFinished) {
                  console.warn(
                    'Title animation interrupted, proceeding to completion',
                  );
                }
                // Schedule completion based on timing requirements
                scheduleCompletion();
              });
            } catch (titleError) {
              console.error('Error in title animation:', titleError);
              scheduleCompletion();
            }
          }, ANIMATION_CONFIG.titleFadeInDelay);
        });
      }
    } catch (error) {
      console.error('Error in startAnimations:', error);
      // If animations fail completely, proceed to completion after a short delay
      setTimeout(() => {
        scheduleCompletion();
      }, 500);
    }
  };

  const fadeOutAndComplete = () => {
    // Check if we've already completed to prevent duplicate calls
    if (hasCompletedRef.current) {
      return;
    }

    try {
      const fadeOutDuration = isReduceMotionEnabled
        ? ANIMATION_CONFIG.reducedMotionDuration
        : ANIMATION_CONFIG.fadeOutDuration;

      // Smooth fade-out transition for both elements simultaneously
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: fadeOutDuration,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: fadeOutDuration,
          useNativeDriver: true,
        }),
      ]).start(finished => {
        // Complete the transition after fade-out animation (or if interrupted)
        if (!finished) {
          console.warn(
            'Fade-out animation interrupted, completing transition anyway',
          );
        }
        completeTransition();
      });
    } catch (error) {
      console.error('Error in fadeOutAndComplete:', error);
      // If fade-out fails, complete immediately
      completeTransition();
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo placeholder - will be replaced with actual logo in future tasks */}
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>M</Text>
        </View>
      </Animated.View>

      {/* App title */}
      <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
        <Text style={styles.titleText}>Metal Tracker</Text>
      </Animated.View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: colors.background,
    fontSize: 36,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default SplashScreen;
