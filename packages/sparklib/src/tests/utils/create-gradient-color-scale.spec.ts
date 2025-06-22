/**
 * Tests functionality, caching, edge cases, performance, and integration scenarios.
 */
import {
  createGradientColorScale,
  clearColorScaleCache,
  getColorScaleCacheSize,
  getColorScaleCacheStats,
} from '../../lib/utils/create-gradient-color-scale';
import { Range } from '../../lib/models';

describe('createGradientColorScale', () => {
  /**
   * Helper to check if a string is a valid RGB color
   */
  function isValidRgbColor(color: string): boolean {
    return /^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(color);
  }

  // Clear cache before each test to ensure test isolation
  beforeEach(() => {
    clearColorScaleCache();
  });

  describe('Basic Functionality', () => {
    test('should create a working color scale function', () => {
      const colorScale = createGradientColorScale([0, 100], ['red', 'blue'], 5);

      expect(typeof colorScale).toBe('function');

      // Test that it returns valid colors
      const color1 = colorScale(0);
      const color2 = colorScale(50);
      const color3 = colorScale(100);

      expect(isValidRgbColor(color1)).toBe(true);
      expect(isValidRgbColor(color2)).toBe(true);
      expect(isValidRgbColor(color3)).toBe(true);
    });

    test('should map domain boundaries correctly', () => {
      const colorScale = createGradientColorScale(
        [10, 90],
        ['red', 'green', 'blue'],
        10,
      );

      const minColor = colorScale(10); // Should map to first discrete level
      const maxColor = colorScale(90); // Should map to last discrete level

      expect(isValidRgbColor(minColor)).toBe(true);
      expect(isValidRgbColor(maxColor)).toBe(true);

      // Values outside domain should be clamped
      expect(colorScale(5)).toBe(minColor); // Below min
      expect(colorScale(100)).toBe(maxColor); // Above max
    });

    test('should create discrete color levels', () => {
      const colorScale = createGradientColorScale(
        [0, 10],
        ['black', 'white'],
        3, // Should create 3 discrete levels
      );

      // Test that values in the same quantile return the same color
      const color1 = colorScale(0);
      const color2 = colorScale(3.2); // Same quantile as 0
      const color3 = colorScale(6.8); // Different quantile

      expect(color1).toBe(color2); // Same quantile, same color
      expect(color1).not.toBe(color3); // Different quantile, different color
    });

    test('should interpolate colors smoothly across the spectrum', () => {
      const colorScale = createGradientColorScale(
        [0, 100],
        ['red', 'green', 'blue'],
        11, // More levels for smoother transitions
      );

      const colors: string[] = [];
      for (let i = 0; i <= 100; i += 10) {
        colors.push(colorScale(i));
      }

      // Should have different colors at different points
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBeGreaterThan(1);

      // All should be valid RGB colors
      colors.forEach((color) => {
        expect(isValidRgbColor(color)).toBe(true);
      });
    });
  });

  describe('Input Validation', () => {
    test('should throw error for invalid domain (min >= max)', () => {
      expect(() => {
        createGradientColorScale([100, 50], ['red', 'blue'], 5);
      }).toThrow('Invalid domain: max (50) must be greater than min (100)');

      expect(() => {
        createGradientColorScale([50, 50], ['red', 'blue'], 5);
      }).toThrow('Invalid domain: max (50) must be greater than min (50)');
    });

    test('should throw error for empty colors array', () => {
      expect(() => {
        createGradientColorScale([0, 100], [], 5);
      }).toThrow('Colors array cannot be empty');
    });

    test('should throw error for invalid numColorLevels', () => {
      const colors = ['red', 'blue'];
      const domain: Range = [0, 100];

      // Non-positive numbers
      expect(() => {
        createGradientColorScale(domain, colors, 0);
      }).toThrow(
        'Number of color levels must be a positive integer, received: 0',
      );

      expect(() => {
        createGradientColorScale(domain, colors, -5);
      }).toThrow(
        'Number of color levels must be a positive integer, received: -5',
      );

      // Non-integers
      expect(() => {
        createGradientColorScale(domain, colors, 5.5);
      }).toThrow(
        'Number of color levels must be a positive integer, received: 5.5',
      );
    });

    test('should provide detailed error messages', () => {
      expect(() => {
        createGradientColorScale([75, 25], ['red'], 3);
      }).toThrow('Invalid domain: max (25) must be greater than min (75)');
    });
  });

  describe('Color Format Support', () => {
    test('should work with named colors', () => {
      const colorScale = createGradientColorScale(
        [0, 100],
        ['red', 'green', 'blue', 'yellow'],
        5,
      );

      const result = colorScale(50);
      expect(isValidRgbColor(result)).toBe(true);
    });

    test('should work with hex colors', () => {
      const colorScale = createGradientColorScale(
        [0, 100],
        ['#ff0000', '#00ff00', '#0000ff'],
        5,
      );

      const result = colorScale(50);
      expect(isValidRgbColor(result)).toBe(true);
    });

    test('should work with mixed color formats', () => {
      const colorScale = createGradientColorScale(
        [0, 100],
        ['red', '#00ff00', 'rgb(0, 0, 255)', '#fff'],
        6,
      );

      const result = colorScale(25);
      expect(isValidRgbColor(result)).toBe(true);
    });

    test('should work with specific color palettes', () => {
      // Default grayscale
      const grayScale = createGradientColorScale(
        [0, 100],
        [
          '#ffffff',
          '#f0f0f0',
          '#d9d9d9',
          '#bdbdbd',
          '#969696',
          '#737373',
          '#525252',
          '#252525',
          '#000000',
        ],
        10,
      );

      expect(isValidRgbColor(grayScale(0))).toBe(true);
      expect(isValidRgbColor(grayScale(100))).toBe(true);

      // Temperature colors
      const tempScale = createGradientColorScale(
        [-10, 40],
        [
          '#67001f',
          '#b2182b',
          '#d6604d',
          '#f4a582',
          '#fddbc7',
          '#f7f7f7',
          '#d1e5f0',
          '#92c5de',
          '#4393c3',
          '#2166ac',
          '#053061',
        ],
        15,
      );

      expect(isValidRgbColor(tempScale(-5))).toBe(true);
      expect(isValidRgbColor(tempScale(20))).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('should handle single color', () => {
      const colorScale = createGradientColorScale([0, 100], ['red'], 5);

      // All values should return the same color (or black due to D3 compatibility)
      const color1 = colorScale(0);
      const color2 = colorScale(50);
      const color3 = colorScale(100);

      expect(color1).toBe(color2);
      expect(color2).toBe(color3);
      expect(isValidRgbColor(color1)).toBe(true);
    });

    test('should handle two colors', () => {
      const colorScale = createGradientColorScale(
        [0, 100],
        ['black', 'white'],
        2,
      );

      const darkColor = colorScale(25); // Should be dark
      const lightColor = colorScale(75); // Should be light

      expect(isValidRgbColor(darkColor)).toBe(true);
      expect(isValidRgbColor(lightColor)).toBe(true);
      expect(darkColor).not.toBe(lightColor);
    });

    test('should handle many colors (stress test)', () => {
      const manyColors = Array.from(
        { length: 50 },
        (_, i) => `rgb(${i * 5}, ${i * 3}, ${i * 2})`,
      );

      const colorScale = createGradientColorScale([0, 1000], manyColors, 20);

      expect(isValidRgbColor(colorScale(500))).toBe(true);
    });

    test('should handle large number of color levels', () => {
      const colorScale = createGradientColorScale(
        [0, 100],
        ['red', 'green', 'blue'],
        100, // Many discrete levels
      );

      expect(isValidRgbColor(colorScale(37))).toBe(true);
    });

    test('should handle very small domain ranges', () => {
      const colorScale = createGradientColorScale(
        [0.001, 0.002],
        ['red', 'blue'],
        5,
      );

      expect(isValidRgbColor(colorScale(0.0015))).toBe(true);
    });

    test('should handle negative domain values', () => {
      const colorScale = createGradientColorScale(
        [-100, -50],
        ['blue', 'red'],
        10,
      );

      expect(isValidRgbColor(colorScale(-75))).toBe(true);
      expect(isValidRgbColor(colorScale(-45))).toBe(true); // Outside domain
    });

    test('should handle large domain ranges', () => {
      const colorScale = createGradientColorScale(
        [0, 1000000],
        ['black', 'white'],
        50,
      );

      expect(isValidRgbColor(colorScale(500000))).toBe(true);
    });
  });

  describe('Caching Functionality', () => {
    test('should return the same function instance for identical parameters', () => {
      const domain: Range = [0, 100];
      const colors = ['red', 'green', 'blue'];
      const numLevels = 10;

      const scale1 = createGradientColorScale(domain, colors, numLevels);
      const scale2 = createGradientColorScale(domain, colors, numLevels);

      expect(scale1).toBe(scale2); // Same function instance
      expect(getColorScaleCacheSize()).toBe(1);
    });

    test('should create different functions for different parameters', () => {
      const scale1 = createGradientColorScale([0, 100], ['red', 'blue'], 5);
      const scale2 = createGradientColorScale([0, 100], ['red', 'blue'], 10); // Different numLevels
      const scale3 = createGradientColorScale([0, 50], ['red', 'blue'], 5); // Different domain

      expect(scale1).not.toBe(scale2);
      expect(scale1).not.toBe(scale3);
      expect(scale2).not.toBe(scale3);
      expect(getColorScaleCacheSize()).toBe(3);
    });

    test('should improve performance on repeated calls', () => {
      const domain: Range = [0, 100];
      const colors = ['red', 'yellow', 'green', 'blue'];
      const numLevels = 20;

      // First call - creates and caches
      const start1 = performance.now();
      const scale1 = createGradientColorScale(domain, colors, numLevels);
      const time1 = performance.now() - start1;

      // Second call - should be much faster (cached)
      const start2 = performance.now();
      const scale2 = createGradientColorScale(domain, colors, numLevels);
      const time2 = performance.now() - start2;

      expect(scale1).toBe(scale2);
      expect(time2).toBeLessThan(time1 * 0.1); // At least 10x faster
    });

    test('should handle cache size management', () => {
      // Create many different color scales to test cache eviction
      const initialStats = getColorScaleCacheStats();
      expect(initialStats.size).toBe(0);

      // Create scales up to the cache limit
      for (let i = 0; i < 10; i++) {
        createGradientColorScale([i, i + 100], ['red', 'blue'], 5);
      }

      const stats = getColorScaleCacheStats();
      expect(stats.size).toBe(10);
      expect(stats.size).toBeLessThanOrEqual(stats.maxSize);
    });

    test('should clear cache correctly', () => {
      // Create some cached scales
      createGradientColorScale([0, 100], ['red', 'blue'], 5);
      createGradientColorScale([0, 200], ['green', 'yellow'], 10);

      expect(getColorScaleCacheSize()).toBe(2);

      // Clear cache
      clearColorScaleCache();

      expect(getColorScaleCacheSize()).toBe(0);
    });

    test('should provide accurate cache statistics', () => {
      clearColorScaleCache();
      const initialStats = getColorScaleCacheStats();

      expect(initialStats.size).toBe(0);
      expect(initialStats.maxSize).toBeGreaterThan(0);
      expect(initialStats.isAtCapacity).toBe(false);

      // Add some entries
      createGradientColorScale([0, 100], ['red'], 5);
      createGradientColorScale([0, 100], ['blue'], 5);

      const finalStats = getColorScaleCacheStats();
      expect(finalStats.size).toBe(2);
      expect(finalStats.isAtCapacity).toBe(false);
    });
  });

  describe('Performance Tests', () => {
    test('should handle 1000 calls efficiently with caching', () => {
      const domain: Range = [0, 100];
      const colors = ['red', 'green', 'blue'];
      const numLevels = 20;

      const start = performance.now();

      // Create 1000 identical color scales (should benefit from caching)
      for (let i = 0; i < 1000; i++) {
        const scale = createGradientColorScale(domain, colors, numLevels);
        // Use the scale to ensure it's functional
        scale(50);
      }

      const duration = performance.now() - start;

      // Should complete quickly due to caching
      expect(duration).toBeLessThan(100); // Less than 100ms for 1000 calls
      expect(getColorScaleCacheSize()).toBe(1); // Only one unique scale cached
    });

    test('should create working scales quickly', () => {
      const start = performance.now();

      const scale = createGradientColorScale(
        [0, 100],
        ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7'],
        50,
      );

      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50); // Should create quickly
      expect(isValidRgbColor(scale(25))).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    test('should work in realistic data visualization scenario', () => {
      // Simulate temperature data visualization
      const temperatureRange: Range = [-20, 45];
      const temperatureColors = [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffcc',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026',
      ];

      const tempScale = createGradientColorScale(
        temperatureRange,
        temperatureColors,
        20,
      );

      // Test with realistic temperature values
      const testTemperatures = [-15, -5, 0, 10, 20, 30, 40];
      const colors = testTemperatures.map((temp) => tempScale(temp));

      // All should be valid colors
      colors.forEach((color) => {
        expect(isValidRgbColor(color)).toBe(true);
      });

      // Colors should be different for different temperatures
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBeGreaterThan(1);
    });

    test('should work with data normalization scenario', () => {
      // Simulate normalized data [0, 1] mapped to colors
      const normalizedScale = createGradientColorScale(
        [0, 1],
        ['white', 'lightgreen', 'darkgreen'],
        10,
      );

      const testValues = [0, 0.25, 0.5, 0.75, 1.0];
      const colors = testValues.map((val) => normalizedScale(val));

      colors.forEach((color) => {
        expect(isValidRgbColor(color)).toBe(true);
      });
    });

    test('should maintain consistent behavior after cache operations', () => {
      const domain: Range = [0, 100];
      const colors = ['red', 'yellow', 'green'];
      const numLevels = 8;

      // Create scale and test it
      const scale1 = createGradientColorScale(domain, colors, numLevels);
      const color1 = scale1(25);

      // Clear cache and create again
      clearColorScaleCache();
      const scale2 = createGradientColorScale(domain, colors, numLevels);
      const color2 = scale2(25);

      // Should produce the same results
      expect(color1).toBe(color2);
    });
  });

  describe('Type Safety', () => {
    test('should accept readonly arrays', () => {
      const readonlyColors: readonly string[] = [
        'red',
        'green',
        'blue',
      ] as const;
      const readonlyDomain: Range = [0, 100];

      expect(() => {
        const scale = createGradientColorScale(
          readonlyDomain,
          readonlyColors,
          5,
        );
        expect(typeof scale).toBe('function');
      }).not.toThrow();
    });

    test('should return a function with correct signature', () => {
      const scale = createGradientColorScale([0, 100], ['red', 'blue'], 5);

      // Should be a function that takes number and returns string
      expect(typeof scale).toBe('function');
      expect(typeof scale(50)).toBe('string');
    });
  });

  describe('Regression Tests', () => {
    test('should handle original usage patterns', () => {
      const basicColors = ['red', 'blue', 'green'];
      const scale1 = createGradientColorScale([0, 100], basicColors, 10);
      expect(isValidRgbColor(scale1(50))).toBe(true);

      const defaultColorScale = [
        '#ffffff',
        '#f0f0f0',
        '#d9d9d9',
        '#bdbdbd',
        '#969696',
        '#737373',
        '#525252',
        '#252525',
        '#000000',
      ];
      const scale2 = createGradientColorScale([0, 1], defaultColorScale, 20);
      expect(isValidRgbColor(scale2(0.5))).toBe(true);

      const mixedColors = ['white', 'lightgreen', 'black'];
      const scale3 = createGradientColorScale([-10, 10], mixedColors, 15);
      expect(isValidRgbColor(scale3(0))).toBe(true);
    });

    test('should produce consistent results across test runs', () => {
      const domain: Range = [0, 100];
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const numLevels = 7;

      const results1: string[] = [];
      const results2: string[] = [];

      // First run
      const scale1 = createGradientColorScale(domain, colors, numLevels);
      for (let i = 0; i <= 100; i += 10) {
        results1.push(scale1(i));
      }

      clearColorScaleCache();

      // Second run
      const scale2 = createGradientColorScale(domain, colors, numLevels);
      for (let i = 0; i <= 100; i += 10) {
        results2.push(scale2(i));
      }

      // Results should be identical
      expect(results1).toEqual(results2);
    });
  });
});
