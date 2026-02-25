import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

function getInitialScheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const colorScheme = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    return colorScheme;
  }

  return getInitialScheme();
}