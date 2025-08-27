/**
 * Error message component
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RefreshCw } from 'lucide-react-native';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'Something went wrong', 
  onRetry,
  compact = false 
}) => {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw color="#4CFFB2" size={16} />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  compact: {
    padding: 10,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(76, 255, 178, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CFFB2',
  },
  retryText: {
    color: '#4CFFB2',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});