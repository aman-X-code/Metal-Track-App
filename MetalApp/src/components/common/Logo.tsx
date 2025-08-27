/**
 * Logo Component - Reusable app logo with different sizes and variants
 * 
 * Supports different sizes and variants for consistent branding across the app.
 * Uses the metal.png asset from the assets folder.
 */
import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';
import { LogoProps, LogoAsset, LogoVariants, AssetConfig } from '../../types/logo';

// Asset configuration - using the metal.png from assets folder
const assetConfig: AssetConfig = {
  logoPath: require('../../../assets/metal.png'),
  dimensions: { width: 512, height: 512 }, // Assuming standard dimensions
};

// Logo variants configuration
const logoVariants: LogoVariants = {
  header: {
    source: assetConfig.logoPath,
    width: 32,
    height: 32,
    aspectRatio: 1,
  },
  splash: {
    source: assetConfig.logoPath,
    width: 120,
    height: 120,
    aspectRatio: 1,
  },
  icon: {
    source: assetConfig.logoPath,
    width: 24,
    height: 24,
    aspectRatio: 1,
  },
};

// Size multipliers for different size variants
const sizeMultipliers = {
  small: 0.75,
  medium: 1,
  large: 1.5,
};

export const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  variant = 'header', 
  style 
}) => {
  const baseAsset = logoVariants[variant];
  const multiplier = sizeMultipliers[size];
  
  const logoStyle: ImageStyle = {
    width: baseAsset.width * multiplier,
    height: baseAsset.height * multiplier,
    aspectRatio: baseAsset.aspectRatio,
  };

  return (
    <Image
      source={baseAsset.source}
      style={[logoStyle, style]}
      resizeMode="contain"
      testID={`logo-${variant}-${size}`}
    />
  );
};

const styles = StyleSheet.create({
  // Additional styles can be added here if needed
});

export default Logo;