import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

/**
 * Returns the correct color palette based on system theme.
 */
export function useThemeColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.light : Colors.dark;
}
