# Home Components

This directory contains components used on the home screen of the Precious Metals Tracker app.

## MetalTile Component

The `MetalTile` component displays individual metal information with modern styling, animations, and interactive features.

### Features

- **Modern Design**: Glassmorphism effects with dark theme and neon accents
- **Loading States**: Animated skeleton shimmer while fetching data
- **Error Handling**: User-friendly error messages with retry functionality
- **Press Animations**: Smooth scale animations optimized for 120Hz displays
- **Haptic Feedback**: Vibration feedback on supported devices
- **Price Formatting**: Indian Rupee formatting with proper number display
- **Change Indicators**: Color-coded price changes (green/red/neutral)
- **Responsive**: Adapts to different screen sizes and orientations

### Usage

```tsx
import { MetalTile } from './components/home';
import { MetalData } from './types/metals';

const metalData: MetalData = {
  id: 'gold',
  name: 'Gold',
  symbol: 'XAU',
  icon: '🥇',
  color: '#F7931A',
  loading: false,
  price: {
    metal: 'XAU',
    currency: 'INR',
    price: 5500000,
    timestamp: '2024-01-15T10:30:00Z',
    prev_close_price: 5450000,
    open_price: 5480000,
    low_price: 5470000,
    high_price: 5520000,
    ch: 50000,
    chp: 0.92,
  },
};

<MetalTile
  metal={metalData}
  onPress={(metal) => navigateToDetails(metal)}
  onRetry={(metalId) => refetchPrice(metalId)}
/>
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `metal` | `MetalData` | Yes | Metal data including price, loading state, and error |
| `onPress` | `(metal: MetalData) => void` | Yes | Callback when tile is pressed |
| `onRetry` | `(metalId: string) => void` | No | Callback when retry button is pressed in error state |

### States

#### Normal State
- Displays metal icon, name, current price, price change, and timestamp
- Shows color-coded price change indicators
- Animated price indicator dot in top-right corner

#### Loading State
- Shows animated skeleton shimmer effect
- Disables press interactions
- Displays placeholder elements with metal-specific colors

#### Error State
- Shows error message and retry button
- Displays metal icon and name for context
- Allows retry functionality if `onRetry` prop is provided

### Styling

The component uses the app's design system:
- **Colors**: Defined in `constants/colors.ts`
- **Animations**: Defined in `constants/animations.ts`
- **Typography**: Platform-specific monospace fonts for prices
- **Layout**: Responsive grid layout (48% width for 2-column display)

### Testing

Comprehensive test suite covers:
- Normal rendering with price data
- Loading state behavior
- Error state handling
- Different metal types (Gold, Silver, Platinum, Palladium)
- Edge cases (large numbers, zero changes, missing data)
- User interactions (press, retry)
- Accessibility features

Run tests with:
```bash
npm test -- MetalTile.comprehensive.test.tsx
```

### Performance

- Optimized for 120Hz displays
- Uses React Native Reanimated v3 for smooth animations
- Implements proper cleanup for animations and timers
- Minimal re-renders with React.memo patterns

### Accessibility

- Proper text contrast ratios
- Accessible touch targets (minimum 44px)
- Screen reader compatible
- Clear error messaging
- Intuitive interaction patterns