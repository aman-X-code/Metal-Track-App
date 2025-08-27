/**
 * Haptic feedback utilities
 */

import { Vibration, Platform } from 'react-native';

export const successFeedback = () => {
  if (Platform.OS === 'ios') {
    // iOS haptic feedback would go here if using react-native-haptic-feedback
    Vibration.vibrate(50);
  } else {
    Vibration.vibrate(50);
  }
};

export const pullToRefreshTrigger = () => {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(30);
  } else {
    Vibration.vibrate(30);
  }
};

export const navigationFeedback = () => {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(20);
  } else {
    Vibration.vibrate(20);
  }
};

export const refreshFeedback = () => {
  if (Platform.OS === 'ios') {
    Vibration.vibrate(40);
  } else {
    Vibration.vibrate(40);
  }
};