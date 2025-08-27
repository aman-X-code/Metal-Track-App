# GlassCard Component

A reusable React Native component that provides glassmorphism effects with modern styling and smooth press animations optimized for 120Hz displays.

## Features

- **Glassmorphism Effects**: Subtle transparency and blur effects for modern UI
- **Multiple Variants**: Default, elevated, outlined, and filled styles
- **Flexible Sizing**: Small, medium, and large size options
- **Press Animations**: Smooth scale and glow effects with haptic feedback
- **Customizable**: Custom colors, borders, and styling options
- **Accessibility**: Full accessibility support with proper ARIA attributes
- **Performance**: Optimized for 120Hz displays with React Native Reanimated

## Installation

The component is already included in the project. Import it from the common components:

```typescript
import { GlassCard } from '../components/common';
// or
import { GlassCard } from '../components/common/GlassCard';
```

## Basic Usage

```tsx
import React from 'react';
import { Text } from 'react-native';
import { GlassCard } from '../components/common';

const MyComponent = () => {
  return (
    <GlassCard onPress={() => console.log('Pressed!')}>
      <Text>Hello World</Text>
    </GlassCard>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Content to render inside the card |
| `style` | `ViewStyle` | - | Custom styles to apply to the card |
| `variant` | `'default' \| 'elevated' \| 'outlined' \| 'filled'` | `'default'` | Visual variant of the card |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the card |
| `glowColor` | `string` | `colors.neon.green` | Color for the glow effect |
| `borderColor` | `string` | - | Custom border color |
| `pressable` | `boolean` | `true` | Whether the card should be pressable |
| `pressScale` | `number` | `scales.card` | Scale factor for press animation |
| `animationDuration` | `number` | `durations.tap` | Duration of press animations |
| `blurIntensity` | `'light' \| 'medium' \| 'heavy'` | `'medium'` | Intensity of the blur effect |

All standard `PressableProps` are also supported when `pressable` is `true`.

## Variants

### Default
Basic glassmorphism effect with subtle transparency and border.

```tsx
<GlassCard variant="default">
  <Text>Default Card</Text>
</GlassCard>
```

### Elevated
Enhanced shadow and elevation for prominent elements.

```tsx
<GlassCard variant="elevated">
  <Text>Elevated Card</Text>
</GlassCard>
```

### Outlined
Transparent background with prominent border.

```tsx
<GlassCard variant="outlined">
  <Text>Outlined Card</Text>
</GlassCard>
```

### Filled
Solid background for high contrast content.

```tsx
<GlassCard variant="filled">
  <Text>Filled Card</Text>
</GlassCard>
```

## Sizes

### Small
Compact size for secondary content.

```tsx
<GlassCard size="small">
  <Text>Small Card</Text>
</GlassCard>
```

### Medium (Default)
Standard size for most use cases.

```tsx
<GlassCard size="medium">
  <Text>Medium Card</Text>
</GlassCard>
```

### Large
Spacious size for primary content.

```tsx
<GlassCard size="large">
  <Text>Large Card</Text>
</GlassCard>
```

## Customization

### Custom Colors

```tsx
<GlassCard 
  glowColor="#FF6B35" 
  borderColor="#00D4AA"
  variant="outlined"
>
  <Text>Custom Colors</Text>
</GlassCard>
```

### Custom Animations

```tsx
<GlassCard 
  pressScale={0.9}
  animationDuration={300}
>
  <Text>Custom Animation</Text>
</GlassCard>
```

### Non-Pressable Card

```tsx
<GlassCard pressable={false}>
  <Text>Static Card</Text>
</GlassCard>
```

## Accessibility

The component supports all standard accessibility props:

```tsx
<GlassCard
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Metal price card"
  accessibilityHint="Tap to view detailed price information"
>
  <Text>Accessible Card</Text>
</GlassCard>
```

## Performance Considerations

- The component uses React Native Reanimated v3 for optimal performance
- Animations run on the native thread for 120Hz displays
- Use `React.memo` for expensive child components
- Consider using `pressable={false}` for static cards to reduce overhead

## Design System Integration

The component integrates with the app's design system:

- Uses colors from `constants/colors.ts`
- Follows typography from `constants/typography.ts`
- Implements animations from `constants/animations.ts`

## Examples

### Metal Price Tile

```tsx
<GlassCard 
  variant="elevated"
  size="medium"
  onPress={() => navigateToDetails(metal)}
  accessibilityLabel={`${metal.name} price card`}
>
  <View style={styles.metalTile}>
    <Text style={styles.metalName}>{metal.name}</Text>
    <Text style={styles.price}>{formatPrice(metal.price)}</Text>
    <Text style={styles.change}>{metal.changePercent}%</Text>
  </View>
</GlassCard>
```

### Settings Card

```tsx
<GlassCard 
  variant="outlined"
  size="large"
  pressable={false}
>
  <View style={styles.settingsCard}>
    <Text style={styles.title}>App Settings</Text>
    <Switch value={darkMode} onValueChange={setDarkMode} />
  </View>
</GlassCard>
```

## Testing

The component includes comprehensive tests covering:

- Rendering with different props
- Variant and size styling
- Press interactions
- Accessibility features
- Error handling

Run tests with:

```bash
npm test -- GlassCard.test.tsx
```

## Troubleshooting

### Animation Issues
If animations appear choppy:
- Ensure React Native Reanimated v3 is properly configured
- Check that `useNativeDriver` is enabled
- Verify 120Hz display support on the device

### Styling Issues
If glassmorphism effects don't appear:
- Check that the parent container has a background
- Verify backdrop blur support on the platform
- Ensure proper z-index layering

### Performance Issues
If the component causes performance problems:
- Use `pressable={false}` for static cards
- Implement `React.memo` for expensive children
- Consider reducing animation complexity for lower-end devices