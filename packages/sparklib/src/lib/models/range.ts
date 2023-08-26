/**
 * Represents a numerical range in a data set.
 *
 * Defined as a tuple of two numbers `[start, end]`, where `start`
 * is the starting value of the range and `end` is the ending value.
 *
 * @example
 * ```typescript
 * const myRange: Range = [0, 100];
 * ```
 *
 * @typedef {Array} Range
 *
 * @property {number} 0 - The starting value of the range.
 * @property {number} 1 - The ending value of the range.
 */
export type Range = [number, number];
