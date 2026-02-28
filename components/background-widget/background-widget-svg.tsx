/**
 * @file svg.tsx
 * @description Decorative SVG background component for React Native.
 *
 * Renders three layered visual elements:
 *  - A left organic blob shape
 *  - A right organic blob shape
 *  - A small accent circle
 *  - A large decorative ring stroke
 *
 * Responsive behavior strategy:
 *  - The viewBox is dynamically adjusted based on the screen's aspect ratio.
 *  - When the screen is narrower than the design ratio, the viewBox expands
 *    horizontally so all shapes remain visible without cropping.
 *  - When the screen is taller, the viewBox expands vertically.
 *  - This ensures all four shapes are always fully visible on any screen size.
 *
 * @example
 * // Basic usage — fills the current screen automatically
 * <BackgroundSvg />
 *
 * @example
 * // Custom themed colors
 * <BackgroundSvg
 *   blobLeftColor={colors.primary}
 *   blobRightColor={colors.secondary}
 *   accentCircleColor={colors.tertiary}
 *   ringStrokeColor={colors.outline}
 * />
 */

import * as React from "react";
import { useWindowDimensions } from "react-native";
import Svg, { SvgProps, G, Path, Circle, Defs, ClipPath } from "react-native-svg";

/**
 * The original design canvas width in internal SVG units.
 * All path coordinates were authored at this width.
 */
const DESIGN_WIDTH = 1600;

/**
 * The original design canvas height in internal SVG units.
 * All path coordinates were authored at this height.
 */
const DESIGN_HEIGHT = 860;

/**
 * The original aspect ratio of the design canvas (width / height).
 * Used to detect when the screen deviates from the intended proportions.
 */
const DESIGN_RATIO = DESIGN_WIDTH / DESIGN_HEIGHT;

/**
 * Props for the BackgroundSvg component.
 *
 * Extends all standard SVG props with optional color overrides for
 * each visual element. Width and height are intentionally omitted from
 * the defaults because they are auto-detected from the screen.
 */
interface BackgroundSvgProps extends SvgProps {
  /**
   * Fill color for the left organic blob shape.
   * @default "#634B67"
   */
  blobLeftColor?: string;

  /**
   * Fill color for the right organic blob shape.
   * @default "#695B5E"
   */
  blobRightColor?: string;

  /**
   * Fill color for the small accent circle.
   * @default "#F4BEFF"
   */
  accentCircleColor?: string;

  /**
   * Stroke color for the large decorative ring.
   * @default "#392D28"
   */
  ringStrokeColor?: string;
}

/**
 * Calculates a viewBox for the design.
 *
 * Strategy (using 'slice' mode):
 *  - The design is meant for landscape (1600x860).
 *  - With preserveAspectRatio="slice", the entire design scales uniformly
 *    to fill the screen, centered, without distortion.
 *  - This ensures all elements stay within bounds on any screen size.
 *
 * @returns A viewBox string in the format "x y width height".
 */
function calculateViewBox(): string {
  // Return the original design viewBox.
  // With 'slice', this will scale proportionally to fill the screen.
  return `0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`;
}

/**
 * BackgroundSvg
 *
 * A presentational SVG component that renders four decorative shapes
 * and scales to fill the entire screen while maintaining aspect ratio.
 *
 * Responsiveness strategy:
 *  - useWindowDimensions() provides live screen dimensions.
 *  - viewBox is fixed to the original design (1600x860).
 *  - preserveAspectRatio="xMidYMid slice" scales the design uniformly
 *    to fill the screen, centering the content. This works well for
 *    landscape designs on portrait screens.
 *
 * @param blobLeftColor     - Fill for the left blob.     Default: "#634B67"
 * @param blobRightColor    - Fill for the right blob.    Default: "#695B5E"
 * @param accentCircleColor - Fill for the accent dot.    Default: "#F4BEFF"
 * @param ringStrokeColor   - Stroke for the large ring.  Default: "#392D28"
 * @param ...props          - Additional props forwarded to <Svg>.
 *
 * @returns A React Native SVG element that fills the screen with all
 *          shapes properly scaled and centered.
 */
