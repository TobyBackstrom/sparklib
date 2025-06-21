/**
 * Interface for a linear scale function with chainable configuration methods.
 * Drop-in replacement for d3.scaleLinear().
 */
export interface ScaleLinear {
  /**
   * Maps a value from the input domain to the output range
   */
  (value: number): number;

  /**
   * Sets or gets the input domain [min, max]
   */
  domain(): [number, number];
  domain(domain: [number, number]): ScaleLinear;

  /**
   * Sets or gets the output range [min, max]
   */
  range(): [number, number];
  range(range: [number, number]): ScaleLinear;

  /**
   * Inverts a value from the output range back to the input domain
   */
  invert(value: number): number;

  /**
   * Sets whether to clamp output values to the range
   */
  clamp(): boolean;
  clamp(clamp: boolean): ScaleLinear;

  /**
   * Rounds the domain to nice round numbers
   */
  nice(count?: number): ScaleLinear;

  /**
   * Generates approximately count tick values from the domain
   */
  ticks(count?: number): number[];

  /**
   * Creates a copy of the scale
   */
  copy(): ScaleLinear;
}

/**
 * Creates a linear scale function that maps values from an input domain to an output range.
 *
 * @returns A new linear scale function with chainable configuration methods
 *
 * @example
 * ```typescript
 * // Basic usage
 * const scale = scaleLinear()
 *   .domain([0, 100])
 *   .range([0, 500]);
 *
 * scale(50); // returns 250
 * scale.invert(250); // returns 50
 *
 * // With clamping
 * const clampedScale = scaleLinear()
 *   .domain([0, 100])
 *   .range([0, 500])
 *   .clamp(true);
 *
 * clampedScale(150); // returns 500 (clamped)
 *
 * // Generate ticks
 * scale.ticks(5); // returns [0, 25, 50, 75, 100]
 *
 * // Nice domain
 * const scale2 = scaleLinear()
 *   .domain([0.2, 99.7])
 *   .nice();
 * scale2.domain(); // returns [0, 100]
 * ```
 *
 * @remarks
 * - Drop-in replacement for d3.scaleLinear()
 * - Supports all major methods: domain, range, invert, clamp, nice, ticks
 * - Uses linear interpolation: output = (input - domainMin) / domainSpan * rangeSpan + rangeMin
 * - When clamped, output values are constrained to the range bounds
 * - nice() rounds domain bounds to human-friendly numbers
 *
 * @public
 */
export function scaleLinear(): ScaleLinear {
  let _domain: [number, number] = [0, 1];
  let _range: [number, number] = [0, 1];
  let _clamp = false;

  /**
   * Linear interpolation from domain to range
   */
  function scale(value: number): number {
    const domainSpan = _domain[1] - _domain[0];
    const rangeSpan = _range[1] - _range[0];

    // Handle zero-width domain - return middle of range
    if (domainSpan === 0) {
      return (_range[0] + _range[1]) / 2;
    }

    // Linear interpolation
    const normalized = (value - _domain[0]) / domainSpan;
    let result = normalized * rangeSpan + _range[0];

    // Apply clamping if enabled
    if (_clamp) {
      const [rangeMin, rangeMax] =
        _range[0] <= _range[1] ? _range : [_range[1], _range[0]];
      result = Math.max(rangeMin, Math.min(rangeMax, result));
    }

    return result;
  }

  /**
   * Domain getter/setter
   */
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
  scale.range = function (range?: [number, number]): any {
    if (range === undefined) {
      return [..._range] as [number, number];
    }
    _range = [...range] as [number, number];
    return scale;
  };

  /**
   * Invert a value from range back to domain
   */
  scale.invert = function (value: number): number {
    const rangeSpan = _range[1] - _range[0];
    const domainSpan = _domain[1] - _domain[0];

    // Handle zero-width range - return middle of domain
    if (rangeSpan === 0) {
      return (_domain[0] + _domain[1]) / 2;
    }

    // Inverse linear interpolation
    const normalized = (value - _range[0]) / rangeSpan;
    return normalized * domainSpan + _domain[0];
  };

  /**
   * Clamp getter/setter
   */
  scale.clamp = function (clamp?: boolean): any {
    if (clamp === undefined) {
      return _clamp;
    }
    _clamp = clamp;
    return scale;
  };

  /**
   * Round domain to nice numbers using D3's tickIncrement algorithm
   */
  scale.nice = function (count = 10): ScaleLinear {
    if (count == null) count = 10;

    let [start, stop] = _domain;

    // Handle zero-width domains
    if (start === stop) {
      return scale;
    }

    let step: number;
    let prestep: number | undefined;
    let maxIter = 10;

    // Handle inverted domain
    if (stop < start) {
      [start, stop] = [stop, start];
    }

    // D3's iterative nice algorithm
    while (maxIter-- > 0) {
      step = tickIncrement(start, stop, count);
      if (step === prestep) {
        break;
      } else if (step > 0) {
        start = Math.floor(start / step) * step;
        stop = Math.ceil(stop / step) * step;
      } else if (step < 0) {
        start = Math.ceil(start * step) / step;
        stop = Math.floor(stop * step) / step;
      } else {
        break;
      }
      prestep = step;
    }

    // Restore original order if domain was inverted
    if (_domain[1] < _domain[0]) {
      _domain = [stop, start];
    } else {
      _domain = [start, stop];
    }

    return scale;
  };

  /**
   * D3's tickIncrement algorithm - returns appropriate step size
   */
  function tickIncrement(start: number, stop: number, count: number): number {
    const e10 = Math.sqrt(50);
    const e5 = Math.sqrt(10);
    const e2 = Math.sqrt(2);

    const step = (stop - start) / Math.max(0, count);
    const power = Math.floor(Math.log(step) / Math.LN10);
    const error = step / Math.pow(10, power);

    return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) *
          Math.pow(10, power)
      : -Math.pow(10, -power) /
          (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
  }

  /**
   * Generate tick values using D3's algorithm
   */
  scale.ticks = function (count = 10): number[] {
    let [start, stop] = _domain;

    // Handle zero-width domains
    if (start === stop) {
      return [start];
    }

    const reverse = stop < start;

    if (reverse) {
      [start, stop] = [stop, start];
    }

    const step = tickIncrement(start, stop, count);

    if (step === 0 || !isFinite(step)) {
      return [];
    }

    let ticks: number[];

    if (step > 0) {
      const tickStart = Math.ceil(start / step);
      const tickStop = Math.floor(stop / step);
      const n = Math.ceil(tickStop - tickStart + 1);
      ticks = new Array(n);

      for (let i = 0; i < n; i++) {
        ticks[i] = (tickStart + i) * step;
      }
    } else {
      const tickStart = Math.floor(start * step);
      const tickStop = Math.ceil(stop * step);
      const n = Math.ceil(tickStart - tickStop + 1);
      ticks = new Array(n);

      for (let i = 0; i < n; i++) {
        ticks[i] = (tickStart - i) / step;
      }
    }

    return reverse ? ticks.reverse() : ticks;
  };

  /**
   * Create a copy of the scale
   */
  scale.copy = function (): ScaleLinear {
    return scaleLinear().domain(_domain).range(_range).clamp(_clamp);
  };

  return scale;
}
