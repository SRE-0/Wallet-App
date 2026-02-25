import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import BackgroundSvg from "./background-widget-svg";
import { useThemeColors } from "../../hooks/use-theme-color";

interface BackgroundWidgetProps {
  /**
   * Content rendered on top of the SVG background.
   */
  children?: React.ReactNode;
  /**
   * Optional extra styles for the root container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Opacity of the SVG background layer (0–1). Default: 0.18
   *
   * Keep it low so overlaid content stays readable.
   */
  backgroundOpacity?: number;
  /**
   * Override the solid background color behind the SVG.
   * Falls back to `colors.background` from the active theme.
   */
  backgroundColor?: string;
  /**
   * Override blob / ring colors individually. When omitted the
   * widget derives sensible values from the active theme palette.
   */
  blobLeftColor?: string;
  blobRightColor?: string;
  accentCircleColor?: string;
  ringStrokeColor?: string;
}

/**
 * BackgroundWidget
 *
 * A full-size container that renders the decorative SVG as an
 * absolutely-positioned background layer. Drop any screen content
 * inside as `children` and the SVG will sit behind it.
 *
 * ### Basic usage (wrap a whole screen)
 * ```tsx
 * export default function HomeScreen() {
 *   return (
 *     <BackgroundWidget style={styles.screen}>
 *       <BalanceWidget userId={uid} cardId={cid} />
 *     </BackgroundWidget>
 *   );
 * }
 * ```
 *
 * ### Customise colours
 * ```tsx
 * <BackgroundWidget
 *   backgroundOpacity={0.25}
 *   blobLeftColor={colors.primaryContainer}
 *   ringStrokeColor={colors.outline}
 * >
 *   {children}
 * </BackgroundWidget>
 * ```
 */
export function BackgroundWidget({
  children,
  style,
  backgroundOpacity = 0.18,
  backgroundColor,
  blobLeftColor,
  blobRightColor,
  accentCircleColor,
  ringStrokeColor,
}: BackgroundWidgetProps) {
  const colors = useThemeColors();

  // Derive default colours from the theme when not overridden
  const resolvedBlobLeft = blobLeftColor ?? colors.primary;
  const resolvedBlobRight = blobRightColor ?? colors.secondary;
  const resolvedAccent = accentCircleColor ?? colors.tertiary ?? colors.primaryContainer;
  const resolvedRing = ringStrokeColor ?? colors.outline ?? colors.onSurface;
  const resolvedBg = backgroundColor ?? colors.background;

  return (
    <View style={[styles.root, { backgroundColor: resolvedBg }, style]}>
      {/* ── SVG background ── */}
      <View style={[styles.svgLayer, { opacity: backgroundOpacity }]} pointerEvents="none">
        <BackgroundSvg
          // Fill the container while preserving aspect-ratio cropping
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          blobLeftColor={resolvedBlobLeft}
          blobRightColor={resolvedBlobRight}
          accentCircleColor={resolvedAccent}
          ringStrokeColor={resolvedRing}
        />
      </View>

      {/* ── Foreground content ── */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  svgLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});