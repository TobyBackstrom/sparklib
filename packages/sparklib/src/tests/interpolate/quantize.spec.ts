/**
 * Test suite for quantize function. Tests edge cases, different interpolator types, mathematical correctness, and compatibility with D3.
 */
import { quantize } from '../../lib/utils/interpolate';
//import { quantize } from 'd3-interpolate';

describe('quantize', () => {
  /**
   * Simple linear interpolator for testing
   */
  function linearInterpolator(t: number): number {
    return t * 100;
  }

  /**
   * Color-like interpolator for testing
   */
  function colorInterpolator(t: number): string {
    const r = Math.round(255 * (1 - t));
    const g = 0;
    const b = Math.round(255 * t);
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Object interpolator for testing
   */
  function objectInterpolator(t: number): { x: number; y: number } {
    return {
      x: t * 10,
      y: t * 20,
    };
  }

  /**
   * Helper to check array equality with tolerance for floating point numbers
   */
  function expectArraysToBeClose(
    actual: number[],
    expected: number[],
    tolerance = 1e-10,
  ): void {
    expect(actual).toHaveLength(expected.length);
    for (let i = 0; i < actual.length; i++) {
      expect(Math.abs(actual[i] - expected[i])).toBeLessThan(tolerance);
    }
  }

  describe('Basic Functionality', () => {
    test('should generate correct number of samples', () => {
      const result = quantize(linearInterpolator, 5);
      expect(result).toHaveLength(5);
    });

    test('should call interpolator with correct t values for n=2', () => {
      const mockInterpolator = jest.fn().mockReturnValue(0);
      quantize(mockInterpolator, 2);

      expect(mockInterpolator).toHaveBeenCalledTimes(2);
      expect(mockInterpolator).toHaveBeenNthCalledWith(1, 0);
      expect(mockInterpolator).toHaveBeenNthCalledWith(2, 1);
    });

    test('should call interpolator with correct t values for n=3', () => {
      const mockInterpolator = jest.fn().mockReturnValue(0);
      quantize(mockInterpolator, 3);

      expect(mockInterpolator).toHaveBeenCalledTimes(3);
      expect(mockInterpolator).toHaveBeenNthCalledWith(1, 0);
      expect(mockInterpolator).toHaveBeenNthCalledWith(2, 0.5);
      expect(mockInterpolator).toHaveBeenNthCalledWith(3, 1);
    });

    test('should call interpolator with correct t values for n=4', () => {
      const mockInterpolator = jest.fn().mockReturnValue(0);
      quantize(mockInterpolator, 4);

      expect(mockInterpolator).toHaveBeenCalledTimes(4);
      expect(mockInterpolator).toHaveBeenNthCalledWith(1, 0);
      expect(mockInterpolator).toHaveBeenNthCalledWith(2, 1 / 3);
      expect(mockInterpolator).toHaveBeenNthCalledWith(3, 2 / 3);
      expect(mockInterpolator).toHaveBeenNthCalledWith(4, 1);
    });

    test('should call interpolator with correct t values for n=5', () => {
      const mockInterpolator = jest.fn().mockReturnValue(0);
      quantize(mockInterpolator, 5);

      expect(mockInterpolator).toHaveBeenCalledTimes(5);
      expect(mockInterpolator).toHaveBeenNthCalledWith(1, 0);
      expect(mockInterpolator).toHaveBeenNthCalledWith(2, 0.25);
      expect(mockInterpolator).toHaveBeenNthCalledWith(3, 0.5);
      expect(mockInterpolator).toHaveBeenNthCalledWith(4, 0.75);
      expect(mockInterpolator).toHaveBeenNthCalledWith(5, 1);
    });
  });

  describe('Mathematical Correctness', () => {
    test('should always start with t=0 and end with t=1', () => {
      const values = [2, 3, 4, 5, 10, 20, 100];

      values.forEach((n) => {
        const mockInterpolator = jest.fn().mockReturnValue(0);
        quantize(mockInterpolator, n);

        expect(mockInterpolator).toHaveBeenCalledWith(0);
        expect(mockInterpolator).toHaveBeenCalledWith(1);
      });
    });

    test('should generate evenly spaced t values', () => {
      const capturedTValues: number[] = [];
      const capturingInterpolator = (t: number): number => {
        capturedTValues.push(t);
        return t;
      };

      quantize(capturingInterpolator, 6);

      const expected = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
      expectArraysToBeClose(capturedTValues, expected);
    });

    test('should work with linear interpolator', () => {
      const result = quantize(linearInterpolator, 5);
      expect(result).toEqual([0, 25, 50, 75, 100]);
    });

    test('should handle n=2 edge case', () => {
      const result = quantize(linearInterpolator, 2);
      expect(result).toEqual([0, 100]);
    });

    test('should be consistent with formula i/(n-1)', () => {
      const n = 7;
      const result = quantize(linearInterpolator, n);
      const expected = Array.from({ length: n }, (_, i) => (i / (n - 1)) * 100);
      expectArraysToBeClose(result, expected);
    });
  });

  describe('Type Safety and Generics', () => {
    test('should work with number interpolators', () => {
      const result = quantize(linearInterpolator, 3);
      expect(result).toEqual([0, 50, 100]);
      expect(typeof result[0]).toBe('number');
    });

    test('should work with string interpolators', () => {
      const stringInterpolator = (t: number): string =>
        `value-${Math.round(t * 10)}`;
      const result = quantize(stringInterpolator, 4);

      expect(result).toEqual(['value-0', 'value-3', 'value-7', 'value-10']);
      expect(typeof result[0]).toBe('string');
    });

    test('should work with object interpolators', () => {
      const result = quantize(objectInterpolator, 3);

      expect(result).toEqual([
        { x: 0, y: 0 },
        { x: 5, y: 10 },
        { x: 10, y: 20 },
      ]);
      expect(typeof result[0]).toBe('object');
    });

    test('should work with boolean interpolators', () => {
      const booleanInterpolator = (t: number): boolean => t >= 0.5;
      const result = quantize(booleanInterpolator, 4);

      expect(result).toEqual([false, false, true, true]);
      expect(typeof result[0]).toBe('boolean');
    });

    test('should work with array interpolators', () => {
      const arrayInterpolator = (t: number): number[] => [t * 2, t * 3];
      const result = quantize(arrayInterpolator, 3);

      expect(result).toEqual([
        [0, 0],
        [1, 1.5],
        [2, 3],
      ]);
      expect(Array.isArray(result[0])).toBe(true);
    });
  });

  describe('Color Interpolation Integration', () => {
    test('should work with RGB color interpolator', () => {
      const result = quantize(colorInterpolator, 3);

      expect(result).toEqual([
        'rgb(255, 0, 0)', // t=0: red
        'rgb(128, 0, 128)', // t=0.5: purple
        'rgb(0, 0, 255)', // t=1: blue
      ]);
    });

    test('should generate smooth color transitions', () => {
      const result = quantize(colorInterpolator, 5);

      // Check that red component decreases and blue increases
      const redValues = result.map((color) => {
        const match = color.match(/rgb\((\d+), \d+, \d+\)/);
        return match ? parseInt(match[1], 10) : 0;
      });

      const blueValues = result.map((color) => {
        const match = color.match(/rgb\(\d+, \d+, (\d+)\)/);
        return match ? parseInt(match[1], 10) : 0;
      });

      // Red should decrease monotonically
      for (let i = 1; i < redValues.length; i++) {
        expect(redValues[i]).toBeLessThanOrEqual(redValues[i - 1]);
      }

      // Blue should increase monotonically
      for (let i = 1; i < blueValues.length; i++) {
        expect(blueValues[i]).toBeGreaterThanOrEqual(blueValues[i - 1]);
      }
    });
  });

  describe('Edge Cases and Robustness', () => {
    test('should handle n=1 (though mathematically unusual)', () => {
      const mockInterpolator = jest.fn().mockReturnValue(42);
      const result = quantize(mockInterpolator, 1);

      expect(result).toHaveLength(1);
      expect(mockInterpolator).toHaveBeenCalledWith(NaN); // 0/(1-1) = 0/0 = NaN
      expect(result[0]).toBe(42);
    });

    test('should handle interpolators that return null', () => {
      const nullInterpolator = (): null => null;
      const result = quantize(nullInterpolator, 3);

      expect(result).toEqual([null, null, null]);
    });

    test('should handle interpolators that return undefined', () => {
      const undefinedInterpolator = (): undefined => undefined;
      const result = quantize(undefinedInterpolator, 3);

      expect(result).toEqual([undefined, undefined, undefined]);
    });

    test('should handle interpolators that throw errors', () => {
      const errorInterpolator = (): never => {
        throw new Error('Interpolator error');
      };

      expect(() => quantize(errorInterpolator, 3)).toThrow(
        'Interpolator error',
      );
    });

    test('should handle large n values', () => {
      const mockInterpolator = jest.fn().mockImplementation((t: number) => t);
      const result = quantize(mockInterpolator, 1000);

      expect(result).toHaveLength(1000);
      expect(mockInterpolator).toHaveBeenCalledTimes(1000);
      expect(result[0]).toBe(0);
      expect(result[999]).toBe(1);
    });

    test('should handle zero n (edge case)', () => {
      const mockInterpolator = jest.fn().mockReturnValue(0);
      const result = quantize(mockInterpolator, 0);

      expect(result).toHaveLength(0);
      expect(mockInterpolator).not.toHaveBeenCalled();
    });

    test('should handle negative n (edge case)', () => {
      const mockInterpolator = jest.fn().mockReturnValue(0);

      expect(() => {
        quantize(mockInterpolator, -5);
      }).toThrow('Invalid array length');
    });
  });

  describe('Performance Characteristics', () => {
    test('should be efficient for moderate array sizes', () => {
      const start = Date.now();
      const result = quantize(linearInterpolator, 10000);
      const duration = Date.now() - start;

      expect(result).toHaveLength(10000);
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should call interpolator exactly n times', () => {
      const mockInterpolator = jest.fn().mockReturnValue(0);

      [2, 5, 10, 50, 100].forEach((n) => {
        mockInterpolator.mockClear();
        quantize(mockInterpolator, n);
        expect(mockInterpolator).toHaveBeenCalledTimes(n);
      });
    });
  });

  describe('Consistency and Determinism', () => {
    test('should return same results for same inputs', () => {
      const result1 = quantize(linearInterpolator, 7);
      const result2 = quantize(linearInterpolator, 7);

      expect(result1).toEqual(result2);
    });

    test('should be deterministic across multiple calls', () => {
      const results: number[][] = [];

      for (let i = 0; i < 5; i++) {
        results.push(quantize(linearInterpolator, 6));
      }

      // All results should be identical
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toEqual(results[0]);
      }
    });

    test('should maintain order of interpolated values', () => {
      const result = quantize(linearInterpolator, 10);

      // Should be monotonically increasing for linear interpolator
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
      }
    });
  });

  describe('Integration with Real Interpolators', () => {
    test('should work with mathematical functions', () => {
      const quadraticInterpolator = (t: number): number => t * t * 100;
      const result = quantize(quadraticInterpolator, 5);

      expect(result).toEqual([0, 6.25, 25, 56.25, 100]);
    });

    test('should work with trigonometric functions', () => {
      const sineInterpolator = (t: number): number => Math.sin(t * Math.PI);
      const result = quantize(sineInterpolator, 5);

      expectArraysToBeClose(
        result,
        [0, Math.sin(Math.PI / 4), 1, Math.sin((3 * Math.PI) / 4), 0],
        1e-10,
      );
    });

    test('should work with step functions', () => {
      const stepInterpolator = (t: number): string =>
        t < 0.5 ? 'low' : 'high';
      const result = quantize(stepInterpolator, 6);

      expect(result).toEqual(['low', 'low', 'low', 'high', 'high', 'high']);
    });
  });

  describe('Regression Tests', () => {
    test('should match known D3 behavior for simple cases', () => {
      // These values can be verified against D3's quantize implementation
      const result = quantize(linearInterpolator, 4);
      expectArraysToBeClose(result, [0, 100 / 3, 200 / 3, 100], 1e-10);
    });

    test('should handle fractional results correctly', () => {
      const fractionalInterpolator = (t: number): number => t / 3;
      const result = quantize(fractionalInterpolator, 4);

      expectArraysToBeClose(result, [0, 1 / 9, 2 / 9, 1 / 3]);
    });

    test('should preserve interpolator return type exactly', () => {
      const mixedInterpolator = (t: number): number | string => {
        return t < 0.5 ? t : `value-${t}`;
      };

      const result = quantize(mixedInterpolator, 4);

      expect(typeof result[0]).toBe('number');
      expect(typeof result[1]).toBe('number');
      expect(typeof result[2]).toBe('string');
      expect(typeof result[3]).toBe('string');
    });
  });
});
