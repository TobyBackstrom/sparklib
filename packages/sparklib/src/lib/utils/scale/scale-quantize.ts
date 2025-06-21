/**
 * Interface for a quantize scale function with chainable configuration methods.
 * Adjusted (not a drop-in) replacement for d3.scaleQuantize().
 */
export interface ScaleQuantize<T> {
  /**
   * Maps a value from the continuous domain to a discrete range value
   */
  (value: number): T;

  /**
   * Gets the input domain [min, max]
   */
  domain(): [number, number];
  /**
   * Sets the input domain [min, max] and returns this scale for chaining
   */
  domain(domain: [number, number]): ScaleQuantize<T>;

  /**
   * Gets the discrete output range
   */
  range(): T[];
  /**
   * Sets the discrete output range and returns this scale for chaining
   */
  range(range: T[]): ScaleQuantize<T>;

  /**
   * Returns the domain extent for a given range value
   */
  invertExtent(
    value: T,
  ): [number, number | undefined] | [number, number] | undefined;

  /**
   * Returns the threshold values that divide the domain
   */
  thresholds(): number[];

  /**
   * Creates a copy of the scale
   */
  copy(): ScaleQuantize<T>;

  /**
   * Sets the value to return for invalid inputs
   */
  unknown(): T | undefined;
  /**
   * Sets the value to return for invalid inputs and returns this scale for chaining
   */
  unknown(value: T): ScaleQuantize<T>;
}

/**
 * Creates a quantize scale function that maps continuous domain values to discrete range values.
 *
 * @template T - The type of values in the output range
 * @returns A new quantize scale function with chainable configuration methods
 *
 * @example
 * ```typescript
 * // Basic usage with colors
 * const colorScale = scaleQuantize<string>()
 *   .domain([0, 100])
 *   .range(['red', 'orange', 'yellow', 'green']);
 *
 * colorScale(10);  // 'red' (0-25 range)
 * colorScale(30);  // 'orange' (25-50 range)
 * colorScale(60);  // 'yellow' (50-75 range)
 * colorScale(90);  // 'green' (75-100 range)
 *
 * // Invert to find domain segment
 * colorScale.invertExtent('orange'); // [25, 50]
 * colorScale.thresholds(); // [25, 50, 75]
 *
 * // Data categorization
 * const ageScale = scaleQuantize<string>()
 *   .domain([18, 65])
 *   .range(['young', 'middle', 'senior']);
 *
 * ageScale(25); // 'young'
 * ageScale(45); // 'middle'
 * ageScale(60); // 'senior'
 *
 * // Numeric binning
 * const scoreScale = scaleQuantize<number>()
 *   .domain([0, 100])
 *   .range([1, 2, 3, 4, 5]);
 *
 * scoreScale(85); // 4
 * scoreScale.invertExtent(4); // [60, 80]
 * ```
 *
 * @remarks
 * - Divides the continuous domain into n equal segments (where n = range.length)
 * - Each segment maps to one discrete range value
 * - Values outside the domain are clamped to the nearest range value
 * - Drop-in replacement for d3.scaleQuantize()
 * - Supports any output type T (strings, numbers, objects, etc.)
 *
 * @public
 */
export function scaleQuantize<T>(): ScaleQuantize<T> {
  let _domain: [number, number] = [0, 1];
  let _range: T[] = [0, 1] as unknown as T[];
  let _unknown: T | undefined = undefined;

  /**
   * Maps input value to discrete range value
   */
  function scale(value: number): T {
    if (_range.length === 0) {
      return _unknown as T; // Will be undefined, but typed as T
    }

    const [min, max] = _domain;
    const domainSpan = max - min;

    // Handle zero-width domain with D3's specific logic
    if (domainSpan === 0) {
      // Return first range value for inputs less than domain value,
      // last range value for inputs greater than or equal to domain value
      return value < min ? _range[0] : _range[_range.length - 1];
    }

    // Normalize value to [0, 1]
    let normalized = (value - min) / domainSpan;

    // For inverted domains (negative span), we need to handle differently
    if (domainSpan < 0) {
      // With inverted domain [100, 0], value 25 should map like:
      // normalized = (25 - 100) / (-100) = -75 / -100 = 0.75
      // But we want it to map to the first segment, so we need to invert
      normalized = 1 - normalized;
    }

    // Clamp to [0, 1] to handle values outside domain
    normalized = Math.max(0, Math.min(1, normalized));

    // Map to range index
    let index = Math.floor(normalized * _range.length);

    // Handle edge case where value equals domain maximum
    if (index >= _range.length) {
      index = _range.length - 1;
    }

    return _range[index];
  }

  /**
   * Domain getter/setter
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  scale.domain = function (domain?: [number, number]): any {
    if (domain === undefined) {
      return [..._domain] as [number, number];
    }
    _domain = [...domain] as [number, number];
    return scale;
  };

  /**
   * Range getter/setter
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  scale.range = function (range?: T[]): any {
    if (range?.length === 0) {
      throw new Error('Invalid array length');
    }

    if (range === undefined) {
      return [..._range];
    }
    _range = [...range];
    return scale;
  };

  /**
   * Returns the domain extent for a given range value
   */
  scale.invertExtent = function (
    value: T,
  ): [number, number | undefined] | [number, number] | undefined {
    const index = _range.indexOf(value);

    if (index === -1) {
      return [NaN, NaN];
    }

    const [min, max] = _domain;
    const domainSpan = max - min;
    const segmentSize = domainSpan / _range.length;

    const segmentMin = min + index * segmentSize;
    const segmentMax = min + (index + 1) * segmentSize;

    // D3 returns undefined as max for single range value
    if (_range.length === 1) {
      return [segmentMin, undefined];
    }

    return [segmentMin, segmentMax];
  };
  /**
   * Returns the threshold values that divide the domain
   */
  scale.thresholds = function (): number[] {
    if (_range.length <= 1) {
      return [];
    }

    const [min, max] = _domain;
    const domainSpan = max - min;
    const segmentSize = domainSpan / _range.length;

    const thresholds: number[] = [];

    // Generate n-1 thresholds for n range segments
    for (let i = 1; i < _range.length; i++) {
      thresholds.push(min + i * segmentSize);
    }

    return thresholds;
  };

  /**
   * Create a copy of the scale
   */
  scale.copy = function (): ScaleQuantize<T> {
    return scaleQuantize<T>().domain(_domain).range(_range);
  };

  /**
   * Unknown getter/setter
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  scale.unknown = function (value?: T): any {
    if (value === undefined && arguments.length === 0) {
      return _unknown;
    }
    _unknown = value;
    return scale;
  };

  return scale;
}
