/**
 * SplashScreenErrorBoundary Component
 * 
 * Error boundary specifically designed for the splash screen to handle
 * animation failures and other errors gracefully without getting stuck.
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface Props {
  children: ReactNode;
  onError: () => void;
  fallbackTimeout?: number;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

class SplashScreenErrorBoundary extends Component<Props, State> {
  private fallbackTimeoutRef: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error for debugging
    console.error('SplashScreen Error Boundary caught an error:', error, errorInfo);
    
    // Set a fallback timeout to ensure we don't get stuck
    const timeout = this.props.fallbackTimeout || 2000;
    this.fallbackTimeoutRef = setTimeout(() => {
      console.warn('SplashScreen error boundary timeout reached, proceeding to main app');
      this.props.onError();
    }, timeout);
  }

  componentWillUnmount() {
    if (this.fallbackTimeoutRef) {
      clearTimeout(this.fallbackTimeoutRef);
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI - simple loading screen that will timeout
      return (
        <View style={styles.errorContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.titleText}>Metal Tracker</Text>
          <Text style={styles.errorText}>Loading...</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    color: colors.background,
    fontSize: 36,
    fontWeight: 'bold',
  },
  titleText: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SplashScreenErrorBoundary;