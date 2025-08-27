# 🥇 Metals Tracker - React Native App

> A modern React Native application for tracking real-time precious metals prices with smooth animations and clean user interface.

## 📱 **App Overview**

The **Precious Metals Tracker** provides real-time price tracking for Gold (XAU), Silver (XAG), Platinum (XPT), and Palladium (XPD) with a focus on performance and user experience.

## 📝 **Recent Updates**

### v2.0 - Simplified Navigation (Latest)
- **Removed Themed Loading System**: Eliminated complex loading animations for faster, more direct navigation
- **Improved Performance**: Reduced complexity by removing unused themed loading infrastructure
- **Cleaner Codebase**: Streamlined components and removed unnecessary files
- **Immediate Response**: Metal cards now respond instantly when tapped

### ✨ **Key Features**

- 🔄 **Real-time Price Tracking** - Live precious metals prices with automatic updates
- 📊 **Interactive Charts** - Historical price data with multiple timeframes
- 💎 **24k Gold Pricing** - Specialized 24k gold price per gram display
- 🎯 **Smooth Animations** - Optimized animations with React Native Reanimated
- 📱 **Haptic Feedback** - Context-aware haptic responses
- ♿ **Accessibility Support** - Screen reader and reduce motion compliance
- 🚀 **Performance Optimized** - Memoization and efficient state management
- 🎨 **Clean UI/UX** - Dark theme with intuitive navigation
- 🔒 **Type Safety** - Full TypeScript implementation

---

## 🏗️ **Architecture & Technical Highlights**

### **Performance Engineering**

- **Optimized Scrolling** with `scrollEventThrottle={1}`
- **Memoization** using `useMemo`, `useCallback`, and `memo`
- **FlatList Optimization** with `removeClippedSubviews` and batch rendering
- **Smooth Animations** using React Native Reanimated

### **State Management**

- **React Context + useReducer** for predictable state updates
- **Performance-optimized** to prevent unnecessary re-renders
- **API caching** for improved performance
- **Immediate navigation** without loading delays

### **Animation System**

- **React Native Reanimated** for smooth animations
- **Spring physics** for natural transitions
- **Gesture integration** with React Native Gesture Handler

### **Code Quality**

- **TypeScript strict mode** with comprehensive type definitions
- **ESLint + Prettier** for consistent code formatting
- **Modular component architecture**

---

## 🚀 **Quick Start Guide**

### **Prerequisites**

Ensure you have the following installed:

