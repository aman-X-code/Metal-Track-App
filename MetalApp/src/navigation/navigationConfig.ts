/**
 * Navigation configuration with smooth transitions and navigation guards
 */

import {
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
  TransitionSpecs,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { Animated, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced spring-based transition configuration for smooth animations
export const transitionConfig = {
  transitionSpec: {
    open: {
      animation: 'spring' as const,
      config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
    close: {
      animation: 'spring' as const,
      config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
  },
};

// Navigation guard state to prevent animation interruptions
let isTransitioning = false;
let transitionTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Navigation guard to prevent animation interruptions
 */
export const navigationGuard = {
  canNavigate: (): boolean => {
    return !isTransitioning;
  },
  
  startTransition: (): void => {
    isTransitioning = true;
    
    // Clear any existing timeout
    if (transitionTimeout) {
      clearTimeout(transitionTimeout);
    }
    
    // Reset transition state after animation duration (600ms for spring animation)
    transitionTimeout = setTimeout(() => {
      isTransitioning = false;
      transitionTimeout = null;
    }, 600);
  },
  
  forceReset: (): void => {
    isTransitioning = false;
    if (transitionTimeout) {
      clearTimeout(transitionTimeout);
      transitionTimeout = null;
    }
  },
};

// Enhanced card style interpolator for smooth slide transitions with improved performance
export const cardStyleInterpolator = ({
  current,
  next,
  layouts,
}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
  const progress = current.progress;
  
  return {
    cardStyle: {
      transform: [
        {
          translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screenWidth, 0],
            extrapolate: 'clamp',
          }),
        },
        {
          scale: next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.95],
                extrapolate: 'clamp',
              })
            : 1,
        },
      ],
      opacity: progress.interpolate({
        inputRange: [0, 0.3, 1],
        outputRange: [0, 1, 1],
        extrapolate: 'clamp',
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
        extrapolate: 'clamp',
      }),
      backgroundColor: '#000000',
    },
  };
};

// Enhanced gesture configuration to prevent animation glitches
export const gestureConfig = {
  gestureEnabled: true,
  gestureResponseDistance: 35,
  gestureVelocityImpact: 0.3,
  gestureDirection: 'horizontal' as const,
};

/**
 * Screen-specific options for smooth transitions
 */
export const getScreenOptions = (routeName: string): StackNavigationOptions => {
  const baseOptions: StackNavigationOptions = {
    headerShown: false,
    cardStyle: { 
      backgroundColor: '#0D0D0D',
      opacity: 1,
    },
    ...transitionConfig,
    cardStyleInterpolator,
    ...gestureConfig,
    // Prevent gesture conflicts during transitions
    gestureEnabled: !isTransitioning,
  };

  switch (routeName) {
    case 'Home':
      return {
        ...baseOptions,
        // Home screen specific optimizations
        cardStyle: {
          backgroundColor: '#0D0D0D',
          opacity: 1,
        },
      };
    
    case 'Details':
      return {
        ...baseOptions,
        // Details screen specific optimizations
        cardStyle: {
          backgroundColor: '#0D0D0D',
          opacity: 1,
        },
        // Enhanced gesture handling for details screen
        gestureResponseDistance: 50,
      };
    
    default:
      return baseOptions;
  }
};