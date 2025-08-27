/**
 * PriceChart Component - PERFORMANCE OPTIMIZED
 *
 * Heavily optimized SVG chart with memoization and reduced re-renders.
 */
import React, { memo, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// The data format this chart expects
type DataPoint = {
  x: number;
  y: number;
};

interface PriceChartProps {
  data?: DataPoint[]; // Data is optional to handle loading states
  color: string;
  width?: number;
  height?: number;
}

const PriceChartComponent: React.FC<PriceChartProps> = ({
  data,
  color,
  width = screenWidth * 0.8,
  height = 180,
}) => {
  // PERFORMANCE OPTIMIZED: Memoize expensive calculations
  const chartPaths = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const maxY = Math.max(...data.map(p => p.y));
    const minY = Math.min(...data.map(p => p.y));
    const yRange = maxY - minY || 1;
    const maxX = data.length - 1;

    const path = data
      .map((point, i) => {
        const x = (i / maxX) * width;
        const y = height - ((point.y - minY) / yRange) * (height - 20) - 10;

        if (isNaN(x) || isNaN(y)) {
          return '';
        }

        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');

    if (!path.startsWith('M')) {
      return null;
    }

    return {
      linePath: path,
      fillPath: `${path} L ${width} ${height} L 0 ${height} Z`,
    };
  }, [data, width, height]);

  // PERFORMANCE OPTIMIZED: Memoize gradient definition
  const gradientId = useMemo(() => `chartGradient-${Math.random().toString(36).substring(2, 11)}`, []);

  if (!chartPaths) {
    return <View style={[styles.container, { width, height }]} />;
  }

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        <Path
          d={chartPaths.fillPath}
          fill={`url(#${gradientId})`}
        />

        <Path
          d={chartPaths.linePath}
          stroke={color}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// PERFORMANCE OPTIMIZED: Memoize the entire component
export const PriceChart = memo(PriceChartComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});
