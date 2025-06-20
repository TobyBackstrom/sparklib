import { min } from '../../lib/utils'; // Adjust import path as needed

describe('min', () => {
  describe('basic functionality', () => {
    it('should return minimum value from simple number array', () => {
      expect(min([3, 1, 4, 1, 5])).toBe(1);
    });

    it('should return minimum value from unordered array', () => {
      expect(min([5, 2, 8, 1, 9, 3])).toBe(1);
    });

    it('should return the value itself for single element array', () => {
      expect(min([42])).toBe(42);
    });

    it('should return minimum value when all elements are the same', () => {
      expect(min([7, 7, 7, 7])).toBe(7);
    });

    it('should handle negative numbers correctly', () => {
      expect(min([-5, -1, -10, -2])).toBe(-10);
    });

    it('should handle mixed positive and negative numbers', () => {
      expect(min([-3, 0, 5, -7, 2])).toBe(-7);
    });

    it('should handle decimal numbers', () => {
      expect(min([1.5, 2.7, 0.3, 4.1])).toBe(0.3);
    });

    it('should handle very small differences', () => {
      expect(min([1.0001, 1.0002, 1.0])).toBe(1.0);
    });
  });

  describe('edge cases', () => {
    it('should return undefined for empty array', () => {
      expect(min([])).toBeUndefined();
    });

    it('should ignore null values', () => {
      expect(min([3, null, 1, 2])).toBe(1);
    });

    it('should ignore undefined values', () => {
      expect(min([3, undefined, 1, 2])).toBe(1);
    });

    it('should ignore NaN values', () => {
      expect(min([3, NaN, 1, 2])).toBe(1);
    });

    it('should ignore mixed null, undefined, and NaN values', () => {
      expect(min([3, null, undefined, NaN, 1, 2])).toBe(1);
    });

    it('should return undefined when all values are null', () => {
      expect(min([null, null, null])).toBeUndefined();
    });

    it('should return undefined when all values are undefined', () => {
      expect(min([undefined, undefined, undefined])).toBeUndefined();
    });

    it('should return undefined when all values are NaN', () => {
      expect(min([NaN, NaN, NaN])).toBeUndefined();
    });

    it('should return undefined when all values are invalid', () => {
      expect(min([null, undefined, NaN])).toBeUndefined();
    });

    it('should handle zero correctly', () => {
      expect(min([0, 1, 2])).toBe(0);
      expect(min([-1, 0, 1])).toBe(-1);
      expect(min([0])).toBe(0);
    });

    it('should handle Infinity values', () => {
      expect(min([1, Infinity, 3])).toBe(1);
      expect(min([Infinity, 2, 3])).toBe(2);
      expect(min([1, -Infinity, 3])).toBe(-Infinity);
    });

    it('should handle -Infinity as minimum', () => {
      expect(min([-Infinity])).toBe(-Infinity);
      expect(min([100, -Infinity, 50])).toBe(-Infinity);
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
      expect(min(testData, (d) => d.value)).toBe(2);
    });

    it('should work with accessor returning different property', () => {
      const data = [
        { x: 1, y: 10 },
        { x: 5, y: 2 },
        { x: 3, y: 8 },
      ];
      expect(min(data, (d) => d.x)).toBe(1);
      expect(min(data, (d) => d.y)).toBe(2);
    });

    it('should handle accessor returning null values', () => {
      const data = [
        { value: 10 },
        { value: null },
        { value: 5 },
        { value: 15 },
      ];
      expect(min(data, (d) => d.value)).toBe(5);
    });

    it('should handle accessor returning undefined values', () => {
      const data = [
        { value: 10 },
        { value: undefined },
        { value: 5 },
        { value: 15 },
      ];
      expect(min(data, (d) => d.value)).toBe(5);
    });

    it('should handle accessor returning NaN values', () => {
      const data = [{ value: 10 }, { value: NaN }, { value: 5 }, { value: 15 }];
      expect(min(data, (d) => d.value)).toBe(5);
    });

    it('should return undefined when accessor always returns null', () => {
      expect(min(testData, () => null)).toBeUndefined();
    });

    it('should return undefined when accessor always returns undefined', () => {
      expect(min(testData, () => undefined)).toBeUndefined();
    });

    it('should return undefined when accessor always returns NaN', () => {
      expect(min(testData, () => NaN)).toBeUndefined();
    });

    it('should handle complex accessor logic', () => {
      const data = [
        { active: true, score: 100 },
        { active: false, score: 50 }, // This should be ignored
        { active: true, score: 75 },
        { active: false, score: 25 }, // This should be ignored
      ];

      // Only consider active items
      expect(min(data, (d) => (d.active ? d.score : null))).toBe(75);
    });

    it('should work with string data using accessor', () => {
      const data = ['10', '5', '15', '2'];
      expect(min(data, (d) => parseInt(d, 10))).toBe(2);
    });

    it('should handle accessor with mathematical operations', () => {
      const data = [
        { base: 10, multiplier: 2 },
        { base: 5, multiplier: 3 },
        { base: 8, multiplier: 1 },
      ];
      expect(min(data, (d) => d.base * d.multiplier)).toBe(8); // 8 * 1
    });

    it('should work with nested object properties', () => {
      const data = [
        { user: { stats: { score: 100 } } },
        { user: { stats: { score: 75 } } },
        { user: { stats: { score: 150 } } },
      ];
      expect(min(data, (d) => d.user.stats.score)).toBe(75);
    });
  });

  describe('comparison with Math.min', () => {
    it('should behave differently from Math.min with empty input', () => {
      expect(Math.min()).toBe(Infinity);
      expect(min([])).toBeUndefined();
    });

    it('should behave similarly to Math.min with valid numbers', () => {
      const values = [3, 1, 4, 1, 5];
      expect(min(values)).toBe(Math.min(...values));
    });
  });

  describe('type safety', () => {
    it('should work with string arrays using accessor', () => {
      expect(min(['10', '5', '15'], (d) => Number(d))).toBe(5);
    });

    it('should handle mixed types with accessor', () => {
      const mixed = [
        { id: 1, val: '10' },
        { id: 2, val: '5' },
        { id: 3, val: '15' },
      ];
      expect(min(mixed, (d) => parseFloat(d.val))).toBe(5);
    });

    it('should work with boolean conversion', () => {
      const data = [{ success: true }, { success: false }, { success: true }];
      expect(min(data, (d) => (d.success ? 1 : 0))).toBe(0);
    });
  });

  describe('performance edge cases', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => 10000 - i);
      expect(min(largeArray)).toBe(1);
    });

    it('should handle arrays with many null values', () => {
      const sparseArray = Array.from({ length: 1000 }, (_, i) =>
        i % 100 === 0 ? i : null,
      );
      expect(min(sparseArray)).toBe(0);
    });

    it('should handle alternating valid/invalid pattern', () => {
      const alternating = Array.from({ length: 1000 }, (_, i) =>
        i % 2 === 0 ? i : null,
      );
      expect(min(alternating)).toBe(0);
    });
  });

  describe('real-world scenarios', () => {
    it('should find minimum sales amount', () => {
      const sales = [
        { month: 'Jan', amount: 1000 },
        { month: 'Feb', amount: 750 },
        { month: 'Mar', amount: 1200 },
        { month: 'Apr', amount: 900 },
      ];
      expect(min(sales, (d) => d.amount)).toBe(750);
    });

    it('should find minimum temperature', () => {
      const weather = [
        { date: '2024-01-01', temp: -5.2 },
        { date: '2024-01-02', temp: -8.7 },
        { date: '2024-01-03', temp: -2.1 },
      ];
      expect(min(weather, (d) => d.temp)).toBe(-8.7);
    });

    it('should handle data with missing values', () => {
      const measurements = [
        { sensor: 'A', reading: 23.5 },
        { sensor: 'B', reading: null }, // Sensor malfunction
        { sensor: 'C', reading: 19.2 },
        { sensor: 'D', reading: undefined }, // No data
      ];
      expect(min(measurements, (d) => d.reading)).toBe(19.2);
    });
  });
});
