import { LineValueType } from '../models';

/**
 * Enum representing the two types of arrays the `getArrayType` function can identify.
 */
export enum ArrayType {
  /** An unknown type. */
  Unknown = 'Unknown',

  /** A single-dimensional array of numbers. */
  SingleValue = 'SingleValue',

  /** A two-dimensional array of number pairs. */
  TupleValue = 'TupleValue',

  /** A two-dimensional array of number pairs. */
  ObjectValue = 'ObjectValue',
}

/**
 * Identifies the type of array passed in the `values` parameter.
 *
 * The `values` parameter can contain either a single-dimensional array of numbers, a two-dimensional array of number pairs, or an array of objects.
 * If the array is single-dimensional, the function will return `ArrayType.SingleValue`.
 * If the array is two-dimensional and all its elements are pairs of numbers, the function will return `ArrayType.TupleValue`.
 * If the array is one-dimensional and all its elements are objects, the function will return `ArrayType.ObjectValue`.
 * If the `values` array is empty, or if it contains any elements that are not numbers or pairs of numbers, the function will throw an error.
 *
 * @param values - The array to identify. Can contain numbers and/or pairs of numbers or objects.
 *
 * @throws {Error} Will throw an error if the `values` array is empty, or if it contains any elements that are not numbers, pairs of numbers or objects.
 *
 * @returns {ArrayType} The type of array identified.
 *
 * @todo Maybe add a check for non-pair elements in a pairs array, although this would be a fairly expensive operation.
 */
export function getArrayType<T>(values: LineValueType<T>[]): ArrayType {
  if (Array.isArray(values) && values.length > 0) {
    let firstNonNullValue;

    // Find the first non-null value
    for (const value of values) {
      if (value !== null) {
        firstNonNullValue = value;
        break;
      }
    }

    // If we only have null values, throw an error
    if (firstNonNullValue === undefined) {
      throw new Error('Array contains only null values.');
    }

    // Check for single value
    if (typeof firstNonNullValue === 'number') {
      return ArrayType.SingleValue;
    }
    // Check for tuple value
    else if (
      Array.isArray(firstNonNullValue) &&
      firstNonNullValue.length === 2
    ) {
      if (
        typeof firstNonNullValue[0] === 'number' &&
        (typeof firstNonNullValue[1] === 'number' ||
          typeof firstNonNullValue[1] === null)
      ) {
        // TODO maybe: there is no check for non-pair elements in pairs array, which would be a fairly expensive operation
        return ArrayType.TupleValue;
      }
    }
    // Check for object value
    else if (typeof firstNonNullValue === 'object') {
      return ArrayType.ObjectValue;
    }
  }

  throw new Error(
    'Invalid input format. Expected an array of numbers or an array of number pairs.',
  );
}
