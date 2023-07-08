/**
 * Enum representing the two types of arrays the `getArrayType` function can identify.
 */
export enum ArrayType {
  /** A single-dimensional array of numbers. */
  SingleNumbers = 'SingleNumbers',

  /** A two-dimensional array of number pairs. */
  NumberPairs = 'NumberPairs',
}

/**
 * Identifies the type of array passed in the `values` parameter.
 *
 * The `values` parameter can contain either a single-dimensional array of numbers, or a two-dimensional array of number pairs.
 * If the array is single-dimensional, the function will return `ArrayType.SingleNumbers`.
 * If the array is two-dimensional and all its elements are pairs of numbers, the function will return `ArrayType.NumberPairs`.
 * If the `values` array is empty, or if it contains any elements that are not numbers or pairs of numbers, the function will throw an error.
 *
 * @param values - The array to identify. Can contain numbers and/or pairs of numbers.
 *
 * @throws {Error} Will throw an error if the `values` array is empty, or if it contains any elements that are not numbers or pairs of numbers.
 *
 * @returns {ArrayType} The type of array identified.
 *
 * @todo Maybe add a check for non-pair elements in a pairs array, although this would be a fairly expensive operation.
 */
export function getArrayType(values: (number | [number, number])[]): ArrayType {
  if (Array.isArray(values) && values.length > 0) {
    const firstValue = values[0];
    if (typeof firstValue === 'number') {
      return ArrayType.SingleNumbers;
    } else if (Array.isArray(firstValue) && firstValue.length === 2) {
      if (
        typeof firstValue[0] === 'number' &&
        typeof firstValue[1] === 'number'
      ) {
        // TODO maybe: there is no check for non-pair elements in pairs array, which would be a fairly expensive operation
        return ArrayType.NumberPairs;
      }
    }
  }

  throw new Error(
    'Invalid input format. Expected an array of numbers or an array of number pairs.'
  );
}
