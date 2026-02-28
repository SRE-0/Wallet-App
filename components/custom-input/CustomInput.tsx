import React from "react";
import { View, TextInput, TextInputProps, StyleSheet, Platform } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import { useThemeColors } from "@/hooks/use-theme-color";
import { spacing } from "@/constants/spacing";
import { radius } from "@/constants/radius";
import { width } from "@/constants/width";

/**
 * CustomInput
 *
 * Reusable input component that wraps a TextInput with an optional icon on the left side.
 * Applies theme colors automatically via useThemeColors.
 *
 * On web, React Native's TextInput renders as an <input> HTML element which
 * inherits the browser's default outline on focus. This is fixed by applying
 * web-only styles conditionally using Platform.OS, keeping TypeScript happy.
 *
 * @param iconName - Optional FontAwesome6 icon name. If not provided, the icon
 *                   and its container are not rendered and take no space.
 * @param style    - Optional additional styles to override or extend the input style.
 * @param props    - All standard TextInput props (placeholder, value, onChangeText, etc.).
 */

interface CustomInputProps extends TextInputProps {
  // Name of the FontAwesome6 icon to display on the left.
  // If not provided, the icon and its container are not rendered.
  iconName?: string;
}

// Web-only styles applied conditionally to avoid TypeScript errors inside StyleSheet.create.
// outlineWidth and outlineStyle only exist in the browser DOM and are not part of
// React Native's type definitions, so they must live outside StyleSheet.create.
const webInputFix = Platform.OS === "web" ? ({ outlineWidth: 0, outlineStyle: "none" } as any) : {};

export const CustomInput: React.FC<CustomInputProps> = ({ iconName, style, ...props }) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.rowCard}>
      {/* Only render the icon container when an iconName is provided */}
      {iconName && (
        <View style={styles.contentIcon}>
          <FontAwesome6
            style={styles.icon}
            name={iconName}
            size={width.icon_md}
          />
        </View>
      )}

      {/* When no icon is present, remove the left margin so the input fills the full row */}
      <TextInput
        style={[styles.input, !iconName && styles.inputNoIcon, webInputFix, style]}
        placeholderTextColor={colors.onBackground}
        {...props}
      />
    </View>
  );
};

/**
 * createStyles
 *
 * Generates component styles using the current theme colors.
 *
 * @param colors - Theme color object from useThemeColors.
 */
const createStyles = (colors: any) =>
  StyleSheet.create({
    rowCard: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "auto",
      borderRadius: 12,
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.sm,
    },

    contentIcon: {
      width: width.icon_lg,
      alignItems: "center",
    },

    icon: {
      color: colors.primary,
    },

    input: {
      backgroundColor: colors.secondaryContainer,
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

    // Overrides the left margin when no icon is present,
    // allowing the input to occupy the full width of the row.
    inputNoIcon: {
      marginLeft: 0,
    },
  });