# Details Components

This directory contains components used in the details screens of the Precious Metals Tracker app.

## PriceChart Component

The `PriceChart` component is a sophisticated chart visualization component built with `react-native-svg` and `react-native-reanimated` for displaying precious metal price trends.

### Features

- **Smooth Animations**: Optimized for 120Hz displays with React Native Reanimated v3
- **Metal-Specific Styling**: Automatic color coding based on metal type (Gold, Silver, Platinum, Palladium)
- **Trend Visualization**: Visual indicators for positive/negative price trends
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Performance Optimized**: Efficient data processing and rendering for large datasets
- **Customizable**: Multiple configuration options for different use cases

### Props

```typescript
interface PriceChartProps {
  data: MetalPrice[];              // Array of price data points
  width?: number;                  // Chart width (default: screen width - 32)
  height?: number;                 // Chart height (default: 120)
  metalSymbol: 'XAU' | 'XAG' | 'XPT' | 'XPD'; // Metal type for color coding
  animated?: boolean;              // Enable/disable animations (default: true)
  showDataPoints?: boolean;        // Show individual data points (default: false)
  showGradient?: boolean;          // Show gradient fill under curve (default: true)
}
```

### Usage Examples

#### Basic Usage
```tsx
import { PriceChart } from '../components/details/PriceChart';

<PriceChart
  data={priceData}
  metalSymbol="XAU"
  width={300}
  height={120}
/>
```

#### With Data Points
```tsx
<PriceChart
  data={priceData}
  metalSymbol="XAG"
  showDataPoints={true}
  animated={true}
/>
```

#### Minimal Style
```tsx
<PriceChart
  data={priceData}
  metalSymbol="XPT"
  showGradient={false}
  showDataPoints={false}
  animated={false}
/>
```

### Data Format

The component expects an array of `MetalPrice` objects:

```typescript
interface MetalPrice {
  metal: 'XAU' | 'XAG' | 'XPT' | 'XPD';
  currency: 'INR';
  price: number;
  timestamp: string;
  prev_close_price: number;
  open_price: number;
  low_price: number;
  high_price: number;
  ch: number;      // Change
  chp: number;     // Change percentage
}
```

### Styling

The component automatically applies metal-specific colors:

- **Gold (XAU)**: `#F7931A` (Bitcoin-inspired gold)
- **Silver (XAG)**: `#8E9AAF` (Modern silver)
- **Platinum (XPT)**: `#E8E8E8` (Clean platinum)
- **Palladium (XPD)**: `#B8BCC8` (Subtle palladium)

Trend colors:
- **Positive**: `#00D4AA` (Crypto green)
- **Negative**: `#FF4757` (Error red)

### Performance Considerations

1. **Data Optimization**: The component automatically optimizes large datasets using the `getOptimalDataPoints` utility
2. **Animation Performance**: Uses `useNativeDriver: true` for 120Hz optimization
3. **Memory Management**: Proper cleanup of animations and event listeners
4. **Rendering Efficiency**: Memoized calculations and optimized SVG rendering

### Animation Details

- **Path Drawing**: Smooth animated path drawing using `strokeDasharray` and `strokeDashoffset`
- **Duration**: 600ms with cubic-bezier easing for smooth transitions
- **120Hz Optimization**: Configured for high refresh rate displays
- **Native Thread**: Animations run on the native thread for better performance

### Error Handling

The component gracefully handles:
- Empty data arrays
- Single data points
- Invalid data formats
- Extreme price variations
- Network connectivity issues

### Testing

Comprehensive test suite includes:
- Component rendering tests
- Data processing validation
- Animation performance tests
- Error scenario handling
- Performance benchmarks

### Dependencies

- `react-native-svg`: For SVG chart rendering
- `react-native-reanimated`: For smooth animations
- Custom utilities: `chartUtils.ts` for data processing

### Related Components

- `MetalTile`: Displays individual metal information on home screen
- `DetailsScreen`: Container screen that uses PriceChart
- `GlassCard`: Reusable card component for consistent styling

### Future Enhancements

- Interactive touch gestures (zoom, pan)
- Multiple timeframe support (1H, 1D, 1W, 1M)
- Candlestick chart mode
- Volume indicators
- Technical analysis overlays
- Export functionality