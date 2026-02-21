/**
 * Material 3 color definitions for the application.
 *
 * This file contains the complete Material Design 3 color palette
 * for both light and dark themes.
 *
 * All colors are directly mapped from the official Material 3
 * CSS variable definitions to JavaScript-friendly keys.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: 'rgb(76 102 43)',
    surfaceTint: 'rgb(76 102 43)',
    onPrimary: 'rgb(255 255 255)',
    primaryContainer: 'rgb(205 237 163)',
    onPrimaryContainer: 'rgb(53 78 22)',

    secondary: 'rgb(88 98 73)',
    onSecondary: 'rgb(255 255 255)',
    secondaryContainer: 'rgb(220 231 200)',
    onSecondaryContainer: 'rgb(64 74 51)',

    tertiary: 'rgb(56 102 99)',
    onTertiary: 'rgb(255 255 255)',
    tertiaryContainer: 'rgb(188 236 231)',
    onTertiaryContainer: 'rgb(31 78 75)',

    error: 'rgb(186 26 26)',
    onError: 'rgb(255 255 255)',
    errorContainer: 'rgb(255 218 214)',
    onErrorContainer: 'rgb(147 0 10)',

    background: 'rgb(249 250 239)',
    onBackground: 'rgb(26 28 22)',

    surface: 'rgb(249 250 239)',
    onSurface: 'rgb(26 28 22)',

    surfaceVariant: 'rgb(225 228 213)',
    onSurfaceVariant: 'rgb(68 72 61)',

    outline: 'rgb(117 121 108)',
    outlineVariant: 'rgb(197 200 186)',

    shadow: 'rgb(0 0 0)',
    scrim: 'rgb(0 0 0)',

    inverseSurface: 'rgb(47 49 42)',
    inverseOnSurface: 'rgb(241 242 230)',
    inversePrimary: 'rgb(177 209 138)',

    primaryFixed: 'rgb(205 237 163)',
    onPrimaryFixed: 'rgb(16 32 0)',
    primaryFixedDim: 'rgb(177 209 138)',
    onPrimaryFixedVariant: 'rgb(53 78 22)',

    secondaryFixed: 'rgb(220 231 200)',
    onSecondaryFixed: 'rgb(21 30 11)',
    secondaryFixedDim: 'rgb(191 203 173)',
    onSecondaryFixedVariant: 'rgb(64 74 51)',

    tertiaryFixed: 'rgb(188 236 231)',
    onTertiaryFixed: 'rgb(0 32 30)',
    tertiaryFixedDim: 'rgb(160 208 203)',
    onTertiaryFixedVariant: 'rgb(31 78 75)',

    surfaceDim: 'rgb(218 219 208)',
    surfaceBright: 'rgb(249 250 239)',

    surfaceContainerLowest: 'rgb(255 255 255)',
    surfaceContainerLow: 'rgb(243 244 233)',
    surfaceContainer: 'rgb(238 239 227)',
    surfaceContainerHigh: 'rgb(232 233 222)',
    surfaceContainerHighest: 'rgb(226 227 216)',
  },

  dark: {
    primary: 'rgb(177 209 138)',
    surfaceTint: 'rgb(177 209 138)',
    onPrimary: 'rgb(31 55 1)',
    primaryContainer: 'rgb(53 78 22)',
    onPrimaryContainer: 'rgb(205 237 163)',

    secondary: 'rgb(191 203 173)',
    onSecondary: 'rgb(42 51 30)',
    secondaryContainer: 'rgb(64 74 51)',
    onSecondaryContainer: 'rgb(220 231 200)',

    tertiary: 'rgb(160 208 203)',
    onTertiary: 'rgb(0 55 53)',
    tertiaryContainer: 'rgb(31 78 75)',
    onTertiaryContainer: 'rgb(188 236 231)',

    error: 'rgb(255 180 171)',
    onError: 'rgb(105 0 5)',
    errorContainer: 'rgb(147 0 10)',
    onErrorContainer: 'rgb(255 218 214)',

    background: 'rgb(18 20 14)',
    onBackground: 'rgb(226 227 216)',

    surface: 'rgb(18 20 14)',
    onSurface: 'rgb(226 227 216)',

    surfaceVariant: 'rgb(68 72 61)',
    onSurfaceVariant: 'rgb(197 200 186)',

    outline: 'rgb(143 146 133)',
    outlineVariant: 'rgb(68 72 61)',

    shadow: 'rgb(0 0 0)',
    scrim: 'rgb(0 0 0)',

    inverseSurface: 'rgb(226 227 216)',
    inverseOnSurface: 'rgb(47 49 42)',
    inversePrimary: 'rgb(76 102 43)',

    primaryFixed: 'rgb(205 237 163)',
    onPrimaryFixed: 'rgb(16 32 0)',
    primaryFixedDim: 'rgb(177 209 138)',
    onPrimaryFixedVariant: 'rgb(53 78 22)',

    secondaryFixed: 'rgb(220 231 200)',
    onSecondaryFixed: 'rgb(21 30 11)',
    secondaryFixedDim: 'rgb(191 203 173)',
    onSecondaryFixedVariant: 'rgb(64 74 51)',

    tertiaryFixed: 'rgb(188 236 231)',
    onTertiaryFixed: 'rgb(0 32 30)',
    tertiaryFixedDim: 'rgb(160 208 203)',
    onTertiaryFixedVariant: 'rgb(31 78 75)',

    surfaceDim: 'rgb(18 20 14)',
    surfaceBright: 'rgb(56 58 50)',

    surfaceContainerLowest: 'rgb(12 15 9)',
    surfaceContainerLow: 'rgb(26 28 22)',
    surfaceContainer: 'rgb(30 32 26)',
    surfaceContainerHigh: 'rgb(40 43 36)',
    surfaceContainerHighest: 'rgb(51 54 46)',
  },
};


/**
 * Font family definitions by platform.
 *
 * These values are used to keep typography consistent
 * across iOS, Android, and web platforms.
 */
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
