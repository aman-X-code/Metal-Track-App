/**
 * HomeScreen Component - PERFORMANCE OPTIMIZED
 *
 * Optimized for 120Hz displays with smooth scrolling and reduced re-renders.
 */
import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  withSpring, 
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Search, Bell } from 'lucide-react-native';

import { MetalTile } from '../components/home/MetalTile';
import { Logo } from '../components/common/Logo';
import { useMetals } from '../context/MetalsContext';
import { MetalData, Timeframe } from '../types/metals';
import { HomeScreenProps } from '../types/navigation';
import { successFeedback, pullToRefreshTrigger } from '../utils/hapticFeedback';
import { useNavigationState } from '../navigation/navigationState';
import { navigationGuard } from '../navigation/navigationConfig';
import { useFocusEffect } from '@react-navigation/native';

const timeframes: Timeframe[] = ['24h', 'Week', 'Month'];
const { width } = Dimensions.get('window');

const HomeScreenComponent: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { state, refreshPrices, fetchHistoricalData } = useMetals();
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('Week');
  const navigationState = useNavigationState();

  const headerOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const listTranslateY = useSharedValue(20);
  // PERFORMANCE OPTIMIZED: Memoize metals data to prevent unnecessary re-renders
  const metalsData = useMemo(() => state.metals, [state.metals]);
  
  // PERFORMANCE OPTIMIZED: Memoize timeframe buttons to prevent re-renders
  const timeframeButtons = useMemo(() => timeframes.map((item) => (
    <TouchableOpacity
      key={item}
      style={[styles.timeframeButton, activeTimeframe === item && styles.activeTimeframeButton]}
      onPress={() => setActiveTimeframe(item)}
    >
      <Text style={[styles.timeframeText, activeTimeframe === item && styles.activeTimeframeText]}>
        {item}
      </Text>
    </TouchableOpacity>
  )), [activeTimeframe]);

  // Animate the screen on initial load - optimized for 120Hz
  useEffect(() => {
    headerOpacity.value = withSpring(1, { damping: 25, stiffness: 200 });
    titleTranslateY.value = withSpring(0, { damping: 25, stiffness: 200 });
    listTranslateY.value = withSpring(0, { damping: 25, stiffness: 200 });
  }, [headerOpacity, listTranslateY, titleTranslateY]);



  // PERFORMANCE OPTIMIZED: Debounced historical data fetching
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      metalsData.forEach(metal => {
        if (metal.price && !metal.historicalData?.[activeTimeframe]) {
          fetchHistoricalData(metal.id, activeTimeframe);
        }
      });
    }, 100); // Debounce by 100ms

    return () => clearTimeout(timeoutId);
  }, [activeTimeframe, metalsData, fetchHistoricalData]);

  const handleRefresh = useCallback(async () => {
    pullToRefreshTrigger();
    try {
      await refreshPrices();
      successFeedback();
    } catch (error) {
      console.error('Failed to refresh prices:', error);
    }
  }, [refreshPrices]);

  const handleMetalPress = useCallback((metal: MetalData) => {
    // Use both navigation guards for maximum protection against interruptions
    if (!navigationGuard.canNavigate()) {
      return;
    }
    
    navigationState.throttledNavigate(() => {
      navigation.navigate('Details', { metalId: metal.id });
    });
  }, [navigation, navigationState]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const titleAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: titleTranslateY.value }], opacity: headerOpacity.value }));
  const listAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: listTranslateY.value }], opacity: headerOpacity.value }));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={styles.headerLeft}>
          <Logo size="medium" variant="header" style={styles.logo} />
          <View>
            <Text style={styles.greetingText}>Hello</Text>
            <Text style={styles.userName}>Aman Khanna 👋</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}><Search color="#E0E0E0" size={22} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><Bell color="#E0E0E0" size={22} /></TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View style={titleAnimatedStyle}>
        <Text style={styles.mainTitle}>All Your Metals,</Text>
        <Text style={styles.mainTitleBold}>One Powerful Tracker.</Text>
      </Animated.View>

      <View style={styles.timeframeContainer}>
        {timeframeButtons}
      </View>
      
      <Animated.View style={[styles.listContainer, listAnimatedStyle]}>
        <FlatList
          data={metalsData}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContentContainer}
          snapToInterval={width * 0.8 + 16}
          decelerationRate="fast"
          scrollEventThrottle={1} // 120Hz optimization
          removeClippedSubviews={true} // Performance optimization
          maxToRenderPerBatch={2} // Render only 2 items at a time
          windowSize={3} // Keep 3 items in memory
          initialNumToRender={2} // Start with 2 items
          getItemLayout={(_data, index) => ({
            length: width * 0.8 + 16,
            offset: (width * 0.8 + 16) * index,
            index,
          })}
          renderItem={({ item }) => {
            const historicalDataForTile = item.historicalData?.[activeTimeframe];
            return (
              <MetalTile
                metal={item}
                onPress={handleMetalPress}
                historicalData={historicalDataForTile}
              />
            );
          }}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={handleRefresh}
              tintColor="#4CFFB2"
              progressViewOffset={20}
            />
          }
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginRight: 12,
  },
  greetingText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
  },
  mainTitle: {
    fontSize: 36,
    color: '#E0E0E0',
    fontWeight: '300',
    paddingHorizontal: 20,
  },
  mainTitleBold: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeframeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTimeframeButton: {
    backgroundColor: '#4CFFB2',
  },
  timeframeText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTimeframeText: {
    color: '#0D0D0D',
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export const HomeScreen = memo(HomeScreenComponent);
export default HomeScreen;
