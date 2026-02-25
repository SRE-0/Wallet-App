import { StyleSheet } from 'react-native';
import { spacing } from '../../constants/spacing';
import { radius } from '../../constants/radius';
import { typography } from '../../constants/typography';
import { width } from '@/constants/width';

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
     * Root container card for the widget
     */
    containerCard: {
      backgroundColor: colors.surfaceContainerHigh,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginVertical: spacing.md,
      maxWidth: width.md,
    },

    /**
     * Main widget title
     */
    headerTitle: {
      ...typography.title,
      color: colors.onSurface,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },

    /**
     * Wrapper for the balance and secondary card sections
     */
    balanceSectionWrapper: {
      backgroundColor: colors.onSecondary,
      borderRadius: radius.md,
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },

    /**
     * Row showing the "Other Cards" header
     */
    otherCardsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },

    /**
     * Icon used in the "Other Cards" row
     */
    otherCardsIcon: {
      color: colors.primary,
    },

    /**
     * Text label for "Other Cards"
     */
    otherCardsText: {
      ...typography.body,
      color: colors.onSurface,
      textAlign: 'right',
    },

    /**
     * Main balance card container
     */
    balanceCard: {
      backgroundColor: colors.secondaryContainer,
      borderRadius: radius.md,
      padding: spacing.lg,
    },

    /**
     * Row containing the balance value and last transaction info
     */
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },

    /**
     * Large balance amount text
     */
    balanceAmount: {
      fontSize: 34,
      fontWeight: '500',
      color: colors.onPrimaryContainer,
      textAlign: 'left',
      flexShrink: 1,
      maxWidth: '70%',
    },

    /**
     * Small label text used for metadata
     * (e.g., Balance, Name, Last Transaction)
     */
    metaLabel: {
      ...typography.caption,
      color: colors.onSecondaryContainer,
      textAlign: 'left',
    },

    /**
     * Value text associated with metadata labels
     */
    metaValue: {
      ...typography.body,
      color: colors.onSurface,
      textAlign: 'left',
    },

    /**
     * Text displayed below the balance section
     * (e.g., exchange rate or extra info)
     */
    rateInfoText: {
      ...typography.body,
      color: colors.onSurfaceVariant,
      textAlign: 'center',
      marginVertical: spacing.md,
    },

    /**
     * Row that contains all action buttons
     */
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    /**
     * Individual action button container
     */
    actionButton_: {
      flex: 1,
      backgroundColor: colors.onSecondary,
      borderRadius: radius.sm,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginLeft: spacing.xl,
      maxWidth: 150,
    },

    /**
     * Row containing the balance value and last transaction info
     */
    balanceRow_: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    /**
     * Individual action button container
     */
    actionButton: {
      flex: 1,
      alignItems: 'center',
    },

    /**
     * Icon used inside action buttons
     */
    actionIcon: {
      color: colors.primary,
      paddingVertical: spacing.sm,
    },

    /**
     * Label text for action buttons
     */
    actionLabel: {
      ...typography.caption,
      color: colors.onSurfaceVariant,
    },

    /**
     * Label text for action buttons
     */
    actionLabelRow: {
      ...typography.caption,
      color: colors.onSurfaceVariant,
      marginLeft: spacing.sm,
    },
  });
