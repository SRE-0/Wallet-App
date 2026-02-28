/**
 * app.config.js
 *
 * Expo application configuration.
 * The baseUrl is set dynamically for GitHub Pages deployments so that
 * all asset paths and Expo Router routes are prefixed with /Wallet-App/.
 * In local development baseUrl is omitted and the app runs from /.
 */

export default ({ config }) => ({
  ...config,
  experiments: {
    baseUrl: process.env.NODE_ENV === "production" ? "/Wallet-App" : "",
  },
});