import { getIndicesForPixelX } from '../../lib/utils';

describe('getIndicesForPixelX', () => {
  test('should return indices for exact pixelX when nValues matches pixelWidth', () => {
    const result = getIndicesForPixelX(50, 100, 100);
    expect(result).toEqual({
      startIndex: 50,
      endIndex: 50,
    });
  });

  test('should return indices for pixelX between two data points', () => {
    const result = getIndicesForPixelX(28, 100, 10);
    expect(result).toEqual({
      startIndex: 2,
      endIndex: 3,
    });
  });

  test('should return multiple indices for pixelX when nValues exceeds pixelWidth', () => {
    const result = getIndicesForPixelX(50, 100, 500);
    expect(result).toEqual({
      startIndex: 250,
      endIndex: 254,
    });
  });

  test('throws error if nValues or pixelWidth is 0 or negative', () => {
    expect(() => getIndicesForPixelX(10, -10, 100)).toThrow(
      'Data length (nValues) and canvas width must both be greater than 0.',
    );
    expect(() => getIndicesForPixelX(10, 100, -100)).toThrow(
      'Data length (nValues) and canvas width must both be greater than 0.',
    );
  });

  test('throws error if pixelX is out of bounds', () => {
    expect(() => getIndicesForPixelX(101, 100, 100)).toThrow(
      'PixelX (101) is out of bounds [0,100].',
    );
    expect(() => getIndicesForPixelX(-1, 100, 100)).toThrow(
      'PixelX (-1) is out of bounds [0,100].',
    );
  });

  test('should return first index when pixelX is 0', () => {
    const result = getIndicesForPixelX(0, 100, 100);
    expect(result).toEqual({
      startIndex: 0,
      endIndex: 0,
    });
  });

  test('should return last index when pixelX is pixelWidth-1', () => {
    const result = getIndicesForPixelX(99, 100, 100);
    expect(result).toEqual({
      startIndex: 99,
      endIndex: 99,
    });
  });

  test('should return correct indices for pixelX when nValues is 1', () => {
    const result = getIndicesForPixelX(50, 100, 1);
    expect(result).toEqual({
      startIndex: 0,
      endIndex: 0,
    });
  });

  test('should return correct indices when pixelWidth is 1', () => {
    const result = getIndicesForPixelX(0, 1, 100);
    expect(result).toEqual({
      startIndex: 0,
      endIndex: 99,
    });
  });

  test('should handle cases where pixelX is exactly between two values', () => {
    const result = getIndicesForPixelX(25, 100, 50);
    expect(result).toEqual({
      startIndex: 12,
      endIndex: 13,
    });
  });

  test('should return correct indices for larger data sets', () => {
    const result = getIndicesForPixelX(500, 1000, 2000);
    expect(result).toEqual({
      startIndex: 1000,
      endIndex: 1001,
    });
  });
});
