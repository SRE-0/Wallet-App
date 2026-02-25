/**
 * use-color-scheme (native)
 *
 * Reactive wrapper around React Native's useColorScheme hook.
 * Unlike a plain re-export, this version stores the scheme in local
 * state and listens for system-level appearance changes via the
 * Appearance API, guaranteeing a re-render whenever the user switches
 * between light and dark mode at the OS level.
 *
 * Usage:
 * import { useColorScheme } from '../hooks/use-color-scheme';
 * const scheme = useColorScheme(); // 'light' | 'dark' | null
 *
 * No parameters required. Returns the current OS color scheme.
 */
import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export function useColorScheme(): ColorSchemeName {
  // Initialize state with the current OS color scheme
  const [scheme, setScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    // Subscribe to OS-level appearance changes and update state,
    // which triggers a re-render in all consumers of this hook
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme);
    });

    // Clean up the listener when the component unmounts
    return () => subscription.remove();
  }, []);

  return scheme;
}