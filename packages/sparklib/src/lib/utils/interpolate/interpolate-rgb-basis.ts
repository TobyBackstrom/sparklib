/**
 * High-performance implementation of D3's interpolateRgbBasis for RGB color interpolation.
 * Creates smooth color transitions through multiple colors using B-spline interpolation.
 *
 * Based on D3's uniform nonrational B-spline interpolation algorithm but optimized
 * for performance with fast color parsing and minimal allocations.
 */

import { NAMED_COLORS } from './named-colors';
import { RgbColor } from './rgb-color';

/**
 * Fast color parsing with zero DOM manipulation.
 * Supports hex (#rgb, #rrggbb), rgb(r,g,b), rgba(r,g,b,a), and named colors.
 *
 * @param color - A CSS color string
 * @returns RGB color object with r, g, b values in range 0-255
 *
 * @example
 * ```typescript
 * parseColor('#ff0000')           // { r: 255, g: 0, b: 0 }
 * parseColor('#f00')              // { r: 255, g: 0, b: 0 }
 * parseColor('red')               // { r: 255, g: 0, b: 0 }
 * parseColor('rgb(255, 128, 0)')  // { r: 255, g: 128, b: 0 }
 * ```
 */
function parseColor(color: string): RgbColor {
  const trimmed = color.trim().toLowerCase();

  // Named color lookup
  const namedColor = NAMED_COLORS[trimmed];
  if (namedColor) {
    return namedColor;
  }

  // Hex color parsing (#rgb or #rrggbb)
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);

    if (hex.length === 3) {
      // #rgb format
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return { r: r || 0, g: g || 0, b: b || 0 };
    }

    if (hex.length === 6) {
      // #rrggbb format
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r: r || 0, g: g || 0, b: b || 0 };
    }
  }

  // RGB/RGBA function parsing: rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: Math.max(0, Math.min(255, parseInt(rgbMatch[1], 10))),
      g: Math.max(0, Math.min(255, parseInt(rgbMatch[2], 10))),
      b: Math.max(0, Math.min(255, parseInt(rgbMatch[3], 10))),
    };
  }

  // Fallback to black for unrecognized colors
  return { r: 0, g: 0, b: 0 };
}

/**
 * Cubic uniform nonrational B-spline basis function.
 *
 * This implements the mathematical core of B-spline interpolation using four control points.
 * The function provides C² continuity for smooth transitions.
 *
 * @param t - Parameter value in range [0, 1] within the current segment
 * @param v0 - First control point value
 * @param v1 - Second control point value (segment start)
 * @param v2 - Third control point value (segment end)
 * @param v3 - Fourth control point value
 * @returns Interpolated value at parameter t
 */
function basis(
  t: number,
  v0: number,
  v1: number,
  v2: number,
  v3: number,
): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    ((1 - 3 * t + 3 * t2 - t3) * v0 +
      (4 - 6 * t2 + 3 * t3) * v1 +
      (1 + 3 * t + 3 * t2 - 3 * t3) * v2 +
      t3 * v3) /
    6
  );
}

/**
 * Creates a B-spline interpolator for an array of numeric values.
 * Pre-computes values for maximum runtime performance.
 *
 * @param values - Array of numeric values to interpolate between
 * @returns Function that interpolates values for parameter t in [0, 1]
 */
function createBasisInterpolator(
  values: readonly number[],
): (t: number) => number {
  const n = values.length - 1;

  // Pre-compute boundary control points for performance
  const extendedValues = new Array(values.length + 2);
  extendedValues[0] = 2 * values[0] - values[1]; // v0 for first segment
  for (let i = 0; i < values.length; i++) {
    extendedValues[i + 1] = values[i];
  }
  extendedValues[values.length + 1] =
    2 * values[values.length - 1] - values[values.length - 2]; // v3 for last segment

  return function (t: number): number {
    // Clamp t to [0, 1] and determine the current segment
    const clampedT = Math.max(0, Math.min(1, t));
    const i = clampedT >= 1 ? n - 1 : Math.floor(clampedT * n);

    // Get pre-computed control points
    const v0 = extendedValues[i];
    const v1 = extendedValues[i + 1];
    const v2 = extendedValues[i + 2];
    const v3 = extendedValues[i + 3];

    // Calculate local parameter within the current segment
    const localT = (clampedT - i / n) * n;

    return basis(localT, v0, v1, v2, v3);
  };
}

/**
 * Creates a uniform nonrational B-spline interpolator through an array of colors.
 *
 * This function provides smooth color transitions with C² continuity, making it ideal
 * for creating color scales and gradients. The interpolator returns the first color
 * at t=0 and the last color at t=1, with smooth B-spline interpolation between all colors.
 *
 * Optimized for performance with:
 * - Fast color parsing without DOM manipulation
 * - Pre-computed interpolation values
 * - Minimal memory allocations during runtime
 *
 * @param colors - Array of CSS color strings (hex, named colors, rgb(), etc.)
 * @returns Interpolation function that takes parameter t ∈ [0, 1] and returns RGB color string
 *
 * @example
 * ```typescript
 * // Basic usage with named colors
 * const interpolator = interpolateRgbBasis(['red', 'yellow', 'green', 'blue']);
 * interpolator(0);    // 'rgb(255, 0, 0)' (red)
 * interpolator(0.5);  // smooth color between yellow and green
 * interpolator(1);    // 'rgb(0, 0, 255)' (blue)
 *
 * // Usage with hex colors
 * const grayScale = interpolateRgbBasis(['#ffffff', '#d9d9d9', '#525252', '#000000']);
 * grayScale(0.25); // light gray
 * ```
 *
 * @throws Will not throw but returns black rgb(0,0,0) for invalid color strings
 */
export function interpolateRgbBasis(
  colors: readonly string[],
): (t: number) => string {
  if (colors.length === 0) {
    // Mimic D3's behavior - it will fail when trying to parse colors
    throw new TypeError(
      "Cannot set properties of undefined (setting 'opacity')",
    );
  }

  //   if (colors.length === 1) {
  //     const singleColor = parseColor(colors[0]);
  //     const colorString = `rgb(${singleColor.r}, ${singleColor.g}, ${singleColor.b})`;
  //     return () => colorString; // Cache the result
  //   }

  if (colors.length === 1) {
    // Mimic D3's behavior - single color returns black
    return () => 'rgb(0, 0, 0)';
  }

  // Parse all colors once at creation time (not during interpolation)
  const rgbColors = colors.map(parseColor);
  const rValues = rgbColors.map((color) => color.r);
  const gValues = rgbColors.map((color) => color.g);
  const bValues = rgbColors.map((color) => color.b);

  // Create B-spline interpolators for each color channel (pre-computes values)
  const rInterpolator = createBasisInterpolator(rValues);
  const gInterpolator = createBasisInterpolator(gValues);
  const bInterpolator = createBasisInterpolator(bValues);

  return function (t: number): string {
    // Interpolate each channel and clamp to valid RGB range [0, 255]
    const r = Math.max(0, Math.min(255, Math.round(rInterpolator(t))));
    const g = Math.max(0, Math.min(255, Math.round(gInterpolator(t))));
    const b = Math.max(0, Math.min(255, Math.round(bInterpolator(t))));

    return `rgb(${r}, ${g}, ${b})`;
  };
}
