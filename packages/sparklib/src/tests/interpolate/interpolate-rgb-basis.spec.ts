/**
 * Tests edge cases, color formats, mathematical correctness, and compatibility with D3.
 */
import { interpolateRgbBasis } from './../../lib/utils/interpolate';
//import { interpolateRgbBasis } from 'd3-interpolate';

describe('interpolateRgbBasis', () => {
  /**
   * Helper function to parse RGB string into components for comparison
   */
  function parseRgbString(rgbString: string): {
    r: number;
    g: number;
    b: number;
  } {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) {
      throw new Error(`Invalid RGB string: ${rgbString}`);
    }
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  }

  /**
   * Helper function to check if two RGB colors are approximately equal
   * Allows for small rounding differences in interpolation
   */
  //   function expectColorsToBeClose(
  //     actual: string,
  //     expected: string,
  //     tolerance = 1,
  //   ): void {
  //     const actualRgb = parseRgbString(actual);
  //     const expectedRgb = parseRgbString(expected);

  //     expect(Math.abs(actualRgb.r - expectedRgb.r)).toBeLessThanOrEqual(
  //       tolerance,
  //     );
  //     expect(Math.abs(actualRgb.g - expectedRgb.g)).toBeLessThanOrEqual(
  //       tolerance,
  //     );
  //     expect(Math.abs(actualRgb.b - expectedRgb.b)).toBeLessThanOrEqual(
  //       tolerance,
  //     );
  //   }

  describe('Edge Cases', () => {
    test('should handle empty array', () => {
      expect(() => {
        interpolateRgbBasis([]);
      }).toThrow('Cannot set properties of undefined');
    });

    test('should handle single color', () => {
      const interpolator = interpolateRgbBasis(['red']);
      expect(interpolator(0)).toBe('rgb(0, 0, 0)');
      expect(interpolator(0.5)).toBe('rgb(0, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 0, 0)');
    });

    test('should handle two colors', () => {
      const interpolator = interpolateRgbBasis(['red', 'blue']);
      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 0, 255)');

      // Middle should be a blend
      const middle = parseRgbString(interpolator(0.5));
      expect(middle.r).toBeGreaterThan(0);
      expect(middle.r).toBeLessThan(255);
      expect(middle.b).toBeGreaterThan(0);
      expect(middle.b).toBeLessThan(255);
    });

    test('should handle parameter values outside [0,1]', () => {
      const interpolator = interpolateRgbBasis(['red', 'green', 'blue']);

      // Values < 0 should clamp to first color
      expect(interpolator(-0.5)).toBe(interpolator(0));
      expect(interpolator(-1)).toBe(interpolator(0));

      // Values > 1 should clamp to last color
      expect(interpolator(1.5)).toBe(interpolator(1));
      expect(interpolator(2)).toBe(interpolator(1));
    });
  });

  describe('Color Format Support', () => {
    test('should handle named colors', () => {
      const namedColors = ['red', 'green', 'blue', 'white', 'black'];
      const interpolator = interpolateRgbBasis(namedColors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)'); // red
      expect(interpolator(1)).toBe('rgb(0, 0, 0)'); // black
    });

    test('should handle hex colors (#rrggbb)', () => {
      const hexColors = ['#ff0000', '#00ff00', '#0000ff'];
      const interpolator = interpolateRgbBasis(hexColors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 0, 255)');
    });

    test('should handle short hex colors (#rgb)', () => {
      const shortHexColors = ['#f00', '#0f0', '#00f'];
      const interpolator = interpolateRgbBasis(shortHexColors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 0, 255)');
    });

    test('should handle rgb() function colors', () => {
      const rgbColors = ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'];
      const interpolator = interpolateRgbBasis(rgbColors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 0, 255)');
    });

    test('should handle rgba() function colors (ignoring alpha)', () => {
      const rgbaColors = [
        'rgba(255, 0, 0, 0.5)',
        'rgba(0, 255, 0, 0.8)',
        'rgba(0, 0, 255, 1.0)',
      ];
      const interpolator = interpolateRgbBasis(rgbaColors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 0, 255)');
    });

    test('should handle mixed color formats', () => {
      const mixedColors = ['red', '#00ff00', 'rgb(0, 0, 255)', '#fff'];
      const interpolator = interpolateRgbBasis(mixedColors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)'); // red
      expect(interpolator(1)).toBe('rgb(255, 255, 255)'); // white
    });

    test('should handle case insensitive named colors', () => {
      const caseInsensitiveColors = ['RED', 'Green', 'bLuE'];
      const interpolator = interpolateRgbBasis(caseInsensitiveColors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 0, 255)');
    });

    test('should handle colors with whitespace', () => {
      const spacedColors = [' red ', '\tgreen\t', '\nblue\n'];
      const interpolator = interpolateRgbBasis(spacedColors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 0, 255)');
    });
  });

  describe('Your Specific Color Patterns', () => {
    test('should handle basic named colors', () => {
      const colors = ['red', 'blue', 'green'];
      const interpolator = interpolateRgbBasis(colors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 128, 0)');
    });

    test('should handle grayscale palette', () => {
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
      const interpolator = interpolateRgbBasis(defaultColorScale);

      expect(interpolator(0)).toBe('rgb(255, 255, 255)'); // white
      expect(interpolator(1)).toBe('rgb(0, 0, 0)'); // black

      // Middle should be some shade of gray
      const middle = parseRgbString(interpolator(0.5));
      expect(middle.r).toBe(middle.g);
      expect(middle.g).toBe(middle.b);
      expect(middle.r).toBeGreaterThan(0);
      expect(middle.r).toBeLessThan(255);
    });

    test('should handle temperature color scale', () => {
      const temperatureColors = [
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
      ];
      const interpolator = interpolateRgbBasis(temperatureColors);

      expect(interpolator(0)).toBe('rgb(103, 0, 31)'); // first color
      expect(interpolator(1)).toBe('rgb(5, 48, 97)'); // last color
    });

    test('should handle mixed named and hex colors', () => {
      const mixedColors = ['white', 'lightgreen', 'black'];
      const interpolator = interpolateRgbBasis(mixedColors);

      expect(interpolator(0)).toBe('rgb(255, 255, 255)'); // white
      expect(interpolator(1)).toBe('rgb(0, 0, 0)'); // black
    });
  });

  describe('Mathematical Properties', () => {
    test('should return exact colors at endpoints', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
      const interpolator = interpolateRgbBasis(colors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(255, 255, 0)');
    });

    test('should provide smooth interpolation (no sudden jumps)', () => {
      const colors = ['red', 'green', 'blue'];
      const interpolator = interpolateRgbBasis(colors);

      const samples: string[] = [];
      for (let i = 0; i <= 10; i++) {
        samples.push(interpolator(i / 10));
      }

      // Check that adjacent samples don't differ too much (smoothness)
      for (let i = 1; i < samples.length; i++) {
        const prev = parseRgbString(samples[i - 1]);
        const curr = parseRgbString(samples[i]);

        expect(Math.abs(curr.r - prev.r)).toBeLessThan(60);
        expect(Math.abs(curr.g - prev.g)).toBeLessThan(60);
        expect(Math.abs(curr.b - prev.b)).toBeLessThan(60);
      }
    });

    test('should be monotonic for simple gradients', () => {
      const colors = ['#000000', '#ffffff']; // black to white
      const interpolator = interpolateRgbBasis(colors);

      let prevBrightness = 0;
      for (let i = 0; i <= 10; i++) {
        const color = parseRgbString(interpolator(i / 10));
        const brightness = color.r + color.g + color.b;
        expect(brightness).toBeGreaterThanOrEqual(prevBrightness);
        prevBrightness = brightness;
      }
    });

    test('should handle identical consecutive colors', () => {
      const colors = ['red', 'red', 'blue', 'blue'];
      const interpolator = interpolateRgbBasis(colors);

      expect(interpolator(0)).toBe('rgb(255, 0, 0)');
      expect(interpolator(1)).toBe('rgb(0, 0, 255)');

      // Should not throw or return NaN
      expect(interpolator(0.25)).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
      expect(interpolator(0.75)).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid color strings gracefully', () => {
      const invalidColors = ['notacolor', 'rgb()', '#gggggg', 'red blue'];
      const interpolator = interpolateRgbBasis(invalidColors);

      // Should not throw, should return valid RGB strings
      expect(interpolator(0)).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
      expect(interpolator(0.5)).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
      expect(interpolator(1)).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    });

    test('should handle extreme RGB values', () => {
      const extremeColors = [
        'rgb(0, 0, 0)',
        'rgb(255, 255, 255)',
        'rgb(300, -50, 1000)',
      ];
      const interpolator = interpolateRgbBasis(extremeColors);

      const result = interpolator(0.5);
      const rgb = parseRgbString(result);

      // Should clamp values to valid range
      expect(rgb.r).toBeGreaterThanOrEqual(0);
      expect(rgb.r).toBeLessThanOrEqual(255);
      expect(rgb.g).toBeGreaterThanOrEqual(0);
      expect(rgb.g).toBeLessThanOrEqual(255);
      expect(rgb.b).toBeGreaterThanOrEqual(0);
      expect(rgb.b).toBeLessThanOrEqual(255);
    });
  });

  describe('Performance Characteristics', () => {
    test('should create interpolator quickly for large color arrays', () => {
      const largeColorArray = Array.from(
        { length: 100 },
        (_, i) => `rgb(${i * 2}, ${i * 2}, ${i * 2})`,
      );

      const start = Date.now();
      const interpolator = interpolateRgbBasis(largeColorArray);
      const creationTime = Date.now() - start;

      expect(creationTime).toBeLessThan(50); // Should create in < 50ms
      expect(interpolator(0.5)).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    });

    test('should interpolate quickly after creation', () => {
      const colors = ['red', 'green', 'blue', 'yellow', 'purple'];
      const interpolator = interpolateRgbBasis(colors);

      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        interpolator(Math.random());
      }
      const interpolationTime = Date.now() - start;

      expect(interpolationTime).toBeLessThan(100); // 1000 calls in < 100ms
    });
  });

  describe('Consistency Tests', () => {
    test('should return same result for same input', () => {
      const colors = ['red', 'green', 'blue'];
      const interpolator = interpolateRgbBasis(colors);

      const result1 = interpolator(0.7);
      const result2 = interpolator(0.7);

      expect(result1).toBe(result2);
    });

    test('should be deterministic across multiple instances', () => {
      const colors = ['#ff5733', '#33ff57', '#3357ff'];

      const interpolator1 = interpolateRgbBasis(colors);
      const interpolator2 = interpolateRgbBasis(colors);

      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        expect(interpolator1(t)).toBe(interpolator2(t));
      }
    });
  });

  describe('B-spline Specific Tests', () => {
    test('should show B-spline characteristics (not linear)', () => {
      const colors = ['red', 'green', 'blue'];
      const interpolator = interpolateRgbBasis(colors);

      // B-spline should not be exactly linear between points
      const quarter = parseRgbString(interpolator(0.25));
      const half = parseRgbString(interpolator(0.5));
      const threeQuarter = parseRgbString(interpolator(0.75));

      // The middle point should not be exactly halfway between quarter and three-quarter
      // This tests the non-linear nature of B-splines
      const expectedLinearR = (quarter.r + threeQuarter.r) / 2;
      expect(Math.abs(half.r - expectedLinearR)).toBeGreaterThan(2);
    });

    test('should handle three colors with proper B-spline interpolation', () => {
      const colors = ['black', 'white', 'black']; // Should peak in middle
      const interpolator = interpolateRgbBasis(colors);

      const start = parseRgbString(interpolator(0));
      const middle = parseRgbString(interpolator(0.5));
      const end = parseRgbString(interpolator(1));

      expect(start.r).toBeLessThan(middle.r); // Should brighten toward middle
      expect(end.r).toBeLessThan(middle.r); // Should darken from middle
    });
  });

  describe('Regression Tests', () => {
    test('should match known good values for simple cases', () => {
      // These values can be verified against D3's implementation
      const colors = ['red', 'blue'];
      const interpolator = interpolateRgbBasis(colors);

      // At 0.5, should be purple-ish blend
      const middle = parseRgbString(interpolator(0.5));
      expect(middle.r).toBeGreaterThan(50);
      expect(middle.r).toBeLessThan(200);
      expect(middle.b).toBeGreaterThan(50);
      expect(middle.b).toBeLessThan(200);
      expect(middle.g).toBeLessThan(50); // Should be low green
    });
  });
});
