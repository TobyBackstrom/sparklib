import { getArrayType, ArrayType } from '../lib/utils/get-array-type';

describe('getArrayType function', () => {
  it('should return ArrayType.SingleNumbers for an array of single numbers', () => {
    const values: (number | [number, number])[] = [1, 2, 3, 4, 5];
    expect(getArrayType(values)).toEqual(ArrayType.SingleNumbers);
  });

  it('should return ArrayType.NumberPairs for an array of number pairs', () => {
    const values: (number | [number, number])[] = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    expect(getArrayType(values)).toEqual(ArrayType.NumberPairs);
  });

  it('should throw an error for empty array', () => {
    const values: (number | [number, number])[] = [];
    expect(() => getArrayType(values)).toThrowError(
      'Invalid input format. Expected an array of numbers or an array of number pairs.',
    );
  });

  it('should return ArrayType.SingleNumbers for an array starting with null values followed by single numbers', () => {
    const values: (number | null | [number, number | null])[] = [
      null,
      null,
      3,
      4,
      5,
    ];
    expect(getArrayType(values)).toEqual(ArrayType.SingleNumbers);
  });

  it('should return ArrayType.NumberPairs for an array starting with null values followed by number pairs', () => {
    const values: (number | null | [number, number | null])[] = [
      null,
      null,
      [3, 4],
      [5, 6],
    ];
    expect(getArrayType(values)).toEqual(ArrayType.NumberPairs);
  });

  it('should throw an error for an array of only null values', () => {
    const values: (number | null | [number, number | null])[] = [
      null,
      null,
      null,
    ];
    expect(() => getArrayType(values)).toThrowError(
      'Array contains only null values.',
    );
  });

  it('should return ArrayType.SingleNumbers when encountering a number after multiple null values', () => {
    const values: (number | null | [number, number | null])[] = [null, null, 5];
    expect(getArrayType(values)).toEqual(ArrayType.SingleNumbers);
  });

  it('should return ArrayType.NumberPairs when encountering a number pair after multiple null values', () => {
    const values: (number | null | [number, number | null])[] = [
      null,
      null,
      [1, 2],
    ];
    expect(getArrayType(values)).toEqual(ArrayType.NumberPairs);
  });

  //   it('should throw an error for invalid input (non-pair elements in pairs array)', () => {
  //     const values: (number | [number, number])[] = [[1, 2], [3, 4], 5];
  //     expect(() => getArrayType({ values })).toThrowError(
  //       'Invalid input format. Expected an array of numbers or an array of number pairs.'
  //     );
  //   });
});
