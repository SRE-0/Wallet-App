import { StyleSheet } from 'react-native';

/**
 * createMainStyles
 *
 * Centralized styles for the `Main` component. Extracting styles into
 * a separate module improves readability and makes the component easier
 * to test and maintain.
 *
 * @param colors - Theme color palette returned by `useThemeColors()`
 */
export const createMainStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },

    card_background: {
      backgroundColor: colors.surfaceContainer,
      height: '90%',
      width: '100%',
      borderRadius: 24,
    },

    button: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 12,
      marginVertical: 16,
      alignItems: 'center',
    },

    buttonText: {
      color: colors.onPrimary,
      fontWeight: '600',
    },

    image: {
      width: 120,
      height: 100,
      marginVertical: 12,
      borderRadius: 8,
    },
  });
