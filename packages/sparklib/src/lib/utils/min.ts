/**
 * Finds the minimum value in an array, with optional accessor function.
 *
 * @template T - The type of elements in the input array
 * @param arr - The input array to analyze
 * @param accessor - Optional function to extract numeric values from array elements.
 *                   If not provided, elements are cast to numbers directly.
 * @returns The minimum value found, or undefined if no valid values exist
 *
 * @example
 * ```typescript
 * // Simple number array
 * min([3, 1, 4, 1, 5]); // returns 1
 *
 * // With null/undefined values (they are ignored)
 * min([1, null, 3, undefined, 2]); // returns 1
 *
 * // Empty array
 * min([]); // returns undefined
 *
 * // With accessor function
 * const sales = [
 *   {month: 'Jan', amount: 100},
 *   {month: 'Feb', amount: 50},
 *   {month: 'Mar', amount: 200}
 * ];
 * min(sales, d => d.amount); // returns 50
 *
 * // With mixed valid/invalid data
 * const data = [{val: 10}, {val: null}, {val: 5}];
 * min(data, d => d.val); // returns 5
 *
 * // All invalid values
 * min([null, undefined, NaN]); // returns undefined
 * ```
 *
 * @remarks
 * - Null, undefined, and NaN values are automatically filtered out
 * - If all values are null/undefined/NaN, returns undefined
 * - If array is empty, returns undefined (unlike Math.min() which returns Infinity)
 * - Uses a single pass through the array for optimal performance
 * - Replacement for d3.min() without the d3-array dependency
 *
 * @public
 */
export const min = <T>(
  arr: T[],
  accessor?: (d: T) => number | null | undefined,
): number | undefined => {
  if (arr.length === 0) return undefined;

  const getValue = accessor || ((d: T) => d as unknown as number);
  let minVal: number | undefined;

  for (const item of arr) {
    const value = getValue(item);
    if (value != null && !isNaN(value)) {
      if (minVal === undefined || value < minVal) {
        minVal = value;
      }
    }
  }

  return minVal;
};
