export enum ArrayType {
  SingleNumbers = 'SingleNumbers',
  NumberPairs = 'NumberPairs',
}

export function getArrayType({
  values,
}: {
  values: (number | [number, number])[];
}): ArrayType {
  if (Array.isArray(values) && values.length > 0) {
    const firstValue = values[0];
    if (typeof firstValue === 'number') {
      return ArrayType.SingleNumbers;
    } else if (Array.isArray(firstValue) && firstValue.length === 2) {
      if (
        typeof firstValue[0] === 'number' &&
        typeof firstValue[1] === 'number'
      ) {
        return ArrayType.NumberPairs;
      }
    }
  }

  throw new Error(
    'Invalid input format. Expected an array of numbers or an array of number pairs.'
  );
}
