/**
 * Navigation type definitions
 */

import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Details: { metalId: string };
};

export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type DetailsScreenProps = StackScreenProps<RootStackParamList, 'Details'>;