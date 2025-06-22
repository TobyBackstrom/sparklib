import { Range } from '../models';
import { interpolateRgbBasis, quantize } from './interpolate';
import { scaleQuantize } from './scale';

/**
 * Creates a quantize color scale with caching for improved performance.
 *
 * This function generates a discrete color scale that maps numeric values from a specified
 * domain to colors interpolated from the provided color array. The scale divides the input
 * domain into equally-sized segments, each corresponding to a discrete color level.
 *
 * **Performance optimization:** Results are cached based on input parameters. Subsequent
 * calls with identical parameters return the cached scale function, providing performance
 * improvements for repeated usage patterns.
 *
 * @param domain - A tuple `[min, max]` representing the range of input values.
 *                 The minimum value must be less than the maximum value.
 * @param colors - An array of CSS color strings used for interpolation.
 *                 Supports hex colors (#rgb, #rrggbb), named colors (red, blue),
 *                 and rgb/rgba function notation. Must contain at least one color.
 * @param numColorLevels - The number of discrete color levels to generate.
 *                         Must be a positive integer. The input domain is divided
 *                         into this many equally-sized sections.
 *
 * @returns A scale function that maps numeric values to color strings.
 *          Values outside the domain are clamped to the nearest boundary.
 *
 * @throws {Error} When domain is invalid (min >= max)
 * @throws {Error} When colors array is empty
 * @throws {Error} When numColorLevels is not a positive integer
 *
 * @example
 * ```typescript
 * // Basic usage
 * const scale = createGradientColorScale(
 *   [0, 100],
 *   ['#blue', '#white', '#red'],
 *   10
 * );
 *
 * scale(0);   // Returns blue
 * scale(50);  // Returns white
 * scale(100); // Returns red
 *
 * // Using hex colors for a grayscale
 * const grayScale = createGradientColorScale(
 *   [-10, 10],
 *   ['#000000', '#ffffff'],
 *   5
 * );
 *
 * // High-performance usage (benefits from caching)
 * for (let i = 0; i < 1000; i++) {
 *   const scale = createGradientColorScale([0, 100], ['red', 'blue'], 20);
 *   // Subsequent calls return cached result instantly
 * }
 * ```
 *
 * @see {@link interpolateRgbBasis} for color interpolation details
 * @see {@link quantize} for discrete sampling
 * @see {@link scaleQuantize} for the underlying scale implementation
 */
export function createGradientColorScale(
  domain: Range,
  colors: readonly string[],
  numColorLevels: number,
): (value: number) => string {
  if (domain[0] >= domain[1]) {
    throw new Error(
      `Invalid domain: max (${domain[1]}) must be greater than min (${domain[0]})`,
    );
  }

  if (colors.length === 0) {
    throw new Error('Colors array cannot be empty');
  }

  if (numColorLevels < 1 || !Number.isInteger(numColorLevels)) {
    throw new Error(
      `Number of color levels must be a positive integer, received: ${numColorLevels}`,
    );
  }

  // Check cache first
  const cacheKey = createCacheKey(domain, colors, numColorLevels);
  const cachedScale = colorScaleCache.get(cacheKey);
  if (cachedScale) {
    return cachedScale;
  }

  // Create new color scale
  const colorInterpolator = interpolateRgbBasis(colors);
  const gradientColors = quantize(colorInterpolator, numColorLevels);

  const colorScale = scaleQuantize<string>()
    .domain([domain[0], domain[1]])
    .range(gradientColors);

  // Manage cache size before adding new entry
  manageCacheSize();

  // Cache the result
  colorScaleCache.set(cacheKey, colorScale);

  return colorScale;
}

/**
 * Clears the color scale cache, freeing up memory.
 *
 * This function removes all cached color scale functions. Use this when you need
 * to free up memory or when you want to ensure fresh color scales are created
 * (e.g., during testing or when color definitions might have changed).
 *
 * @example
 * ```typescript
 * // Clear cache to free memory
 * clearColorScaleCache();
 *
 * // Or clear cache during testing
 * afterEach(() => {
 *   clearColorScaleCache();
 * });
 * ```
 */
export function clearColorScaleCache(): void {
  colorScaleCache.clear();
}

/**
 * Returns the current number of cached color scale functions.
 *
 * Useful for monitoring cache usage, debugging, or performance analysis.
 *
 * @returns The number of color scales currently stored in the cache
 *
 * @example
 * ```typescript
 * console.log(`Cache size: ${getColorScaleCacheSize()}`);
 *
 * // Monitor cache growth
 * const initialSize = getColorScaleCacheSize();
 * // ... create many color scales ...
 * const finalSize = getColorScaleCacheSize();
 * console.log(`Cache grew by: ${finalSize - initialSize} entries`);
 * ```
 */
export function getColorScaleCacheSize(): number {
  return colorScaleCache.size;
}

/**
 * Returns cache statistics for performance monitoring and debugging.
 *
 * @returns Object containing cache size, maximum size, and hit rate information
 *
 * @example
 * ```typescript
 * const stats = getColorScaleCacheStats();
 * console.log(`Cache utilization: ${stats.size}/${stats.maxSize}`);
 * console.log(`Memory efficient: ${stats.size < stats.maxSize ? 'Yes' : 'No'}`);
 * ```
 */
export function getColorScaleCacheStats(): {
  /** Current number of cached color scales */
  readonly size: number;
  /** Maximum allowed cache size */
  readonly maxSize: number;
  /** Whether the cache has reached its maximum size */
  readonly isAtCapacity: boolean;
} {
  return {
    size: colorScaleCache.size,
    maxSize: MAX_CACHE_SIZE,
    isAtCapacity: colorScaleCache.size >= MAX_CACHE_SIZE,
  };
}

/**
 * Cache for storing created color scale functions to improve performance
 * when the same color scale parameters are used repeatedly.
 */
const colorScaleCache = new Map<string, (value: number) => string>();

/**
 * Maximum number of cached color scales to prevent memory leaks.
 * When this limit is reached, the oldest cache entries are removed.
 */
const MAX_CACHE_SIZE = 100;

/**
 * Creates a fast, collision-resistant cache key using hashing.
 * Handles arbitrarily long color arrays efficiently.
 *
 * @param domain - The input domain range
 * @param colors - Array of color strings
 * @param numColorLevels - Number of discrete color levels
 * @returns A unique string key for caching
 */
function createCacheKey(
  domain: Range,
  colors: readonly string[],
  numColorLevels: number,
): string {
  const domainStr = `${domain[0]},${domain[1]}`;
  const colorsStr = colors.join(',');

  // For short color arrays, use direct key (faster)
  if (colorsStr.length < 200) {
    return `${domainStr}-${colorsStr}-${numColorLevels}`;
  }

  // For long color arrays, use hash
  const colorsHash = simpleHash(colorsStr);
  return `${domainStr}-${colorsHash}-${numColorLevels}`;
}

/**
 * Simple, fast hash function for cache keys.
 * Uses djb2 algorithm - good distribution, minimal collisions.
 */
function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36); // Base36 for shorter string
}

/**
 * Manages cache size by removing the oldest entries when the cache exceeds the maximum size.
 * Uses FIFO (First In, First Out) strategy for cache eviction.
 */
function manageCacheSize(): void {
  while (colorScaleCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = colorScaleCache.keys().next().value;
    if (oldestKey) {
      colorScaleCache.delete(oldestKey);
    }
  }
}
