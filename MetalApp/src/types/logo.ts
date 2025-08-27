/**
 * Logo component type definitions
 */
import { ImageStyle, ImageSourcePropType } from 'react-native';

export interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'header' | 'splash' | 'icon';
  style?: ImageStyle;
}

export interface LogoAsset {
  source: ImageSourcePropType;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface LogoVariants {
  header: LogoAsset;
  splash: LogoAsset;
  icon: LogoAsset;
}

export interface AssetConfig {
  logoPath: ImageSourcePropType;
  dimensions: { width: number; height: number };
}

export type LogoSize = 'small' | 'medium' | 'large';
export type LogoVariant = 'header' | 'splash' | 'icon';