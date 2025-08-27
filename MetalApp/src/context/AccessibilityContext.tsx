/**
 * Accessibility context for managing accessibility settings
 */

import React, { createContext, useContext } from 'react';

interface AccessibilityContextType {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: React.ReactNode;
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
}

export function AccessibilityProvider({ 
  children, 
  isScreenReaderEnabled, 
  isReduceMotionEnabled 
}: AccessibilityProviderProps) {
  const value = {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}