- **Node.js** (≥18.0.0) - [Download](https://nodejs.org/)
- **React Native CLI** - `npm install -g @react-native-community/cli`
- **Android Studio** - [Download](https://developer.android.com/studio) (for Android development)
- **Xcode** - [Download](https://developer.apple.com/xcode/) (for iOS development, macOS only)

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/aman-X-code/precious-metals-tracker.git
   cd precious-metals-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)

   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Start Metro Bundler**

   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run the application**

   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios
   ```

### **Development Scripts**

```bash
# Development
npm start                    # Start Metro bundler
npm run android             # Run on Android device/emulator
npm run ios                 # Run on iOS device/simulator
npm run reset               # Reset Metro cache

# Testing
npm test                    # Run all tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Generate coverage report
npm run test:unit           # Run unit tests only
npm run test:integration    # Run integration tests
npm run test:e2e           # Run end-to-end tests
npm run test:performance   # Run performance tests

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix          # Fix ESLint issues
npm run type-check        # TypeScript type checking

# Build & Release
npm run build:android      # Build Android APK
npm run build:ios         # Build iOS archive
npm run clean             # Clean build artifacts
```

---

## 📁 **Project Structure**

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Logo, LoadingSpinner, ErrorBoundary)
│   ├── home/            # Home screen components (MetalTile)
│   ├── details/         # Details screen components (PriceChart)
│   └── splash/          # Splash screen components
├── constants/           # App constants and configuration
│   ├── colors.ts        # Color theme definitions
│   └── metals.ts        # Metal symbols and configuration
├── context/             # React Context providers
│   ├── MetalsContext.tsx    # Global metals state management
│   ├── AccessibilityContext.tsx # Accessibility settings
│   └── index.ts         # Context exports
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx     # Main navigation container
│   ├── navigationConfig.ts  # Navigation configuration
│   └── navigationState.ts   # Navigation utilities
├── screens/             # Screen components
│   ├── HomeScreen.tsx       # Main metals listing screen
│   └── DetailsScreen.tsx    # Individual metal details
├── services/            # API and data services
│   └── goldApi.ts       # Metals price API service
├── types/               # TypeScript type definitions
│   ├── metals.ts        # Core app types
│   ├── navigation.ts    # Navigation types
│   └── logo.ts          # Component types
└── utils/               # Utility functions
    ├── formatters.ts        # Data formatting utilities
    ├── hapticFeedback.ts    # Haptic feedback functions
    └── splashScreenUtils.ts # Splash screen utilities
```

---

## 🔧 **Key Technologies & Libraries**

### **Core Framework**

- **React Native 0.81.0** - Cross-platform mobile development
- **TypeScript 5.8.3** - Type safety and developer experience
- **React 19.1.0** - Latest React features and optimizations

### **Navigation & UI**

- **@react-navigation/native** - Navigation framework
- **@react-navigation/stack** - Stack navigator
- **react-native-safe-area-context** - Safe area handling
- **lucide-react-native** - Modern icon library

### **Animations & Gestures**

- **react-native-reanimated** - High-performance animations
- **react-native-gesture-handler** - Advanced gesture recognition
- **react-native-haptic-feedback** - Haptic feedback integration

### **Development & Testing**

- **@testing-library/react-native** - Component testing
- **jest** - Testing framework
- **eslint** - Code linting
- **prettier** - Code formatting

---

## 🎨 **Component Architecture**

### **Core Components**

- **MetalTile**: Interactive cards displaying metal prices with immediate navigation
- **PriceChart**: Historical price visualization with multiple timeframes  
- **HomeScreen**: Main screen with horizontal scrolling metal tiles
- **DetailsScreen**: Detailed view with charts and market data

### **State Management**

- **React Context + useReducer** for global state management
- **Memoized selectors** to prevent unnecessary re-renders
- **API caching** for improved performance

---

## 📊 **Performance Optimizations**

### **FlatList Optimization**

```typescript
<FlatList
  data={metalsData}
  keyExtractor={item => item.id}
  horizontal
  // Performance optimizations
  scrollEventThrottle={1} // 120Hz smooth scrolling
  removeClippedSubviews={true} // Memory management
  maxToRenderPerBatch={2} // Batch rendering
  windowSize={3} // Viewport management
  initialNumToRender={2} // Initial render optimization
  getItemLayout={getItemLayout} // Skip measurement phase
/>
```

### **Animation Performance**

```typescript
// UI thread animations with worklets
const handlePressIn = useCallback(() => {
  'worklet';
  scale.value = withSpring(0.96);
}, [scale]);

// Shared values for smooth animations
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));
```

### **Memoization Strategy**

```typescript
// Component memoization
export const MetalTile = memo(MetalTileComponent);

// Value memoization for expensive calculations
const chartData = useMemo(
  () =>
    historicalData?.map((point, index) => ({
      x: index,
      y: point.price,
    })),
  [historicalData],
);

// Function memoization to prevent re-renders
const handlePress = useCallback(
  (metal: MetalData) => {
    navigation.navigate('Details', { metalId: metal.id });
  },
  [navigation],
);
```

---

## 🧪 **Testing Strategy**

### **Test Coverage**

- **Unit Tests** - Component logic and utility functions
- **Integration Tests** - API integration and context interactions
- **Performance Tests** - Animation performance and memory usage
- **E2E Tests** - Complete user workflows

### **Running Tests**

```bash
npm test                    # Run all tests
npm run test:coverage      # Run with coverage
npm run lint              # Run ESLint
```

---

## ♿ **Accessibility Features**

- **Screen Reader Support**: Full VoiceOver/TalkBack compatibility
- **Reduce Motion**: Respects system accessibility settings
- **High Contrast**: Optimized color schemes for visibility

---

## 🔒 **Type Safety**

Full TypeScript implementation with strict type checking for:
- Metal price data structures
- Navigation parameters
- Component props and state
- API responses and error handling

---

## 🚨 **Troubleshooting**

### **Common Issues**

```bash
# Clear Metro cache
npm run reset

# iOS: Clean and reinstall pods
cd ios && rm -rf Pods Podfile.lock && bundle exec pod install && cd ..

# Android: Clean build
cd android && ./gradlew clean && cd .. && npm run android
```

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Aman Khanna**

- GitHub: [@yourusername](https://github.com/aman-X-code)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/aman-khanna-82715b200/)

---

## 📱 **Screenshots**

| Home Screen                   | Details Screen                      | Price Charts                      |
| ----------------------------- | ----------------------------------- | --------------------------------- |
| ![Home](screenshots/home.png) | ![Details](screenshots/details.png) | ![Charts](screenshots/charts.png) |
