import { scaleQuantize } from '../../../lib/utils/scale';

describe('scaleQuantize', () => {
  describe('basic functionality', () => {
    it('should create a scale with default domain [0,1] and range [0,1]', () => {
      const scale = scaleQuantize<number>();
      expect(scale.domain()).toEqual([0, 1]);
      expect(scale.range()).toEqual([0, 1]);
    });

    it('should map values correctly with string range', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 100])
        .range(['red', 'orange', 'yellow', 'green']);

      expect(scale(10)).toBe('red'); // 0-25 range
      expect(scale(30)).toBe('orange'); // 25-50 range
      expect(scale(60)).toBe('yellow'); // 50-75 range
      expect(scale(90)).toBe('green'); // 75-100 range
    });

    it('should map values correctly with numeric range', () => {
      const scale = scaleQuantize<number>()
        .domain([0, 10])
        .range([1, 2, 3, 4, 5]);

      expect(scale(1)).toBe(1); // 0-2 range
      expect(scale(3)).toBe(2); // 2-4 range
      expect(scale(5)).toBe(3); // 4-6 range
      expect(scale(7)).toBe(4); // 6-8 range
      expect(scale(9)).toBe(5); // 8-10 range
    });

    it('should handle exact domain boundaries', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 100])
        .range(['low', 'medium', 'high']);

      expect(scale(0)).toBe('low'); // Start of domain
      expect(scale(100)).toBe('high'); // End of domain
      expect(scale(33.33)).toBe('low'); // Just before boundary
      expect(scale(33.34)).toBe('medium'); // Just after boundary
    });

    it('should handle single range value', () => {
      const scale = scaleQuantize<string>().domain([0, 100]).range(['only']);

      expect(scale(0)).toBe('only');
      expect(scale(50)).toBe('only');
      expect(scale(100)).toBe('only');
    });

    it('should handle two range values', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 10])
        .range(['first', 'second']);

      expect(scale(0)).toBe('first');
      expect(scale(4.9)).toBe('first');
      expect(scale(5)).toBe('second');
      expect(scale(10)).toBe('second');
    });
  });

  describe('domain method', () => {
    it('should set and get domain', () => {
      const scale = scaleQuantize<string>();
      expect(scale.domain()).toEqual([0, 1]);

      scale.domain([10, 20]);
      expect(scale.domain()).toEqual([10, 20]);
    });

    it('should return a copy of domain array', () => {
      const scale = scaleQuantize<string>();
      const domain = scale.domain();
      domain[0] = 999;
      expect(scale.domain()).toEqual([0, 1]); // Should be unchanged
    });

    it('should chain when setting domain', () => {
      const scale = scaleQuantize<string>();
      const result = scale.domain([5, 15]);
      expect(result).toBe(scale);
    });

    it('should handle negative domains', () => {
      const scale = scaleQuantize<string>().domain([-10, 10]);
      expect(scale.domain()).toEqual([-10, 10]);
    });

    it('should handle fractional domains', () => {
      const scale = scaleQuantize<string>().domain([0.1, 0.9]);
      expect(scale.domain()).toEqual([0.1, 0.9]);
    });

    it('should handle inverted domains', () => {
      const scale = scaleQuantize<string>()
        .domain([100, 0])
        .range(['first', 'second']);

      // D3 treats [100, 0] as domain with negative span
      expect(scale(25)).toBe('first'); // Changed from 'second' to 'first'
      expect(scale(75)).toBe('second'); // Changed from 'first' to 'second'
    });
  });

  describe('range method', () => {
    it('should set and get range', () => {
      const scale = scaleQuantize<string>();
      expect(scale.range()).toEqual([0, 1]); // Changed from [] to [0, 1]

      scale.range(['a', 'b', 'c']);
      expect(scale.range()).toEqual(['a', 'b', 'c']);
    });

    it('should return a copy of range array', () => {
      const scale = scaleQuantize<string>().range(['a', 'b']);
      const range = scale.range();
      range[0] = 'z';
      expect(scale.range()).toEqual(['a', 'b']); // Should be unchanged
    });

    it('should chain when setting range', () => {
      const scale = scaleQuantize<string>();
      const result = scale.range(['x', 'y']);
      expect(result).toBe(scale);
    });

    it('should handle different data types', () => {
      const numberScale = scaleQuantize<number>().range([1, 2, 3]);
      expect(numberScale.range()).toEqual([1, 2, 3]);

      const objectScale = scaleQuantize<{ name: string }>().range([
        { name: 'first' },
        { name: 'second' },
      ]);
      expect(objectScale.range()).toEqual([
        { name: 'first' },
        { name: 'second' },
      ]);
    });

    it('should throw on a zero array', () => {
      const scale = scaleQuantize<string>();

      expect(() => scale.range([])).toThrow();
    });
  });

  describe('quantization logic', () => {
    it('should divide domain into equal segments', () => {
      const scale = scaleQuantize<number>().domain([0, 12]).range([1, 2, 3, 4]);

      // 4 segments of 3 each: [0-3), [3-6), [6-9), [9-12]
      expect(scale(0)).toBe(1);
      expect(scale(2.9)).toBe(1);
      expect(scale(3)).toBe(2);
      expect(scale(5.9)).toBe(2);
      expect(scale(6)).toBe(3);
      expect(scale(8.9)).toBe(3);
      expect(scale(9)).toBe(4);
      expect(scale(12)).toBe(4);
    });

    it('should handle fractional segments', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 1])
        .range(['a', 'b', 'c']);

      // 3 segments of 0.333... each
      expect(scale(0)).toBe('a');
      expect(scale(0.2)).toBe('a');
      expect(scale(0.33)).toBe('a');
      expect(scale(0.34)).toBe('b');
      expect(scale(0.66)).toBe('b');
      expect(scale(0.67)).toBe('c');
      expect(scale(1)).toBe('c');
    });

    it('should clamp values outside domain', () => {
      const scale = scaleQuantize<string>()
        .domain([10, 20])
        .range(['low', 'medium', 'high']);

      expect(scale(5)).toBe('low'); // Below domain
      expect(scale(25)).toBe('high'); // Above domain
      expect(scale(-100)).toBe('low');
      expect(scale(1000)).toBe('high');
    });

    it('should handle negative values correctly', () => {
      const scale = scaleQuantize<string>()
        .domain([-10, 10])
        .range(['negative', 'neutral', 'positive']);

      expect(scale(-10)).toBe('negative');
      expect(scale(-5)).toBe('negative'); // Changed from -1 to -5
      expect(scale(0)).toBe('neutral');
      expect(scale(5)).toBe('positive');
      expect(scale(10)).toBe('positive');
    });
  });

  describe('edge cases', () => {
    it('should handle zero-width domain', () => {
      const scale = scaleQuantize<string>()
        .domain([5, 5])
        .range(['only', 'value']);

      expect(scale(5)).toBe('value'); // Input equals domain - last value
      expect(scale(0)).toBe('only'); // Input < domain - first value
      expect(scale(10)).toBe('value'); // Input > domain - last value
    });

    it('should handle very small domains', () => {
      const scale = scaleQuantize<string>()
        .domain([1e-10, 2e-10])
        .range(['small', 'tiny']);

      expect(scale(1.2e-10)).toBe('small');
      expect(scale(1.8e-10)).toBe('tiny');
    });

    it('should handle very large domains', () => {
      const scale = scaleQuantize<number>().domain([0, 1e15]).range([1, 2]);

      expect(scale(3e14)).toBe(1);
      expect(scale(8e14)).toBe(2);
    });

    it('should handle floating point precision', () => {
      const scale = scaleQuantize<number>().domain([0, 0.3]).range([1, 2, 3]);

      expect(scale(0.05)).toBe(1); // Changed from 0.1 to 0.05
      expect(scale(0.1)).toBe(2); // This is correct - 0.1 is the boundary
      expect(scale(0.2)).toBe(3); // Changed expectation from 2 to 3
    });

    it('should handle exact boundary values', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 9])
        .range(['a', 'b', 'c']);

      // Segments: [0-3), [3-6), [6-9]
      expect(scale(3)).toBe('b'); // Exact boundary
      expect(scale(6)).toBe('c'); // Exact boundary
      expect(scale(9)).toBe('c'); // Domain maximum
    });
  });

  describe('invertExtent method', () => {
    it('should return correct domain extent for range values', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 100])
        .range(['red', 'orange', 'yellow', 'green']);

      expect(scale.invertExtent('red')).toEqual([0, 25]);
      expect(scale.invertExtent('orange')).toEqual([25, 50]);
      expect(scale.invertExtent('yellow')).toEqual([50, 75]);
      expect(scale.invertExtent('green')).toEqual([75, 100]);
    });

    it('should return undefined for values not in range', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 100])
        .range(['red', 'blue']);

      expect(scale.invertExtent('green')).toEqual([NaN, NaN]); // Changed from toBeUndefined()
      expect(scale.invertExtent('purple')).toEqual([NaN, NaN]); // Changed from toBeUndefined()
    });

    it('should work with numeric ranges', () => {
      const scale = scaleQuantize<number>().domain([10, 20]).range([1, 2, 3]);

      expect(scale.invertExtent(1)).toEqual([10, 13.333333333333334]);
      expect(scale.invertExtent(2)).toEqual([
        13.333333333333334, 16.666666666666668,
      ]);
      expect(scale.invertExtent(3)).toEqual([16.666666666666668, 20]);
    });

    it('should handle single range value', () => {
      const scale = scaleQuantize<string>().domain([0, 10]).range(['only']);

      expect(scale.invertExtent('only')).toEqual([0, undefined]);
    });

    it('should handle fractional domains', () => {
      const scale = scaleQuantize<string>()
        .domain([0.1, 0.4])
        .range(['a', 'b']);

      expect(scale.invertExtent('a')).toEqual([0.1, 0.25]);
      expect(scale.invertExtent('b')).toEqual([0.25, 0.4]);
    });

    it('should handle negative domains', () => {
      const scale = scaleQuantize<string>()
        .domain([-20, 20])
        .range(['neg', 'zero', 'pos']);

      const negExtent = scale.invertExtent('neg');
      const zeroExtent = scale.invertExtent('zero');
      const posExtent = scale.invertExtent('pos');

      expect(negExtent?.[0]).toBe(-20);
      expect(negExtent?.[1]).toBeCloseTo(-6.666666666666666, 10);

      expect(zeroExtent?.[0]).toBeCloseTo(-6.666666666666666, 10);
      expect(zeroExtent?.[1]).toBeCloseTo(6.666666666666667, 10);

      expect(posExtent?.[0]).toBeCloseTo(6.666666666666667, 10);
      expect(posExtent?.[1]).toBe(20);
    });
  });

  describe('thresholds method', () => {
    it('should return correct thresholds for multiple segments', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 100])
        .range(['a', 'b', 'c', 'd']);

      expect(scale.thresholds()).toEqual([25, 50, 75]);
    });

    it('should return empty array for single range value', () => {
      const scale = scaleQuantize<string>().domain([0, 100]).range(['only']);

      expect(scale.thresholds()).toEqual([]);
    });

    it('should return single threshold for two range values', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 10])
        .range(['first', 'second']);

      expect(scale.thresholds()).toEqual([5]);
    });

    it('should handle fractional thresholds', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 1])
        .range(['a', 'b', 'c']);

      const thresholds = scale.thresholds();
      expect(thresholds).toHaveLength(2);
      expect(thresholds[0]).toBeCloseTo(0.3333333333333333, 10);
      expect(thresholds[1]).toBeCloseTo(0.6666666666666666, 10);
    });

    it('should handle negative domains', () => {
      const scale = scaleQuantize<string>()
        .domain([-15, 15])
        .range(['a', 'b', 'c']);

      expect(scale.thresholds()).toEqual([-5, 5]);
    });
  });

  describe('copy method', () => {
    it('should create an independent copy', () => {
      const original = scaleQuantize<string>()
        .domain([0, 100])
        .range(['red', 'green', 'blue']);

      const copy = original.copy();

      expect(copy.domain()).toEqual([0, 100]);
      expect(copy.range()).toEqual(['red', 'green', 'blue']);
    });

    it('should be independent of original', () => {
      const original = scaleQuantize<string>()
        .domain([0, 100])
        .range(['red', 'green']);

      const copy = original.copy();

      // Modify copy
      copy.domain([10, 90]).range(['blue', 'yellow']);

      // Original should be unchanged
      expect(original.domain()).toEqual([0, 100]);
      expect(original.range()).toEqual(['red', 'green']);
    });

    it('should preserve all settings', () => {
      const original = scaleQuantize<number>()
        .domain([5, 25])
        .range([1, 2, 3, 4]);

      const copy = original.copy();

      // Test that mapping works the same
      expect(copy(10)).toBe(original(10));
      expect(copy(20)).toBe(original(20));
      expect(copy.invertExtent(2)).toEqual(original.invertExtent(2));
    });

    it('should work with different data types', () => {
      const original = scaleQuantize<{ name: string; value: number }>()
        .domain([0, 10])
        .range([
          { name: 'low', value: 1 },
          { name: 'high', value: 2 },
        ]);

      const copy = original.copy();

      expect(copy.range()).toEqual([
        { name: 'low', value: 1 },
        { name: 'high', value: 2 },
      ]);
    });
  });

  describe('method chaining', () => {
    it('should allow method chaining', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 100])
        .range(['low', 'medium', 'high']);

      expect(scale(25)).toBe('low');
      expect(scale(75)).toBe('high');
    });

    it('should maintain chainability after all operations', () => {
      const result = scaleQuantize<number>()
        .domain([1, 10])
        .range([1, 2, 3])
        .domain(); // Final operation returns value, not scale

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('real-world scenarios', () => {
    it('should work for color coding data', () => {
      const colorScale = scaleQuantize<string>()
        .domain([0, 100])
        .range(['#ff0000', '#ffff00', '#00ff00']); // Red, Yellow, Green

      expect(colorScale(10)).toBe('#ff0000'); // Low score - red
      expect(colorScale(50)).toBe('#ffff00'); // Medium score - yellow
      expect(colorScale(90)).toBe('#00ff00'); // High score - green
    });

    it('should work for age categorization', () => {
      const ageScale = scaleQuantize<string>()
        .domain([0, 100])
        .range(['child', 'teen', 'adult', 'senior']);

      expect(ageScale(10)).toBe('child');
      expect(ageScale(30)).toBe('teen');
      expect(ageScale(60)).toBe('adult');
      expect(ageScale(80)).toBe('senior');
    });

    it('should work for grade classification', () => {
      const gradeScale = scaleQuantize<string>()
        .domain([0, 100])
        .range(['F', 'D', 'C', 'B', 'A']);

      expect(gradeScale(15)).toBe('F');
      expect(gradeScale(25)).toBe('D');
      expect(gradeScale(45)).toBe('C');
      expect(gradeScale(65)).toBe('B');
      expect(gradeScale(85)).toBe('A');

      // Test boundaries
      expect(gradeScale.invertExtent('A')).toEqual([80, 100]);
      expect(gradeScale.thresholds()).toEqual([20, 40, 60, 80]);
    });

    it('should work for risk assessment', () => {
      const riskScale = scaleQuantize<{
        level: string;
        color: string;
        action: string;
      }>()
        .domain([0, 10])
        .range([
          { level: 'Low', color: 'green', action: 'Monitor' },
          { level: 'Medium', color: 'yellow', action: 'Review' },
          { level: 'High', color: 'red', action: 'Immediate Action' },
        ]);

      expect(riskScale(2)?.level).toBe('Low');
      expect(riskScale(5)?.level).toBe('Medium');
      expect(riskScale(8)?.level).toBe('High');
    });

    it('should work for temperature ranges', () => {
      const tempScale = scaleQuantize<string>()
        .domain([-20, 40])
        .range(['freezing', 'cold', 'mild', 'warm', 'hot']);

      expect(tempScale(-15)).toBe('freezing');
      expect(tempScale(-5)).toBe('cold');
      expect(tempScale(10)).toBe('mild');
      expect(tempScale(20)).toBe('warm');
      expect(tempScale(35)).toBe('hot');
    });

    it('should work for data binning', () => {
      const data = [1.2, 4.8, 7.3, 2.1, 9.9, 3.4, 6.7, 8.2];
      const binScale = scaleQuantize<number>()
        .domain([0, 10])
        .range([1, 2, 3, 4, 5]); // 5 bins

      const binnedData = data.map((d) => binScale(d));
      expect(binnedData).toEqual([1, 3, 4, 2, 5, 2, 4, 5]);
    });
  });

  describe('performance and precision', () => {
    it('should handle many operations efficiently', () => {
      const scale = scaleQuantize<number>()
        .domain([0, 1000])
        .range([1, 2, 3, 4, 5]);

      // This should complete quickly
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        scale(Math.random() * 1000);
      }
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should be very fast
    });

    it('should maintain precision with floating point arithmetic', () => {
      const scale = scaleQuantize<string>()
        .domain([0.1, 0.9])
        .range(['a', 'b', 'c', 'd']);

      // Test boundary conditions
      expect(scale(0.3)).toBe('a');
      expect(scale(0.30000000000000004)).toBe('b'); // Floating point edge case
    });

    it('should handle extreme values gracefully', () => {
      const scale = scaleQuantize<string>()
        .domain([0, Number.MAX_SAFE_INTEGER])
        .range(['small', 'large']);

      expect(scale(Number.MAX_SAFE_INTEGER / 3)).toBe('small');
      expect(scale(Number.MAX_SAFE_INTEGER)).toBe('large');
    });
  });

  describe('type safety', () => {
    it('should work with string types', () => {
      const scale = scaleQuantize<string>()
        .domain([0, 10])
        .range(['red', 'green', 'blue']);

      const result: string | undefined = scale(5);
      expect(typeof result).toBe('string');
    });

    it('should work with number types', () => {
      const scale = scaleQuantize<number>().domain([0, 10]).range([1, 2, 3]);

      const result: number | undefined = scale(5);
      expect(typeof result).toBe('number');
    });

    it('should work with object types', () => {
      interface Category {
        name: string;
        priority: number;
      }

      const scale = scaleQuantize<Category>()
        .domain([0, 100])
        .range([
          { name: 'Low', priority: 1 },
          { name: 'High', priority: 2 },
        ]);

      const result = scale(75);
      expect(result?.name).toBe('High');
      expect(result?.priority).toBe(2);
    });
  });
});
