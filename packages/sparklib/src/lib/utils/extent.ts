/**
 * Computes the minimum and maximum values in an array.
 *
 * @template T - The type of elements in the input array
 * @param arr - The input array to analyze
 * @param accessor - Optional function to extract numeric values from array elements.
 *                   If not provided, elements are cast to numbers directly.
 * @returns A tuple containing [min, max] values, or [undefined, undefined] if no valid values found
 *
 * @example
 * ```typescript
 * // Simple number array
 * extent([1, 2, 3, 4, 5]); // returns [1, 5]
 *
 * // With null/undefined values
 * extent([1, null, 3, undefined, 2]); // returns [1, 3]
 *
 * // Empty array
 * extent([]); // returns [undefined, undefined]
 *
 * // With accessor function
 * const data = [{value: 10}, {value: 5}, {value: 15}];
 * extent(data, d => d.value); // returns [5, 15]
 *
 * // With mixed valid/invalid data
 * const mixed = [{val: 1}, {val: null}, {val: 3}];
 * extent(mixed, d => d.val); // returns [1, 3]
 * ```
 *
 * @remarks
 * - Null, undefined, and NaN values are automatically filtered out
 * - If all values are null/undefined/NaN, returns [undefined, undefined]
 * - Uses a single pass through the array for optimal performance
 * - Replacement for d3.extent() without the d3-array dependency
 *
 * @public
 */
export const extent = <T>(
  arr: T[],
  accessor?: (d: T) => number | null | undefined,
): [number, number] | [undefined, undefined] => {
  if (arr.length === 0) return [undefined, undefined];

  const getValue = accessor || ((d: T) => d as unknown as number);
  let min: number | undefined;
  let max: number | undefined;

  for (const item of arr) {
    const value = getValue(item);
    if (value != null && !isNaN(value)) {
      if (min === undefined || value < min) min = value;
      if (max === undefined || value > max) max = value;
    }
  }

  return min !== undefined && max !== undefined
    ? [min, max]
    : [undefined, undefined];
};
