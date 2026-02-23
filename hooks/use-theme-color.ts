/**
 * useThemeColors
 *
 * Returns the active color palette from `../constants/theme` based on the
 * operating system color scheme.
 *
 * Usage:
 * const colors = useThemeColors();
 *
 * @returns Color palette object (light or dark)
 */
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

export function useThemeColors() {
  const scheme = useColorScheme();
  // If the system is in dark mode, return the dark palette; otherwise return light.
  return scheme === 'dark' ? Colors.light : Colors.dark;
}