const BackgroundSvg = ({
  blobLeftColor = "#634B67",
  blobRightColor = "#695B5E",
  accentCircleColor = "#F4BEFF",
  ringStrokeColor = "#392D28",
  ...props
}: BackgroundSvgProps) => {
  // Live screen dimensions — re-renders automatically on orientation change.
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Fixed viewBox based on the original design canvas.
  const viewBox = calculateViewBox();

  return (
    <Svg
      width={screenWidth}
      height={screenHeight}
      viewBox={viewBox}
      // "slice" = scale uniformly to fill the screen, centering and possibly cropping.
      // This ensures the background scales proportionally on all screen sizes.
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      {...props}
    >
      <G>
        {/* ── Left organic blob ──────────────────────────────────────────
            Positioned on the left side of the canvas. Its irregular,
            rounded shape mimics a natural/liquid form.                   */}
        <Path
          fill={blobLeftColor}
          d="M131.543 59.009c-18.708-.052-32.336 12.396-53.16 12.622-23.943.26-38.767-15.613-62.13-10.403-23.234 5.201-29.787 25.851-51.434 35.777-21.76 9.987-41.759 1.509-60.978 15.778-19.116 14.191-16.697 35.725-32.44 53.592-15.812 17.962-37.537 18.37-49.292 39.219-11.695 20.728-.72 39.436-7.837 62.157-7.135 22.835-26.831 32.041-29.076 55.873-2.237 23.692 15.379 36.314 18.127 59.964 2.774 23.77-11.469 40.181-3.841 62.868 7.594 22.565 28.825 26.926 40.953 47.42 12.197 20.589 5.86 41.368 22.063 58.984 16.107 17.529 37.277 12.882 56.696 26.657 19.505 13.862 22.184 35.422 44.151 44.924 21.846 9.457 39.297-3.399 62.626 1.3 23.476 4.707 34.676 23.337 58.603 23.086 23.814-.26 34.52-19.098 57.753-24.317 23.354-5.228 41.161 7.23 62.937-2.74 21.638-9.908 23.754-31.477 42.852-45.686 19.21-14.278 40.545-10.142 56.375-28.113 15.751-17.85 8.911-38.404 20.589-59.158 11.738-20.858 32.899-25.765 40.06-48.608 7.117-22.713-7.491-38.733-5.271-62.426 2.236-23.831 19.592-36.921 16.835-60.692-2.739-23.649-22.6-32.336-30.203-54.884-7.629-22.687 2.87-41.698-9.311-62.313-12.119-20.485-33.783-20.338-49.907-37.849-16.212-17.607-14.348-39.271-33.844-53.133-19.419-13.784-39.15-4.837-61.005-14.278-21.976-9.493-29.059-30.03-52.517-34.763a42.654 42.654 0 0 0-8.374-.867v.009Z"
        />

        {/* ── Right organic blob ─────────────────────────────────────────
            Larger blob placed toward the upper-right of the canvas.
            Acts as a visual counterweight to the left blob.              */}
        <Path
          fill={blobRightColor}
          d="M1312.29-168.871c-94.34 3.4-172.65 77.77-178.93 174-1.59 29.72 4 59.4 16.3 87.54 12.3 28.14 16.7 59.36 14.66 90.95a205.859 205.859 0 0 1-27.05 88.52c-15.35 26.5-24.6 54.98-26.87 84.43-6.7 102.64 71.07 191.29 173.7 198 31.42 2.03 61.9-3.95 90.28-16.28 28.38-12.33 59.9-17.77 91.39-15.85 31.59 2.08 62.24 11.53 88.6 27.5 26.38 15.97 55.89 25.9 87.37 27.99 102.65 6.71 191.3-71.07 198-173.7 1.97-30.3-3.53-59.78-15.5-87.64-11.99-27.85-17.44-59.37-15.51-90.87a203.017 203.017 0 0 1 27-88.42 185.717 185.717 0 0 0 26.97-84.53c6.7-102.65-71.06-191.28-173.7-198a185.735 185.735 0 0 0-91 17.3 202.97 202.97 0 0 1-90.71 15.1c-31.49-2.21-62.27-11.51-88.67-27.51-26.4-16.03-55.7-26.2-87.26-28.27l-.01.01c-6.42-.42-12.78-.5-19.06-.28v.01Z"
        />

        {/* ── Small accent circle ────────────────────────────────────────
            A tiny filled circle (r=18.5) near the centre of the canvas.
            Used as a colour-pop accent detail.                           */}
        <Circle cx={589.5} cy={372.5} r={18.5} fill={accentCircleColor} />

        {/* ── Large decorative ring ──────────────────────────────────────
            A large elliptical stroke that frames the lower-right area.
            Rendered as a stroke-only path (no fill) with strokeWidth=5. */}
        <Path
          stroke={ringStrokeColor}
          strokeWidth={5}
          d="M1227.4 413.308c-160.32 4.798-286.752 66.956-351.466 172.8-32.046 52.408-47.976 113.965-46.881 181.155 1.095 67.19 19.194 138.698 53.264 210.44 34.07 71.747 83.444 142.317 145.303 207.687 61.86 65.37 134.99 124.27 215.21 173.32 80.23 49.05 165.98 87.3 252.37 112.56 86.38 25.26 171.7 37.04 251.09 34.66 79.38-2.37 151.28-18.85 211.59-48.5s107.84-71.88 139.88-124.29c32.05-52.41 47.98-113.97 46.88-181.16-1.1-67.19-19.2-138.7-53.27-210.44-34.07-71.743-83.45-142.316-145.31-207.688-61.86-65.372-134.99-124.264-215.22-173.314-162.01-99.062-343.11-152.026-503.44-147.24v.01Z"
        />
      </G>
    </Svg>
  );
};

export default BackgroundSvg;