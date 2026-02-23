/**
 * LoginScreen Styles
 *
 * Creates a theme-aware style sheet for the login screen.
 * Colors are injected dynamically from the global theme.
 */

import { radius } from "@/constants/radius";
import { spacing } from "@/constants/spacing";
import { StyleSheet } from "react-native";
import { typography } from '../../../constants/typography';

export const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      //backgroundColor: colors.background,
    },

    card: {
        //flex: 1,
        backgroundColor: colors.surfaceContainerHigh,
        borderRadius: radius.lg,
        padding: spacing.md,
        alignSelf: "center",     
        maxWidth: 600,
        width: "90%",
    },

    title: {
      ...typography.h1,
      color: colors.onSurface,
      textAlign: 'center',
      marginBottom: spacing.sm,
      marginTop: spacing.lg,
    },

    subtitle: {
      ...typography.body,
      color: colors.onSecondaryContainer,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },

    input: {
      backgroundColor: colors.secondaryContainer,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.onSurface,
      marginBottom: 14,
    },

    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 8,
    },

    primaryButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "600",
    },

    googleButton: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 12,
    },

    googleButtonText: {
      color: colors.onSurface,
      fontSize: 15,
      fontWeight: "500",
    },

    toggleText: {
      marginTop: 18,
      textAlign: "center",
      color: colors.primary,
      fontSize: 14,
      fontWeight: "500",
    },
  });