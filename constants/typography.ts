/**
 * Typography presets to ensure consistent font sizes and weights.
 */
// Use `as const` so that string literals (e.g. font weights) are kept as
// literal types instead of widening to generic `string`. This prevents
// the style spreading in components from generating incompatible types
// when merged with React Native's `TextStyle` expectations.
export const typography = {
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 13,
  },

  h1: {
    fontSize: 28,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
  },
} as const;
