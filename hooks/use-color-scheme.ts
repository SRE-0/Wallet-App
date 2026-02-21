/**
 * use-color-scheme proxy
 *
 * This file re-exports React Native's `useColorScheme` hook so the
 * import path can be platform-swapped (for example a web-specific
 * implementation exists at `use-color-scheme.web.ts`).
 *
 * Usage:
 * import { useColorScheme } from '../hooks/use-color-scheme';
 * const scheme = useColorScheme(); // 'light' | 'dark' | null
 *
 * No parameters are required. Returns the OS color scheme.
 */
export { useColorScheme } from 'react-native';
