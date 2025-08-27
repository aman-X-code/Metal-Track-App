# Themed Loading Indicator System

This document describes the themed loading indicator system implemented for the Metal app, which provides color-themed loading indicators that match the selected metal during navigation transitions.

## Overview

The themed loading system consists of several components working together to provide a seamless user experience:

1. **Metal Theme Configuration** - Color schemes for each metal type
2. **ThemedLoader Component** - Animated loading indicator with metal-specific colors
3. **Navigation State Management** - Context integration for loading states
4. **Helper Components** - Wrappers and triggers for easy integration

## Components

### 1. Metal Theme Configuration (`metalThemes.ts`)

Defines color schemes for each metal symbol:

```typescript
export const METAL_THEMES: Record<MetalSymbol, MetalTheme> = {
  XAU: { // Gold
    primaryColor: '#FFD700',
    secondaryColor: '#FFA500',
    gradientColors: ['#FFD700', '#FFA500'],
    loader: {
      color: '#FFD700',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
  },
  // ... other metals
};
```

### 2. ThemedLoader Component

A highly animated loading indicator that adapts to metal themes:

**Features:**
- Smooth fade in/out animations using react-native-reanimated
- Rotating outer ring with metal-specific colors
- Inner ring with secondary colors
- Native ActivityIndicator in the center
- 60fps performance optimized animations

**Usage:**
```typescript
<ThemedLoader
  metalTheme={METAL_THEMES.XAU}
  isVisible={true}
  size="large"
  onComplete={() => console.log('Animation complete')}
/>
```

### 3. Navigation State Management

Extended the MetalsContext to include navigation loading state:

**New State:**
```typescript
interface NavigationLoadingState {
  isNavigating: boolean;
  selectedMetalId: string | null;
  loadingStartTime: number | null;
}
```

**New Actions:**
- `START_NAVIGATION_LOADING` - Begins themed loading for a specific metal
- `STOP_NAVIGATION_LOADING` - Ends the loading state

### 4. useThemedNavigation Hook

Custom hook that provides themed navigation functionality:

```typescript
const {
  isNavigating,
  selectedMetalId,
  metalTheme,
  startNavigationLoading,
  stopNavigationLoading,
} = useThemedNavigation();
```

### 5. Helper Components

#### ThemedNavigationWrapper
Wraps screens to automatically show themed loaders during navigation:

```typescript
<ThemedNavigationWrapper>
  <YourScreenContent />
</ThemedNavigationWrapper>
```

#### ThemedNavigationTrigger
Wraps touchable components to trigger themed loading:

```typescript
<ThemedNavigationTrigger
  metalId="gold"
  onNavigate={() => navigation.navigate('Details')}
>
  <MetalTile />
</ThemedNavigationTrigger>
```

## Integration Guide

### Step 1: Wrap Your App
```typescript
// In your main App component
<MetalsProvider>
  <ThemedNavigationWrapper>
    <AppNavigator />
  </ThemedNavigationWrapper>
</MetalsProvider>
```

### Step 2: Update Metal Tiles
```typescript
// In MetalTile component
const { startNavigationLoading } = useThemedNavigation();

const handlePress = () => {
  startNavigationLoading(metal.id);
  // Navigate after a brief delay
  setTimeout(() => {
    navigation.navigate('Details', { metalId: metal.id });
  }, 800);
};
```

### Step 3: Stop Loading on Screen Mount
```typescript
// In DetailsScreen
const { stopNavigationLoading } = useThemedNavigation();

useEffect(() => {
  // Stop loading when screen is ready
  const timer = setTimeout(() => {
    stopNavigationLoading();
  }, 200);
  
  return () => clearTimeout(timer);
}, []);
```

## Color Schemes

### Gold (XAU)
- Primary: `#FFD700` (Gold)
- Secondary: `#FFA500` (Orange)
- Loader: `#FFD700` with 10% opacity background

### Silver (XAG)
- Primary: `#C0C0C0` (Silver)
- Secondary: `#A8A8A8` (Dark Silver)
- Loader: `#C0C0C0` with 10% opacity background

### Platinum (XPT)
- Primary: `#E5E4E2` (Platinum)
- Secondary: `#D3D3D3` (Light Gray)
- Loader: `#E5E4E2` with 10% opacity background

### Palladium (XPD)
- Primary: `#CED0DD` (Palladium)
- Secondary: `#B8BCC8` (Blue-Gray)
- Loader: `#CED0DD` with 10% opacity background

## Performance Considerations

- Uses `react-native-reanimated` for 60fps animations
- Animations run on the UI thread using worklets
- Shared values prevent unnecessary re-renders
- Memoized context values reduce component updates
- Proper cleanup prevents memory leaks

## Testing

The system includes comprehensive tests:

- **metalThemes.test.ts** - Tests theme configuration and utility functions
- **useThemedNavigation.test.ts** - Tests the navigation hook functionality
- **ThemedLoader.test.tsx** - Tests the loader component behavior

## Requirements Fulfilled

This implementation satisfies all requirements from the specification:

✅ **3.1** - ThemedLoader component adapts colors based on selected metal
✅ **3.2** - Metal theme configuration maps each symbol to color scheme  
✅ **3.3** - Loading state management shows themed loaders during navigation
✅ **3.4** - Gold displays golden-colored loader
✅ **3.5** - Silver displays silver-colored loader, other metals show matching colors

## Future Enhancements

Potential improvements for future iterations:

1. **Gradient Backgrounds** - Use the gradient colors for more sophisticated backgrounds
2. **Custom Animations** - Add metal-specific animation patterns
3. **Sound Effects** - Add subtle audio feedback for different metals
4. **Haptic Feedback** - Integrate with the existing haptic system
5. **Loading Progress** - Show actual loading progress for data fetching