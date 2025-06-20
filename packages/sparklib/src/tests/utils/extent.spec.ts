import { extent } from '../../lib/utils'; // Adjust import path as needed

describe('extent', () => {
  describe('basic functionality', () => {
    it('should return correct extent for simple number array', () => {
      expect(extent([1, 2, 3, 4, 5])).toEqual([1, 5]);
    });

    it('should return correct extent for unordered array', () => {
      expect(extent([3, 1, 4, 1, 5, 9, 2, 6])).toEqual([1, 9]);
    });

    it('should return correct extent for single element array', () => {
      expect(extent([42])).toEqual([42, 42]);
    });

    it('should return correct extent for array with duplicate values', () => {
      expect(extent([5, 5, 5, 5])).toEqual([5, 5]);
    });

    it('should handle negative numbers correctly', () => {
      expect(extent([-5, -1, -10, -2])).toEqual([-10, -1]);
    });

    it('should handle mixed positive and negative numbers', () => {
      expect(extent([-3, 0, 5, -7, 2])).toEqual([-7, 5]);
    });

    it('should handle decimal numbers', () => {
      expect(extent([1.5, 2.7, 0.3, 4.1])).toEqual([0.3, 4.1]);
    });
  });

  describe('edge cases', () => {
    it('should return [undefined, undefined] for empty array', () => {
      expect(extent([])).toEqual([undefined, undefined]);
    });

    it('should ignore null values', () => {
      expect(extent([1, null, 3, 2])).toEqual([1, 3]);
    });

    it('should ignore undefined values', () => {
      expect(extent([1, undefined, 3, 2])).toEqual([1, 3]);
    });

    it('should ignore NaN values', () => {
      expect(extent([1, NaN, 3, 2])).toEqual([1, 3]);
    });

    it('should ignore mixed null, undefined, and NaN values', () => {
      expect(extent([1, null, undefined, NaN, 3, 2])).toEqual([1, 3]);
    });

    it('should return [undefined, undefined] when all values are null', () => {
      expect(extent([null, null, null])).toEqual([undefined, undefined]);
    });

    it('should return [undefined, undefined] when all values are undefined', () => {
      expect(extent([undefined, undefined, undefined])).toEqual([
        undefined,
        undefined,
      ]);
    });

    it('should return [undefined, undefined] when all values are NaN', () => {
      expect(extent([NaN, NaN, NaN])).toEqual([undefined, undefined]);
    });

    it('should return [undefined, undefined] when all values are invalid', () => {
      expect(extent([null, undefined, NaN])).toEqual([undefined, undefined]);
    });

    it('should handle zero correctly', () => {
      expect(extent([0, 1, -1])).toEqual([-1, 1]);
      expect(extent([0])).toEqual([0, 0]);
    });

    it('should handle Infinity values', () => {
      expect(extent([1, Infinity, 3])).toEqual([1, Infinity]);
      expect(extent([1, -Infinity, 3])).toEqual([-Infinity, 3]);
    });
  });

  describe('with accessor function', () => {
    const testData = [
      { value: 10, name: 'a' },
      { value: 5, name: 'b' },
      { value: 15, name: 'c' },
      { value: 2, name: 'd' },
    ];

    it('should work with accessor function', () => {
      expect(extent(testData, (d) => d.value)).toEqual([2, 15]);
    });

    it('should work with accessor returning different property', () => {
      const data = [
        { x: 1, y: 10 },
        { x: 5, y: 2 },
        { x: 3, y: 8 },
      ];
      expect(extent(data, (d) => d.x)).toEqual([1, 5]);
      expect(extent(data, (d) => d.y)).toEqual([2, 10]);
    });

    it('should handle accessor returning null values', () => {
      const data = [
        { value: 10 },
        { value: null },
        { value: 5 },
        { value: 15 },
      ];
      expect(extent(data, (d) => d.value)).toEqual([5, 15]);
    });

    it('should handle accessor returning undefined values', () => {
      const data = [
        { value: 10 },
        { value: undefined },
        { value: 5 },
        { value: 15 },
      ];
      expect(extent(data, (d) => d.value)).toEqual([5, 15]);
    });

    it('should handle accessor returning NaN values', () => {
      const data = [{ value: 10 }, { value: NaN }, { value: 5 }, { value: 15 }];
      expect(extent(data, (d) => d.value)).toEqual([5, 15]);
    });

    it('should return [undefined, undefined] when accessor always returns null', () => {
      expect(extent(testData, () => null)).toEqual([undefined, undefined]);
    });

    it('should return [undefined, undefined] when accessor always returns undefined', () => {
      expect(extent(testData, () => undefined)).toEqual([undefined, undefined]);
    });

    it('should handle complex accessor logic', () => {
      const data = [
        { active: true, score: 100 },
        { active: false, score: 200 },
        { active: true, score: 50 },
        { active: false, score: 150 },
      ];

      // Only consider active items
      expect(extent(data, (d) => (d.active ? d.score : null))).toEqual([
        50, 100,
      ]);
    });

    it('should work with string data using accessor', () => {
      const data = ['10', '5', '15', '2'];
      expect(extent(data, (d) => parseInt(d, 10))).toEqual([2, 15]);
    });
  });

  describe('type safety', () => {
    it('should work with different input types', () => {
      // String array needs explicit accessor to convert to numbers
      expect(extent(['1', '2', '3'], (d) => Number(d))).toEqual([1, 3]);

      // Mixed types with accessor
      const mixed = [
        { id: 1, val: '10' },
        { id: 2, val: '5' },
        { id: 3, val: '15' },
      ];
      expect(extent(mixed, (d) => parseFloat(d.val))).toEqual([5, 15]);
    });
  });

  describe('performance edge cases', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      expect(extent(largeArray)).toEqual([0, 9999]);
    });

    it('should handle arrays with many null values', () => {
      const sparseArray = Array.from({ length: 1000 }, (_, i) =>
        i % 100 === 0 ? i : null,
      );
      expect(extent(sparseArray)).toEqual([0, 900]);
    });
  });
});
