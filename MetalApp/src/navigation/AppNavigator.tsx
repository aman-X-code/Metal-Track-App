/**
 * Main app navigator with smooth transitions and navigation guards
 */

import React, { useCallback, useRef } from 'react';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { 
  transitionConfig, 
  cardStyleInterpolator, 
  gestureConfig,
  navigationGuard,
  getScreenOptions
} from './navigationConfig';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const navigationRef = useRef<any>(null);
  const previousStateRef = useRef<NavigationState | undefined>(undefined);

  // Enhanced navigation state change handler with guards
  const handleNavigationStateChange = useCallback((state: NavigationState | undefined) => {
    if (!state) return;

    const previousState = previousStateRef.current;
    const currentRoute = state.routes[state.index];
    
    // Detect navigation transitions
    if (previousState && previousState.index !== state.index) {
      // Start transition guard when navigation begins
      navigationGuard.startTransition();
      console.log('Navigation transition started to:', currentRoute?.name);
    }
    
    // Update previous state reference
    previousStateRef.current = state;
  }, []);

  // Handle navigation ready event
  const handleNavigationReady = useCallback(() => {
    console.log('Navigation container ready');
    // Reset any stuck transition states
    navigationGuard.forceReset();
  }, []);

  return (
    <NavigationContainer 
      ref={navigationRef}
      onStateChange={handleNavigationStateChange}
      onReady={handleNavigationReady}
    >
      <Stack.Navigator
        screenOptions={({ route }) => getScreenOptions(route.name)}
        initialRouteName="Home"
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={getScreenOptions('Home')}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen}
          options={getScreenOptions('Details')}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}