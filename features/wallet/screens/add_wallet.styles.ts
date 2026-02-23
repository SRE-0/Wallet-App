import { StyleSheet } from "react-native";
import { spacing } from '../../../constants/spacing';
import { radius } from '../../../constants/radius';
import { typography } from '../../../constants/typography';
import { width } from "@/constants/width";

export const createStyles = (colors: any) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.background,
    },

    /**
     * Root container card for the widget
     */
    containerCard: {
        //flex: 1,
        backgroundColor: colors.surfaceContainerHigh,
        borderRadius: radius.lg,
        padding: spacing.md,
        alignSelf: "center",     
        maxWidth: 600,
        width: "90%",
    },

    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      //backgroundColor: colors.background,
    },

    rowCard: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',             // Occupy full width
        borderRadius: 12,
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.sm,
    },

    input: {
      backgroundColor: colors.secondaryContainer,
      //borderRadius: 12,
      borderTopLeftRadius: radius.md,
      borderTopRightRadius: radius.md,

      borderBottomColor: colors.onSecondaryContainer,
      borderBottomWidth: 1,

      paddingHorizontal: 16,
      paddingVertical: spacing.md,
      fontSize: 16,
      color: colors.onSecondaryContainer,
      marginLeft: spacing.md,
      flex: 1,
    },

    /**
     * Main widget title
     */
    headerTitle: {
      ...typography.h1,
      color: colors.onSurface,
      textAlign: 'center',
      marginBottom: spacing.sm,
      marginTop: spacing.lg,
    },

    /**
     * Main widget title
     */
    headerSubTitle: {
      ...typography.body,
      color: colors.onSecondaryContainer,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },

    /**
    * Icon used in the "Other Cards" row
    */
    otherCardsIcon: {
      color: colors.primary,
    },

    actionIcon: {
        color: colors.primaryContainer,
    },

    contentIcon:{
        width: width.icon_lg,
        alignItems: "center",
    },

    actionButtonText: {
        ...typography.body,
        color: colors.onPrimary,
        marginLeft: spacing.sm,
    },

    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        maxWidth: 150,

        alignSelf: 'flex-end',
        marginTop: spacing.lg,
    },

    settingButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surfaceContainerHigh,
        borderRadius: radius.md,
        padding: spacing.sm,
    },

    settingContainer: {
        marginLeft: spacing.md,
    },

    settingTitle: {
      ...typography.caption,
      color: colors.onSecondaryContainer,
      textAlign: 'left',
    },

    settingSubTitle: {
      ...typography.body,
      color: colors.onSurface,
      textAlign: 'left',
    },
  });