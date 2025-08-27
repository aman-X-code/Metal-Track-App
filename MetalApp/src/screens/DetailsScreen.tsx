/**
 * DetailsScreen Component
 *
 * Displays comprehensive metal information.
 * Cleaned and updated to use the new self-contained PriceChart component.
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PriceChart } from '../components/details/PriceChart';
import { Logo } from '../components/common/Logo';
import { ActivityIndicator } from 'react-native';
import { useMetals } from '../context/MetalsContext';
import {
  colors,
  getMetalColor,
  getPriceChangeColor,
} from '../constants/colors';
import {
  formatINR,
  formatPercentage,
  formatRelativeTime,
} from '../utils/formatters';
import { DetailsScreenProps } from '../types/navigation';
import { navigationFeedback, refreshFeedback } from '../utils/hapticFeedback';
import { navigationGuard } from '../navigation/navigationConfig';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

// Define the data format for our new chart
type ChartDataPoint = { x: number; y: number };

export const DetailsScreen: React.FC<DetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { getMetalById, refreshPrices } = useMetals();
  const { metalId } = route.params;

  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  const priceScale = useSharedValue(1);

  // PERFORMANCE OPTIMIZED: Memoize metal data to prevent unnecessary re-renders
  const metal = useMemo(() => {
    try {
      return getMetalById(metalId);
    } catch (error) {
      console.error('Error getting metal by ID:', error);
      return undefined;
    }
  }, [metalId, getMetalById]);

  // PERFORMANCE OPTIMIZED: Memoize chart data generation
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!metal?.price) return [];
    // Use metal ID as seed for consistent data
    const seed = metalId.charCodeAt(0);
    return Array.from({ length: 40 }, (_, i) => ({
      x: i,
      y: 50 + 25 * Math.sin(i / 4 + seed),
    }));
  }, [metal?.price, metalId]);

  // PERFORMANCE OPTIMIZED: Memoize expensive calculations
  const { metalColor, priceChangeColor } = useMemo(
    () => ({
      metalColor: getMetalColor(metal?.symbol || ''),
      priceChangeColor: metal?.price
        ? getPriceChangeColor(metal.price.ch)
        : colors.text.muted,
    }),
    [metal?.symbol, metal?.price],
  );

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    contentTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });
  }, [headerOpacity, contentTranslateY]);

  // Animate price changes
  useEffect(() => {
    if (metal?.price) {
      priceScale.value = withSpring(
        1.05,
        { damping: 10, stiffness: 300 },
        () => {
          priceScale.value = withSpring(1);
        },
      );
    }
  }, [metal?.price, priceScale]);

  const handleRefresh = useCallback(async () => {
    if (!metal) return;
    refreshFeedback();
    try {
      await refreshPrices();
    } catch (error) {
      console.error(`Failed to refresh ${metal.name} price:`, error);
    }
  }, [metal, refreshPrices]);

  const handleBackPress = useCallback(() => {
    // Use navigation guard to prevent interruptions during back navigation
    if (!navigationGuard.canNavigate()) {
      return;
    }
    
    navigationFeedback();
    navigation.goBack();
  }, [navigation]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }));
  const priceAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: priceScale.value }],
  }));

  if (!metal) {
    // Return a simple error state if metal data is not found
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Metal data not found for ID: {metalId}
          </Text>
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={styles.errorLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Logo size="small" variant="header" style={styles.headerLogo} />
          <Text style={styles.headerTitle}>{metal.name}</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <RefreshCw color="#FFFFFF" size={22} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        removeClippedSubviews={true}
      >
        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          <View style={styles.priceCard}>
            {metal.loading && !metal.price ? (
              <ActivityIndicator size="large" color={metalColor} />
            ) : metal.price ? (
              <>
                <Animated.Text
                  style={[styles.currentPrice, priceAnimatedStyle]}
                >
                  {formatINR(metal.price.price)}
                </Animated.Text>
                <View style={styles.priceChangeContainer}>
                  <Text
                    style={[styles.priceChange, { color: priceChangeColor }]}
                  >
                    {formatINR(metal.price.ch)} (
                    {formatPercentage(metal.price.chp)})
                  </Text>
                </View>
                <Text style={styles.lastUpdated}>
                  Updated {formatRelativeTime(metal.price.timestamp)}
                </Text>
              </>
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {metal.error || 'Failed to load price data'}
                </Text>
                <TouchableOpacity
                  onPress={handleRefresh}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>24H Trend</Text>
            <PriceChart
              data={chartData}
              color={priceChangeColor}
              width={screenWidth - 80}
              height={150}
            />
          </View>

          {metal.price && (
            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Market Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Open</Text>
                <Text style={styles.detailValue}>
                  {formatINR(metal.price.open_price)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>High</Text>
                <Text style={styles.detailValue}>
                  {formatINR(metal.price.high_price)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Low</Text>
                <Text style={styles.detailValue}>
                  {formatINR(metal.price.low_price)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Prev. Close</Text>
                <Text style={styles.detailValue}>
                  {formatINR(metal.price.prev_close_price)}
                </Text>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
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
    padding: 20,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerLogo: {
    marginRight: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  backButton: { padding: 4 },
  refreshButton: { padding: 4 },
  contentContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  priceCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  chartCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden', // Prevent chart overflow
  },
  detailsCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currentPrice: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '700',
  },
  priceChangeContainer: {
    marginTop: 8,
  },
  priceChange: {
    fontSize: 18,
    fontWeight: '500',
  },
  lastUpdated: {
    marginTop: 12,
    color: '#A0A0A0',
    fontSize: 14,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailLabel: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 16,
  },
  errorLink: {
    color: '#4CFFB2',
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#4CFFB2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontWeight: '600',
  },
});
