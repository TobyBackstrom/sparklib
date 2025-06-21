import { scaleLinear } from '../../lib/utils/scale';

describe('scaleLinear', () => {
  describe('basic functionality', () => {
    it('should create a scale with default domain [0,1] and range [0,1]', () => {
      const scale = scaleLinear();
      expect(scale.domain()).toEqual([0, 1]);
      expect(scale.range()).toEqual([0, 1]);
    });

    it('should map values correctly with default domain and range', () => {
      const scale = scaleLinear();
      expect(scale(0)).toBe(0);
      expect(scale(0.5)).toBe(0.5);
      expect(scale(1)).toBe(1);
    });

    it('should map values correctly with custom domain and range', () => {
      const scale = scaleLinear().domain([0, 100]).range([0, 500]);

      expect(scale(0)).toBe(0);
      expect(scale(50)).toBe(250);
      expect(scale(100)).toBe(500);
    });

    it('should handle negative domains and ranges', () => {
      const scale = scaleLinear().domain([-100, 100]).range([-50, 50]);

      expect(scale(-100)).toBe(-50);
      expect(scale(0)).toBe(0);
      expect(scale(100)).toBe(50);
      expect(scale(-50)).toBe(-25);
    });

    it('should handle inverted domains', () => {
      const scale = scaleLinear().domain([100, 0]).range([0, 500]);

      expect(scale(100)).toBe(0);
      expect(scale(50)).toBe(250);
      expect(scale(0)).toBe(500);
    });

    it('should handle inverted ranges', () => {
      const scale = scaleLinear().domain([0, 100]).range([500, 0]);

      expect(scale(0)).toBe(500);
      expect(scale(50)).toBe(250);
      expect(scale(100)).toBe(0);
    });

    it('should handle both domain and range inverted', () => {
      const scale = scaleLinear().domain([100, 0]).range([500, 0]);

      expect(scale(100)).toBe(500);
      expect(scale(50)).toBe(250);
      expect(scale(0)).toBe(0);
    });
  });

  describe('domain method', () => {
    it('should set and get domain', () => {
      const scale = scaleLinear();
      expect(scale.domain()).toEqual([0, 1]);

      scale.domain([10, 20]);
      expect(scale.domain()).toEqual([10, 20]);
    });

    it('should return a copy of domain array', () => {
      const scale = scaleLinear();
      const domain = scale.domain();
      domain[0] = 999;
      expect(scale.domain()).toEqual([0, 1]); // Should be unchanged
    });

    it('should chain when setting domain', () => {
      const scale = scaleLinear();
      const result = scale.domain([5, 15]);
      expect(result).toBe(scale);
    });

    it('should handle fractional domains', () => {
      const scale = scaleLinear().domain([0.1, 0.9]);
      expect(scale.domain()).toEqual([0.1, 0.9]);
    });

    it('should handle very large domains', () => {
      const scale = scaleLinear().domain([0, 1e15]);
      expect(scale.domain()).toEqual([0, 1e15]);
    });
  });

  describe('range method', () => {
    it('should set and get range', () => {
      const scale = scaleLinear();
      expect(scale.range()).toEqual([0, 1]);

      scale.range([100, 200]);
      expect(scale.range()).toEqual([100, 200]);
    });

    it('should return a copy of range array', () => {
      const scale = scaleLinear();
      const range = scale.range();
      range[0] = 999;
      expect(scale.range()).toEqual([0, 1]); // Should be unchanged
    });

    it('should chain when setting range', () => {
      const scale = scaleLinear();
      const result = scale.range([5, 15]);
      expect(result).toBe(scale);
    });

    it('should handle fractional ranges', () => {
      const scale = scaleLinear().range([0.5, 10.7]);
      expect(scale.range()).toEqual([0.5, 10.7]);
    });

    it('should handle very large ranges', () => {
      const scale = scaleLinear().range([0, 1e10]);
      expect(scale.range()).toEqual([0, 1e10]);
    });
  });

  describe('linear interpolation', () => {
    it('should interpolate correctly between domain and range', () => {
      const scale = scaleLinear().domain([0, 10]).range([0, 100]);

      expect(scale(0)).toBe(0);
      expect(scale(2.5)).toBe(25);
      expect(scale(5)).toBe(50);
      expect(scale(7.5)).toBe(75);
      expect(scale(10)).toBe(100);
    });

    it('should handle values outside domain (extrapolation)', () => {
      const scale = scaleLinear().domain([0, 10]).range([0, 100]);

      expect(scale(-5)).toBe(-50);
      expect(scale(15)).toBe(150);
    });

    it('should handle fractional interpolation', () => {
      const scale = scaleLinear().domain([0, 1]).range([0, 10]);

      expect(scale(0.33)).toBeCloseTo(3.3, 10);
      expect(scale(0.666)).toBeCloseTo(6.66, 10);
    });

    it('should maintain precision with floating point numbers', () => {
      const scale = scaleLinear().domain([0.1, 0.9]).range([10.5, 90.7]);

      const result = scale(0.5);
      expect(result).toBeCloseTo(50.6, 10);
    });
  });

  describe('edge cases', () => {
    it('should handle zero-width domain', () => {
      const scale = scaleLinear().domain([5, 5]).range([0, 100]);

      expect(scale(5)).toBe(50);
      expect(scale(0)).toBe(50);
      expect(scale(10)).toBe(50);
    });

    it('should handle zero-width range', () => {
      const scale = scaleLinear().domain([0, 10]).range([50, 50]);

      expect(scale(0)).toBe(50);
      expect(scale(5)).toBe(50);
      expect(scale(10)).toBe(50);
    });

    it('should handle zero values in domain and range', () => {
      const scale = scaleLinear().domain([0, 0]).range([0, 0]);

      expect(scale(0)).toBe(0);
      expect(scale(1)).toBe(0);
    });

    it('should handle very small domains', () => {
      const scale = scaleLinear().domain([1e-10, 2e-10]).range([0, 100]);

      expect(scale(1.5e-10)).toBeCloseTo(50, 10);
    });

    it('should handle very large values', () => {
      const scale = scaleLinear().domain([0, 1e15]).range([0, 1000]);

      expect(scale(5e14)).toBe(500);
    });

    it('should handle negative zero', () => {
      const scale = scaleLinear().domain([-0, 1]).range([0, 100]);

      expect(scale(0)).toBe(0);
      expect(scale(-0)).toBe(0);
    });
  });

  describe('invert method', () => {
    it('should invert values correctly', () => {
      const scale = scaleLinear().domain([0, 100]).range([0, 500]);

      expect(scale.invert(0)).toBe(0);
      expect(scale.invert(250)).toBe(50);
      expect(scale.invert(500)).toBe(100);
    });

    it('should invert values with negative domains', () => {
      const scale = scaleLinear().domain([-50, 50]).range([0, 100]);

      expect(scale.invert(0)).toBe(-50);
      expect(scale.invert(50)).toBe(0);
      expect(scale.invert(100)).toBe(50);
    });

    it('should invert values with inverted domain', () => {
      const scale = scaleLinear().domain([100, 0]).range([0, 500]);

      expect(scale.invert(0)).toBe(100);
      expect(scale.invert(250)).toBe(50);
      expect(scale.invert(500)).toBe(0);
    });

    it('should invert values with inverted range', () => {
      const scale = scaleLinear().domain([0, 100]).range([500, 0]);

      expect(scale.invert(500)).toBe(0);
      expect(scale.invert(250)).toBe(50);
      expect(scale.invert(0)).toBe(100);
    });

    it('should handle invert with zero-width range', () => {
      const scale = scaleLinear().domain([0, 100]).range([50, 50]);

      expect(scale.invert(50)).toBe(50);
      expect(scale.invert(0)).toBe(50);
      expect(scale.invert(100)).toBe(50);
    });

    it('should be inverse of forward mapping', () => {
      const scale = scaleLinear().domain([10, 90]).range([100, 800]);

      const testValues = [10, 25, 50, 75, 90];
      testValues.forEach((value) => {
        const mapped = scale(value);
        const inverted = scale.invert(mapped);
        expect(inverted).toBeCloseTo(value, 10);
      });
    });
  });

  describe('clamp method', () => {
    it('should get and set clamp state', () => {
      const scale = scaleLinear();
      expect(scale.clamp()).toBe(false);

      scale.clamp(true);
      expect(scale.clamp()).toBe(true);

      scale.clamp(false);
      expect(scale.clamp()).toBe(false);
    });

    it('should chain when setting clamp', () => {
      const scale = scaleLinear();
      const result = scale.clamp(true);
      expect(result).toBe(scale);
    });

    it('should clamp values to range when enabled', () => {
      const scale = scaleLinear().domain([0, 100]).range([0, 500]).clamp(true);

      expect(scale(-10)).toBe(0); // Below range
      expect(scale(50)).toBe(250); // Within range
      expect(scale(150)).toBe(500); // Above range
    });

    it('should not clamp when disabled', () => {
      const scale = scaleLinear().domain([0, 100]).range([0, 500]).clamp(false);

      expect(scale(-10)).toBe(-50); // Extrapolated
      expect(scale(150)).toBe(750); // Extrapolated
    });

    it('should clamp with inverted range', () => {
      const scale = scaleLinear().domain([0, 100]).range([500, 0]).clamp(true);

      expect(scale(-10)).toBe(500); // Clamped to max
      expect(scale(150)).toBe(0); // Clamped to min
    });

    it('should clamp with negative ranges', () => {
      const scale = scaleLinear()
        .domain([0, 100])
        .range([-100, -500])
        .clamp(true);

      expect(scale(-10)).toBe(-100); // Clamped to max (less negative)
      expect(scale(150)).toBe(-500); // Clamped to min (more negative)
    });
  });

  describe('nice method', () => {
    it('should round domain to nice numbers', () => {
      const scale = scaleLinear().domain([0.2, 99.7]).nice();

      expect(scale.domain()).toEqual([0, 100]);
    });

    it('should chain when calling nice', () => {
      const scale = scaleLinear();
      const result = scale.nice();
      expect(result).toBe(scale);
    });

    it('should handle negative domains', () => {
      const scale = scaleLinear().domain([-99.7, -0.2]).nice();

      const [min, max] = scale.domain();
      expect(min).toBe(-100);
      expect(max === 0).toBe(true);
    });

    it('should handle mixed positive/negative domains', () => {
      const scale = scaleLinear().domain([-45.2, 67.8]).nice();

      expect(scale.domain()).toEqual([-50, 70]);
    });

    it('should handle very small domains', () => {
      const scale = scaleLinear().domain([1e-10, 2e-10]).range([0, 100]);

      expect(scale(1.5e-10)).toBeCloseTo(50, 10);
    });

    it('should handle zero-width domains', () => {
      const scale = scaleLinear().domain([5, 5]).nice();

      expect(scale.domain()).toEqual([5, 5]);
    });

    it('should accept count parameter', () => {
      const scale = scaleLinear().domain([1.2, 8.7]).nice(4);

      // Should create approximately 4 nice intervals
      const [min, max] = scale.domain();
      expect(min).toBeLessThanOrEqual(1.2);
      expect(max).toBeGreaterThanOrEqual(8.7);
      expect(min % 1).toBe(0); // Should be whole number
    });

    it('should handle large domains', () => {
      const scale = scaleLinear().domain([123456, 987654]).nice();

      const [min, max] = scale.domain();
      expect(min).toBeLessThanOrEqual(123456);
      expect(max).toBeGreaterThanOrEqual(987654);
    });
  });

  describe('ticks method', () => {
    it('should generate approximately the requested number of ticks', () => {
      const scale = scaleLinear().domain([0, 100]);
      const ticks = scale.ticks(5);

      expect(ticks.length).toBeGreaterThanOrEqual(3);
      expect(ticks.length).toBeLessThanOrEqual(7);
      expect(ticks).toContain(0);
      expect(ticks).toContain(100);
    });

    it('should generate ticks within domain bounds', () => {
      const scale = scaleLinear().domain([10, 90]);
      const ticks = scale.ticks(10);

      ticks.forEach((tick) => {
        expect(tick).toBeGreaterThanOrEqual(10);
        expect(tick).toBeLessThanOrEqual(90);
      });
    });

    it('should generate nice round ticks', () => {
      const scale = scaleLinear().domain([0, 100]);
      const ticks = scale.ticks(5);

      // Should be nice round numbers
      ticks.forEach((tick) => {
        expect(tick % 25 === 0 || tick % 20 === 0 || tick % 10 === 0).toBe(
          true,
        );
      });
    });

    it('should handle negative domains', () => {
      const scale = scaleLinear().domain([-50, 50]);
      const ticks = scale.ticks(5);

      expect(ticks).toContain(0);
      expect(Math.min(...ticks)).toBe(-40);
      expect(Math.max(...ticks)).toBeGreaterThanOrEqual(40);
    });

    it('should handle fractional domains', () => {
      const scale = scaleLinear().domain([0.1, 0.9]);
      const ticks = scale.ticks(5);

      ticks.forEach((tick) => {
        expect(tick).toBeGreaterThanOrEqual(0.1);
        expect(tick).toBeLessThanOrEqual(0.9);
      });
    });

    it('should handle zero-width domains', () => {
      const scale = scaleLinear().domain([5, 5]);
      const ticks = scale.ticks(5);

      expect(ticks).toEqual([5]);
    });

    it('should use default count of 10', () => {
      const scale = scaleLinear().domain([0, 100]);
      const ticks = scale.ticks();

      expect(ticks.length).toBeGreaterThanOrEqual(5);
      expect(ticks.length).toBeLessThanOrEqual(15);
    });

    it('should handle very small domains', () => {
      const scale = scaleLinear().domain([0.001, 0.002]);
      const ticks = scale.ticks(5);

      ticks.forEach((tick) => {
        expect(tick).toBeGreaterThanOrEqual(0.001);
        expect(tick).toBeLessThanOrEqual(0.002);
      });
    });

    it('should generate ascending ticks', () => {
      const scale = scaleLinear().domain([10, 90]);
      const ticks = scale.ticks(5);

      for (let i = 1; i < ticks.length; i++) {
        expect(ticks[i]).toBeGreaterThan(ticks[i - 1]);
      }
    });
  });

  describe('copy method', () => {
    it('should create an independent copy', () => {
      const original = scaleLinear()
        .domain([0, 100])
        .range([0, 500])
        .clamp(true);

      const copy = original.copy();

      expect(copy.domain()).toEqual([0, 100]);
      expect(copy.range()).toEqual([0, 500]);
      expect(copy.clamp()).toBe(true);
    });

    it('should be independent of original', () => {
      const original = scaleLinear().domain([0, 100]).range([0, 500]);

      const copy = original.copy();

      // Modify copy
      copy.domain([10, 90]).range([50, 450]);

      // Original should be unchanged
      expect(original.domain()).toEqual([0, 100]);
      expect(original.range()).toEqual([0, 500]);
    });

    it('should preserve all settings', () => {
      const original = scaleLinear()
        .domain([-50, 150])
        .range([100, 800])
        .clamp(true);

      const copy = original.copy();

      // Test that mapping works the same
      expect(copy(0)).toBe(original(0));
      expect(copy(100)).toBe(original(100));
      expect(copy(-100)).toBe(original(-100)); // Should be clamped
    });

    it('should create scales that work independently', () => {
      const scale1 = scaleLinear().domain([0, 10]);
      const scale2 = scale1.copy().domain([0, 20]);

      expect(scale1(5)).toBe(0.5); // 5/10 = 0.5
      expect(scale2(5)).toBe(0.25); // 5/20 = 0.25
    });
  });

  describe('method chaining', () => {
    it('should allow method chaining', () => {
      const scale = scaleLinear()
        .domain([0, 100])
        .range([0, 500])
        .clamp(true)
        .nice();

      expect(scale(50)).toBe(250);
      expect(scale.clamp()).toBe(true);
    });

    it('should maintain chainability after all operations', () => {
      const result = scaleLinear()
        .domain([1.2, 99.8])
        .range([10, 990])
        .clamp(true)
        .nice()
        .domain(); // Final operation returns value, not scale

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('real-world scenarios', () => {
    it('should work for chart width mapping', () => {
      const xScale = scaleLinear().domain([0, 100]).range([50, 750]); // Chart margins

      expect(xScale(0)).toBe(50);
      expect(xScale(50)).toBe(400);
      expect(xScale(100)).toBe(750);
    });

    it('should work for chart height mapping (inverted)', () => {
      const yScale = scaleLinear().domain([0, 100]).range([400, 50]); // SVG coordinates (inverted Y)

      expect(yScale(0)).toBe(400); // Bottom
      expect(yScale(50)).toBe(225); // Middle
      expect(yScale(100)).toBe(50); // Top
    });

    it('should work for color opacity mapping', () => {
      const opacityScale = scaleLinear()
        .domain([0, 100])
        .range([0.1, 1.0])
        .clamp(true);

      expect(opacityScale(0)).toBe(0.1);
      expect(opacityScale(50)).toBe(0.55);
      expect(opacityScale(100)).toBe(1.0);
      expect(opacityScale(150)).toBe(1.0); // Clamped
    });

    it('should work for temperature conversion', () => {
      // Celsius to Fahrenheit: F = C * 9/5 + 32
      const tempScale = scaleLinear()
        .domain([0, 100]) // Celsius
        .range([32, 212]); // Fahrenheit

      expect(tempScale(0)).toBe(32); // Freezing
      expect(tempScale(100)).toBe(212); // Boiling
      expect(tempScale(37)).toBeCloseTo(98.6, 1); // Body temp
    });

    it('should handle data normalization', () => {
      const data = [10, 25, 50, 75, 90];
      const max = Math.max(...data);
      const min = Math.min(...data);

      const normalizeScale = scaleLinear().domain([min, max]).range([0, 1]);

      expect(normalizeScale(10)).toBe(0);
      expect(normalizeScale(90)).toBe(1);
      expect(normalizeScale(50)).toBe(0.5);
    });

    it('should work with time-like numeric data', () => {
      // Map timestamps to pixel positions
      const timeScale = scaleLinear()
        .domain([1609459200000, 1640995200000]) // 2021-2022 in ms
        .range([0, 1000]);

      const midYear = (1609459200000 + 1640995200000) / 2;
      expect(timeScale(midYear)).toBeCloseTo(500, 0);
    });
  });

  describe('performance and precision', () => {
    it('should handle many operations efficiently', () => {
      const scale = scaleLinear().domain([0, 1000]).range([0, 500]);

      // This should complete quickly
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        scale(Math.random() * 1000);
      }
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should be very fast
    });

    it('should maintain precision with floating point arithmetic', () => {
      const scale = scaleLinear().domain([0.1, 0.9]).range([0.2, 0.8]);

      const result = scale(0.5);
      expect(result).toBeCloseTo(0.5, 10);
    });

    it('should handle extreme values gracefully', () => {
      const scale = scaleLinear()
        .domain([0, Number.MAX_SAFE_INTEGER])
        .range([0, 1000]);

      expect(scale(Number.MAX_SAFE_INTEGER / 2)).toBeCloseTo(500, 0);
      expect(isFinite(scale(Number.MAX_SAFE_INTEGER))).toBe(true);
    });
  });
});
