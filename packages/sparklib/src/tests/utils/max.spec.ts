import { max } from '../../lib/utils'; // Adjust import path as needed

describe('max', () => {
  describe('basic functionality', () => {
    it('should return maximum value from simple number array', () => {
      expect(max([3, 1, 4, 1, 5])).toBe(5);
    });

    it('should return maximum value from unordered array', () => {
      expect(max([5, 2, 8, 1, 9, 3])).toBe(9);
    });

    it('should return the value itself for single element array', () => {
      expect(max([42])).toBe(42);
    });

    it('should return maximum value when all elements are the same', () => {
      expect(max([7, 7, 7, 7])).toBe(7);
    });

    it('should handle negative numbers correctly', () => {
      expect(max([-5, -1, -10, -2])).toBe(-1);
    });

    it('should handle mixed positive and negative numbers', () => {
      expect(max([-3, 0, 5, -7, 2])).toBe(5);
    });

    it('should handle decimal numbers', () => {
      expect(max([1.5, 2.7, 0.3, 4.1])).toBe(4.1);
    });

    it('should handle very small differences', () => {
      expect(max([1.0001, 1.0002, 1.0])).toBe(1.0002);
    });
  });

  describe('edge cases', () => {
    it('should return undefined for empty array', () => {
      expect(max([])).toBeUndefined();
    });

    it('should ignore null values', () => {
      expect(max([3, null, 1, 2])).toBe(3);
    });

    it('should ignore undefined values', () => {
      expect(max([3, undefined, 1, 2])).toBe(3);
    });

    it('should ignore NaN values', () => {
      expect(max([3, NaN, 1, 2])).toBe(3);
    });

    it('should ignore mixed null, undefined, and NaN values', () => {
      expect(max([3, null, undefined, NaN, 1, 2])).toBe(3);
    });

    it('should return undefined when all values are null', () => {
      expect(max([null, null, null])).toBeUndefined();
    });

    it('should return undefined when all values are undefined', () => {
      expect(max([undefined, undefined, undefined])).toBeUndefined();
    });

    it('should return undefined when all values are NaN', () => {
      expect(max([NaN, NaN, NaN])).toBeUndefined();
    });

    it('should return undefined when all values are invalid', () => {
      expect(max([null, undefined, NaN])).toBeUndefined();
    });

    it('should handle zero correctly', () => {
      expect(max([0, -1, -2])).toBe(0);
      expect(max([-1, 0, 1])).toBe(1);
      expect(max([0])).toBe(0);
    });

    it('should handle Infinity values', () => {
      expect(max([1, Infinity, 3])).toBe(Infinity);
      expect(max([1, 2, 3])).toBe(3);
      expect(max([1, -Infinity, 3])).toBe(3);
    });

    it('should handle Infinity as maximum', () => {
      expect(max([Infinity])).toBe(Infinity);
      expect(max([100, Infinity, 50])).toBe(Infinity);
    });

    it('should handle -Infinity correctly', () => {
      expect(max([-Infinity, -100, -50])).toBe(-50);
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
      expect(max(testData, (d) => d.value)).toBe(15);
    });

    it('should work with accessor returning different property', () => {
      const data = [
        { x: 1, y: 10 },
        { x: 5, y: 2 },
        { x: 3, y: 8 },
      ];
      expect(max(data, (d) => d.x)).toBe(5);
      expect(max(data, (d) => d.y)).toBe(10);
    });

    it('should handle accessor returning null values', () => {
      const data = [
        { value: 10 },
        { value: null },
        { value: 5 },
        { value: 15 },
      ];
      expect(max(data, (d) => d.value)).toBe(15);
    });

    it('should handle accessor returning undefined values', () => {
      const data = [
        { value: 10 },
        { value: undefined },
        { value: 5 },
        { value: 15 },
      ];
      expect(max(data, (d) => d.value)).toBe(15);
    });

    it('should handle accessor returning NaN values', () => {
      const data = [{ value: 10 }, { value: NaN }, { value: 5 }, { value: 15 }];
      expect(max(data, (d) => d.value)).toBe(15);
    });

    it('should return undefined when accessor always returns null', () => {
      expect(max(testData, () => null)).toBeUndefined();
    });

    it('should return undefined when accessor always returns undefined', () => {
      expect(max(testData, () => undefined)).toBeUndefined();
    });

    it('should return undefined when accessor always returns NaN', () => {
      expect(max(testData, () => NaN)).toBeUndefined();
    });

    it('should handle complex accessor logic', () => {
      const data = [
        { active: true, score: 100 },
        { active: false, score: 150 }, // This should be ignored
        { active: true, score: 75 },
        { active: false, score: 200 }, // This should be ignored
      ];

      // Only consider active items
      expect(max(data, (d) => (d.active ? d.score : null))).toBe(100);
    });

    it('should work with string data using accessor', () => {
      const data = ['10', '5', '15', '2'];
      expect(max(data, (d) => parseInt(d, 10))).toBe(15);
    });

    it('should handle accessor with mathematical operations', () => {
      const data = [
        { base: 10, multiplier: 2 },
        { base: 5, multiplier: 3 },
        { base: 8, multiplier: 1 },
      ];
      expect(max(data, (d) => d.base * d.multiplier)).toBe(20); // 10 * 2
    });

    it('should work with nested object properties', () => {
      const data = [
        { user: { stats: { score: 100 } } },
        { user: { stats: { score: 75 } } },
        { user: { stats: { score: 150 } } },
      ];
      expect(max(data, (d) => d.user.stats.score)).toBe(150);
    });
  });

  describe('comparison with Math.max', () => {
    it('should behave differently from Math.max with empty input', () => {
      expect(Math.max()).toBe(-Infinity);
      expect(max([])).toBeUndefined();
    });

    it('should behave similarly to Math.max with valid numbers', () => {
      const values = [3, 1, 4, 1, 5];
      expect(max(values)).toBe(Math.max(...values));
    });
  });

  describe('type safety', () => {
    it('should work with string arrays using accessor', () => {
      expect(max(['10', '5', '15'], (d) => Number(d))).toBe(15);
    });

    it('should handle mixed types with accessor', () => {
      const mixed = [
        { id: 1, val: '10' },
        { id: 2, val: '5' },
        { id: 3, val: '15' },
      ];
      expect(max(mixed, (d) => parseFloat(d.val))).toBe(15);
    });

    it('should work with boolean conversion', () => {
      const data = [{ success: true }, { success: false }, { success: true }];
      expect(max(data, (d) => (d.success ? 1 : 0))).toBe(1);
    });
  });

  describe('performance edge cases', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      expect(max(largeArray)).toBe(9999);
    });

    it('should handle arrays with many null values', () => {
      const sparseArray = Array.from({ length: 1000 }, (_, i) =>
        i % 100 === 0 ? i : null,
      );
      expect(max(sparseArray)).toBe(900);
    });

    it('should handle alternating valid/invalid pattern', () => {
      const alternating = Array.from({ length: 1000 }, (_, i) =>
        i % 2 === 0 ? i : null,
      );
      expect(max(alternating)).toBe(998);
    });
  });

  describe('real-world scenarios', () => {
    it('should find maximum sales amount', () => {
      const sales = [
        { month: 'Jan', amount: 1000 },
        { month: 'Feb', amount: 750 },
        { month: 'Mar', amount: 1200 },
        { month: 'Apr', amount: 900 },
      ];
      expect(max(sales, (d) => d.amount)).toBe(1200);
    });

    it('should find maximum temperature', () => {
      const weather = [
        { date: '2024-01-01', temp: -5.2 },
        { date: '2024-01-02', temp: -8.7 },
        { date: '2024-01-03', temp: -2.1 },
      ];
      expect(max(weather, (d) => d.temp)).toBe(-2.1);
    });

    it('should handle data with missing values', () => {
      const measurements = [
        { sensor: 'A', reading: 23.5 },
        { sensor: 'B', reading: null }, // Sensor malfunction
        { sensor: 'C', reading: 19.2 },
        { sensor: 'D', reading: undefined }, // No data
      ];
      expect(max(measurements, (d) => d.reading)).toBe(23.5);
    });

    it('should find highest score among valid entries', () => {
      const gameScores = [
        { player: 'Alice', score: 1500 },
        { player: 'Bob', score: null }, // Disconnected
        { player: 'Charlie', score: 2100 },
        { player: 'Diana', score: 1800 },
      ];
      expect(max(gameScores, (d) => d.score)).toBe(2100);
    });
  });

  describe('edge cases specific to max', () => {
    it('should find maximum among very large numbers', () => {
      expect(max([1e10, 1e15, 1e12])).toBe(1e15);
    });

    it('should handle maximum with scientific notation', () => {
      expect(max([1.5e-10, 2.3e-8, 9.1e-12])).toBe(2.3e-8);
    });

    it('should find maximum when all values are negative', () => {
      expect(max([-100, -50, -200, -10])).toBe(-10);
    });

    it('should handle floating point precision edge cases', () => {
      expect(max([0.1 + 0.2, 0.3, 0.30000000000000004])).toBe(
        0.30000000000000004,
      );
    });
  });
});
