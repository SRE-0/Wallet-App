import { StyleSheet } from 'react-native';
import { spacing } from '../../constants/spacing';
import { radius } from '../../constants/radius';
import { typography } from '../../constants/typography';

/**
 * createStyles
 *
 * Generates a themed StyleSheet for the BalanceWidget component.
 *
 * @param colors Active theme color palette
 * @returns StyleSheet object with all widget styles
 */
export const createStyles = (colors) =>
  StyleSheet.create({

    /**
     * Icon used in the "Other Cards" row
     */
    otherCardsIcon: {
      color: colors.primary,
    },

    /**
     * Root container card for the widget
     */
    containerCard: {
      backgroundColor: colors.surfaceContainerHigh,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: radius.lg,
      padding: spacing.md,
      marginVertical: spacing.xs,
      maxWidth: 600,
    },

    leftContainerCard: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconContainerCard: {
        backgroundColor: colors.secondaryContainer,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
        padding: spacing.lg,
        marginRight: spacing.md,
    },

    /**
     * Text displayed below the balance section
     * (e.g., exchange rate or extra info)
     */
    nameTransaction: {
      ...typography.title,
      color: colors.onSurface,
      textAlign: 'left',
    },

    /**
     * Small label text used for metadata
     * (e.g., Balance, Name, Last Transaction)
     */
    bodyText: {
      ...typography.caption,
      color: colors.onSecondaryContainer,
      textAlign: 'left',
    },
  });

/**
 * createListStyles
 *
 * Styles specific to the transactions list widget. Kept alongside the
 * TransactionItem styles so both components share a single style module.
 *
 * @param colors - Theme color palette
 */
export const createListStyles = (colors: any) =>
  StyleSheet.create({
    contentContainer: {
      paddingHorizontal: 24,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
  });
