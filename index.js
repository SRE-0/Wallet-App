/**
 * Application entry point
 *
 * This file registers the root React component with Expo's runtime. It is
 * executed when the native runtime starts and ensures the React app is
 * properly bootstrapped in both Expo Go and standalone builds.
 */
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App)
// and performs environment setup for Expo and native runtimes.
registerRootComponent(App);
