/**
 * MetalTile Component - FINAL VERSION
 *
 * Displays all required data: 24k price and last updated timestamp.
 * Fully performance optimized for smooth scrolling and interaction.
 * Integrated with themed loading system and navigation state tracking.
 */
import React, { memo, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
// Use Pressable from gesture-handler for better animation integration
import { Pressable } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Clock } from 'lucide-react-native';
import { PriceChart } from '../details/PriceChart';
import { MetalData, HistoricalDataPoint } from '../../types/metals';
import { formatRelativeTime } from '../../utils/formatters';

export interface MetalTileProps {
  metal: MetalData;
  historicalData?: HistoricalDataPoint[];
  onPress: (metal: MetalData) => void;
}

const getMetalAssetDetails = (symbol: string) => {
  switch (symbol) {
    case 'XAU': return { letter: 'G', color: '#FFD700' };
    case 'XAG': return { letter: 'S', color: '#C0C0C0' };
    case 'XPT': return { letter: 'P', color: '#E5E4E2' };
    case 'XPD': return { letter: 'P', color: '#CED0DD' };
    default: return { letter: 'M', color: '#4CFFB2' };
  }
};

const MetalTileComponent: React.FC<MetalTileProps> = ({
  metal,
  historicalData,
  onPress,
}) => {
  const scale = useSharedValue(1);
  
  const { letter, color: metalColor } = useMemo(() => getMetalAssetDetails(metal.symbol), [metal.symbol]);
  
  const { isPositive, changeColor, changePercentage } = useMemo(() => {
    const positive = (metal.price?.chp || 0) >= 0;
    return {
      isPositive: positive,
      changeColor: positive ? '#4CFFB2' : '#FF6B6B',
      changePercentage: metal.price?.chp?.toFixed(2) ?? '0.00',
    };
  }, [metal.price?.chp]);
  
  const chartData = useMemo(() => 
    historicalData?.map((point, index) => ({
      x: index,
      y: point.price,
    })), [historicalData]
  );

  const handlePressIn = useCallback(() => { 
    'worklet'; 
    scale.value = withSpring(0.96); 
  }, [scale]);
  
  const handlePressOut = useCallback(() => { 
    'worklet'; 
    scale.value = withSpring(1); 
  }, [scale]);
  
  const handlePress = useCallback(() => { 
    onPress(metal);
  }, [onPress, metal]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderLoading = () => <ActivityIndicator size="large" color={metalColor} />;
  const renderError = () => (
    <View style={styles.retryContainer}>
      <RefreshCw color="#FF6B6B" size={24} />
      <Text style={styles.errorText}>Error</Text>
    </View>
  );

  const renderData = () => (
    <>
        <View style={styles.header}>
            <View style={[styles.metalIconPlaceholder, { backgroundColor: metalColor }]}>
                <Text style={styles.metalIconLetter}>{letter}</Text>
            </View>
            <View>
                <Text style={styles.metalSymbol}>{metal.symbol}</Text>
                <Text style={styles.metalName}>{metal.name}</Text>
            </View>
        </View>

        <View style={styles.priceSection}>
            <View>
                <Text style={styles.priceLabel}>Price (troy oz)</Text>
                <Text style={styles.priceText}>
                    {`₹${metal.price?.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '...'}`}
                </Text>
            </View>
            <View style={styles.price24kContainer}>
                <Text style={styles.priceLabel}>24k (gram)</Text>
                <Text style={styles.price24kText}>
                    {`₹${metal.price?.price_gram_24k?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '...'}`}
                </Text>
            </View>
        </View>

        <View style={styles.chartContainer}>
            <View style={styles.chartWrapper}>
                {chartData && chartData.length > 0 ? (
                    <PriceChart data={chartData} color={changeColor} />
                ) : (
                    <View style={styles.chartLoadingContainer}><ActivityIndicator size="small" color={changeColor} /></View>
                )}
            </View>
        </View>
        
        <View style={styles.footer}>
            <View style={[styles.changeBadge, { backgroundColor: changeColor }]}>
                {isPositive ? <ArrowUpRight color="#0D0D0D" size={14} /> : <ArrowDownRight color="#0D0D0D" size={14} />}
                <Text style={styles.changeText}>{`${changePercentage}%`}</Text>
            </View>
            {metal.price?.timestamp && (
                <View style={styles.timestampContainer}>
                    <Clock color="#A0A0A0" size={12} />
                    <Text style={styles.timestampText}>
                        {formatRelativeTime(metal.price.timestamp)}
                    </Text>
                </View>
            )}
        </View>
    </>
  );

  return (
    <Pressable
        style={styles.pressableContainer}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={false}
    >
        <Animated.View style={[styles.pressableContent, animatedStyle]}>
            {metal.loading && !metal.price && renderLoading()}
            {metal.error && renderError()}
            {metal.price && renderData()}
        </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    width: Dimensions.get('window').width * 0.8,
    height: 380,
    marginRight: 16,
  },
  pressableContent: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metalIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  metalIconLetter: {
    color: '#0D0D0D',
    fontSize: 20,
    fontWeight: 'bold',
  },
  metalSymbol: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  metalName: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  priceSection: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 4,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  price24kContainer: {
    alignItems: 'flex-end',
  },
  price24kText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  chartContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: 180,
  },
  chartWrapper: {
    flex: 1,
  },
  chartLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  changeText: {
    color: '#0D0D0D',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
    color: '#A0A0A0',
    fontSize: 12,
    marginLeft: 6,
  },
  retryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});

export const MetalTile = memo(MetalTileComponent);
export default MetalTile;