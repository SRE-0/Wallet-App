// App.tsx

/**
 * Root application entry component.
 *
 * This file mounts the top-level navigator and is the starting
 * point for the React Native app. It should not contain heavy
 * logic — navigation and feature-level logic live in dedicated
 * modules and hooks.
 *
 * Usage: The default export `App` is used by the native runtime
 * to bootstrap the React tree.
 */
// Entrypoint shim after migrating to expo-router. The real application root now lives in `app/index.tsx`;
// exporting it here keeps legacy references working.

// re-export the new router entry. the plain import without an extension
// should resolve correctly now that the `app` directory is included in the
// TypeScript project.
export { default } from './app/index';

// NOTE: the old App implementation was removed during the migration. The
// router-controlled entry inside `app/` now takes over responsibility for
// rendering the navigation tree. The stub above ensures any legacy imports
// of `App` still resolve correctly.