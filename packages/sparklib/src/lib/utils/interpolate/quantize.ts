/**
 * Returns n uniformly-spaced samples from the specified interpolator.
 *
 * The first sample is always at t = 0, and the last sample is always at t = 1.
 * This can be useful in generating a fixed number of samples from a given interpolator,
 * such as to derive the range of a quantize scale from a continuous interpolator.
 *
 * @param interpolator - Function that takes parameter t ∈ [0, 1] and returns interpolated value
 * @param n - Number of samples to generate (must be integer greater than 1)
 * @returns Array of n interpolated values
 *
 * @example
 * ```typescript
 * // Generate 4 color samples from red to blue
 * const colorInterpolator = interpolateRgbBasis(['red', 'blue']);
 * const colorSamples = quantize(colorInterpolator, 4);
 * // Result: ['rgb(255, 0, 0)', 'rgb(170, 0, 85)', 'rgb(85, 0, 170)', 'rgb(0, 0, 255)']
 *
 * // Generate number samples
 * const numberInterpolator = (t: number) => t * 100;
 * const numberSamples = quantize(numberInterpolator, 5);
 * // Result: [0, 25, 50, 75, 100]
 *
 * // Works with any interpolator return type
 * const stringInterpolator = (t: number) => `value-${Math.round(t * 10)}`;
 * const stringSamples = quantize(stringInterpolator, 3);
 * // Result: ['value-0', 'value-5', 'value-10']
 * ```
 *
 * @throws Will not throw but behavior undefined for n < 2
 */
export function quantize<T>(interpolator: (t: number) => T, n: number): T[] {
  const samples = new Array<T>(n);
  for (let i = 0; i < n; i++) {
    samples[i] = interpolator(i / (n - 1));
  }
  return samples;
}
