import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { Main } from './components/main';

/**
 * Root application component.
 * Integrates theme colors directly into styles via a style factory.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}