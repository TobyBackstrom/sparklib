import { line } from '../../../lib/utils/shape';
import { Coordinate } from '../../../lib/models';
import { MockCanvasRenderingContext2D } from './mock-canvas-rendering-context-2D';

describe('line generator', () => {
  let mockContext: MockCanvasRenderingContext2D;

  beforeEach(() => {
    mockContext = new MockCanvasRenderingContext2D();
  });

  describe('factory function', () => {
    it('should create a line generator with default settings', () => {
      const lineGen = line<Coordinate>();

      expect(typeof lineGen).toBe('function');
      expect(typeof lineGen.x).toBe('function');
      expect(typeof lineGen.y).toBe('function');
      expect(typeof lineGen.defined).toBe('function');
      expect(typeof lineGen.context).toBe('function');
    });

    it('should work with default generic type', () => {
      const lineGen = line(); // Should default to [number, number]

      expect(typeof lineGen).toBe('function');
      expect(lineGen.context()).toBeNull();
    });

    it('should work with custom generic types', () => {
      interface DataPoint {
        x: number;
        y: number;
        valid: boolean;
      }

      const lineGen = line<DataPoint>();
      expect(typeof lineGen).toBe('function');
    });
  });

  describe('default accessors', () => {
    it('should have default x accessor that returns first element', () => {
      const lineGen = line<Coordinate>();
      const xAccessor = lineGen.x();

      expect(xAccessor([10, 20], 0, [])).toBe(10);
      expect(xAccessor([5, 15], 0, [])).toBe(5);
    });

    it('should have default y accessor that returns second element', () => {
      const lineGen = line<Coordinate>();
      const yAccessor = lineGen.y();

      expect(yAccessor([10, 20], 0, [])).toBe(20);
      expect(yAccessor([5, 15], 0, [])).toBe(15);
    });

    it('should have default defined accessor that returns true', () => {
      const lineGen = line<Coordinate>();
      const definedAccessor = lineGen.defined();

      expect(definedAccessor([10, 20], 0, [])).toBe(true);
      expect(definedAccessor([0, 0], 0, [])).toBe(true);
    });

    it('should have default context of null', () => {
      const lineGen = line<Coordinate>();
      expect(lineGen.context()).toBeNull();
    });
  });

  describe('x accessor', () => {
    it('should get current x accessor', () => {
      const lineGen = line<Coordinate>();
      const accessor = lineGen.x();

      expect(typeof accessor).toBe('function');
      expect(accessor([5, 10], 0, [])).toBe(5);
    });

    it('should set x accessor function and return line generator', () => {
      const lineGen = line<Coordinate>();
      const customAccessor = (d: Coordinate) => d[0] * 2;

      const result = lineGen.x(customAccessor);
      expect(result).toBe(lineGen);

      const newAccessor = lineGen.x();
      expect(newAccessor([5, 10], 0, [])).toBe(10); // 5 * 2
    });

    it('should set x to constant number and return line generator', () => {
      const lineGen = line<Coordinate>();

      const result = lineGen.x(100);
      expect(result).toBe(lineGen);

      const accessor = lineGen.x();
      expect(accessor([5, 10], 0, [])).toBe(100);
      expect(accessor([0, 0], 0, [])).toBe(100);
    });

    it('should work with custom data types', () => {
      interface Point {
        timestamp: number;
        value: number;
      }

      const lineGen = line<Point>();
      lineGen.x((d) => d.timestamp);

      const accessor = lineGen.x();
      expect(accessor({ timestamp: 123, value: 456 }, 0, [])).toBe(123);
    });

    it('should receive index and data array parameters', () => {
      const lineGen = line<Coordinate>();
      let receivedIndex: number | undefined;
      let receivedData: Coordinate[] | undefined;

      lineGen.x((d, index, data) => {
        receivedIndex = index;
        receivedData = data;
        return d[0];
      });

      const testData: Coordinate[] = [
        [1, 2],
        [3, 4],
      ];
      const accessor = lineGen.x();
      accessor([1, 2], 0, testData);

      expect(receivedIndex).toBeDefined();
      expect(receivedIndex).toBe(0);
      expect(receivedData).toBeDefined();
      expect(receivedData).toBe(testData);
    });
  });

  describe('y accessor', () => {
    it('should get current y accessor', () => {
      const lineGen = line<Coordinate>();
      const accessor = lineGen.y();

      expect(typeof accessor).toBe('function');
      expect(accessor([5, 10], 0, [])).toBe(10);
    });

    it('should set y accessor function and return line generator', () => {
      const lineGen = line<Coordinate>();
      const customAccessor = (d: Coordinate) => d[1] * 3;

      const result = lineGen.y(customAccessor);
      expect(result).toBe(lineGen);

      const newAccessor = lineGen.y();
      expect(newAccessor([5, 10], 0, [])).toBe(30); // 10 * 3
    });

    it('should set y to constant number and return line generator', () => {
      const lineGen = line<Coordinate>();

      const result = lineGen.y(200);
      expect(result).toBe(lineGen);

      const accessor = lineGen.y();
      expect(accessor([5, 10], 0, [])).toBe(200);
      expect(accessor([0, 0], 0, [])).toBe(200);
    });

    it('should work with offsets like in real usage', () => {
      const lineGen = line<Coordinate>();
      const offset = 5;

      lineGen.y((coordinate) => coordinate[1] + offset);

      const accessor = lineGen.y();
      expect(accessor([10, 20], 0, [])).toBe(25); // 20 + 5
    });
  });

  describe('defined accessor', () => {
    it('should get current defined accessor', () => {
      const lineGen = line<Coordinate>();
      const accessor = lineGen.defined();

      expect(typeof accessor).toBe('function');
      expect(accessor([5, 10], 0, [])).toBe(true);
    });

    it('should set defined accessor function and return line generator', () => {
      const lineGen = line<Coordinate>();
      const customAccessor = (d: Coordinate) => d[1] != null;

      const result = lineGen.defined(customAccessor);
      expect(result).toBe(lineGen);

      const newAccessor = lineGen.defined();
      expect(newAccessor([5, 10], 0, [])).toBe(true);
      expect(newAccessor([5, null as unknown as number], 0, [])).toBe(false);
    });

    it('should set defined to constant boolean and return line generator', () => {
      const lineGen = line<Coordinate>();

      const result = lineGen.defined(false);
      expect(result).toBe(lineGen);

      const accessor = lineGen.defined();
      expect(accessor([5, 10], 0, [])).toBe(false);
      expect(accessor([0, 0], 0, [])).toBe(false);
    });

    it('should work with null checking like in real usage', () => {
      const lineGen = line<Coordinate>();

      lineGen.defined((coordinate) => coordinate[1] != null);

      const accessor = lineGen.defined();
      expect(accessor([10, 20], 0, [])).toBe(true);
      expect(accessor([10, null as unknown as number], 0, [])).toBe(false);
      expect(accessor([10, undefined as unknown as number], 0, [])).toBe(false);
    });
  });

  describe('context accessor', () => {
    it('should get current context', () => {
      const lineGen = line<Coordinate>();
      expect(lineGen.context()).toBeNull();
    });

    it('should set context and return line generator', () => {
      const lineGen = line<Coordinate>();

      const result = lineGen.context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      expect(result).toBe(lineGen);
      expect(lineGen.context()).toBe(mockContext);
    });

    it('should set context to null and return line generator', () => {
      const lineGen = line<Coordinate>();
      lineGen.context(mockContext as unknown as CanvasRenderingContext2D);

      const result = lineGen.context(null);
      expect(result).toBe(lineGen);
      expect(lineGen.context()).toBeNull();
    });
  });

  describe('line rendering', () => {
    beforeEach(() => {
      mockContext.reset();
    });

    it('should not render without context', () => {
      const lineGen = line<Coordinate>();
      const coordinates: Coordinate[] = [
        [0, 0],
        [10, 10],
        [20, 5],
      ];

      lineGen(coordinates);

      expect(mockContext.getOperations()).toHaveLength(0);
    });

    it('should render simple line with moveTo and lineTo', () => {
      const lineGen = line<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates: Coordinate[] = [
        [0, 0],
        [10, 10],
        [20, 5],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'lineTo', args: [10, 10] },
        { method: 'lineTo', args: [20, 5] },
      ]);
    });

    it('should render single point as moveTo only', () => {
      const lineGen = line<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates: Coordinate[] = [[5, 8]];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([{ method: 'moveTo', args: [5, 8] }]);
    });

    it('should handle empty data array', () => {
      const lineGen = line<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates: Coordinate[] = [];

      lineGen(coordinates);

      expect(mockContext.getOperations()).toHaveLength(0);
    });

    it('should work with custom accessors', () => {
      const lineGen = line<Coordinate>()
        .x((d) => d[0] * 2)
        .y((d) => d[1] + 10)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [1, 2],
        [3, 4],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [2, 12] }, // [1*2, 2+10]
        { method: 'lineTo', args: [6, 14] }, // [3*2, 4+10]
      ]);
    });

    it('should work with constant values', () => {
      const lineGen = line<Coordinate>()
        .x(100)
        .y(200)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [100, 200] },
        { method: 'lineTo', args: [100, 200] },
        { method: 'lineTo', args: [100, 200] },
      ]);
    });

    it('should work with Iterable input', () => {
      const lineGen = line<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates = new Set<Coordinate>([
        [0, 0],
        [10, 10],
      ]);

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toHaveLength(2);
      expect(operations[0].method).toBe('moveTo');
      expect(operations[1].method).toBe('lineTo');
    });
  });

  describe('defined point handling', () => {
    beforeEach(() => {
      mockContext.reset();
    });

    it('should skip undefined points', () => {
      const lineGen = line<Coordinate>()
        .defined((d) => d[1] !== null)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 0],
        [10, null as unknown as number],
        [20, 20],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'moveTo', args: [20, 20] }, // New segment after undefined point
      ]);
    });

    it('should create separate segments around undefined points', () => {
      const lineGen = line<Coordinate>()
        .defined((d) => d[1] !== null)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 0],
        [5, 5],
        [10, null as unknown as number],
        [15, 15],
        [20, 20],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'lineTo', args: [5, 5] },
        { method: 'moveTo', args: [15, 15] }, // New segment
        { method: 'lineTo', args: [20, 20] },
      ]);
    });

    it('should handle multiple consecutive undefined points', () => {
      const lineGen = line<Coordinate>()
        .defined((d) => d[1] !== null)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 0],
        [5, null as unknown as number],
        [10, null as unknown as number],
        [15, 15],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'moveTo', args: [15, 15] },
      ]);
    });

    it('should handle all undefined points', () => {
      const lineGen = line<Coordinate>()
        .defined(() => false)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 0],
        [10, 10],
        [20, 20],
      ];

      lineGen(coordinates);

      expect(mockContext.getOperations()).toHaveLength(0);
    });

    it('should handle undefined points at start', () => {
      const lineGen = line<Coordinate>()
        .defined((d) => d[1] !== null)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, null as unknown as number],
        [10, 10],
        [20, 20],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [10, 10] },
        { method: 'lineTo', args: [20, 20] },
      ]);
    });

    it('should handle undefined points at end', () => {
      const lineGen = line<Coordinate>()
        .defined((d) => d[1] !== null)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 0],
        [10, 10],
        [20, null as unknown as number],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'lineTo', args: [10, 10] },
      ]);
    });
  });

  describe('method chaining', () => {
    it('should allow full method chaining', () => {
      const lineGen = line<Coordinate>()
        .x((d) => d[0] + 5)
        .y((d) => d[1] + 10)
        .defined((d) => d[1] != null)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      expect(typeof lineGen).toBe('function');
      expect(lineGen.context()).toBe(mockContext);
    });

    it('should maintain state through chaining', () => {
      const lineGen = line<Coordinate>()
        .x((d) => d[0] * 2)
        .y(100)
        .defined(false)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [1, 2],
        [3, 4],
      ];
      lineGen(coordinates);

      // Should not render anything because defined is false
      expect(mockContext.getOperations()).toHaveLength(0);
    });

    it('should work in any order', () => {
      const lineGen = line<Coordinate>()
        .context(mockContext as unknown as CanvasRenderingContext2D)
        .defined((d) => d[1] > 0)
        .y((d) => d[1] * 2)
        .x((d) => d[0] + 1);

      const coordinates: Coordinate[] = [[0, 5]];
      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [1, 10] }, // [0+1, 5*2]
      ]);
    });
  });

  describe('real-world usage patterns', () => {
    beforeEach(() => {
      mockContext.reset();
    });

    it('should match the documented usage pattern', () => {
      const lineWidthOffset = 2;
      const context = mockContext as unknown as CanvasRenderingContext2D;

      const coordinates: Coordinate[] = [
        [0, 0],
        [10, 20],
        [20, null as unknown as number],
        [30, 15],
      ];

      line<Coordinate>()
        .defined((coordinate) => coordinate[1] != null)
        .x((coordinate) => coordinate[0] + lineWidthOffset)
        .y((coordinate) => coordinate[1] + lineWidthOffset)
        .context(context)(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [2, 2] }, // [0+2, 0+2]
        { method: 'lineTo', args: [12, 22] }, // [10+2, 20+2]
        { method: 'moveTo', args: [32, 17] }, // [30+2, 15+2] - new segment after null
      ]);
    });

    it('should work with time series data', () => {
      interface DataPoint {
        timestamp: number;
        value: number | null;
      }

      const lineGen = line<DataPoint>()
        .defined((d) => d.value !== null)
        .x((d) => d.timestamp)
        .y((d) => d.value || 0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const data: DataPoint[] = [
        { timestamp: 0, value: 10 },
        { timestamp: 1, value: 20 },
        { timestamp: 2, value: null },
        { timestamp: 3, value: 15 },
      ];

      lineGen(data);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [1, 20] },
        { method: 'moveTo', args: [3, 15] },
      ]);
    });

    it('should work with scaled coordinates', () => {
      // Simulating a scale function
      const xScale = (value: number) => value * 10;
      const yScale = (value: number) => 100 - value * 5;

      const lineGen = line<Coordinate>()
        .x((d) => xScale(d[0]))
        .y((d) => yScale(d[1]))
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [1, 2],
        [2, 4],
        [3, 6],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [10, 90] }, // xScale(1), yScale(2)
        { method: 'lineTo', args: [20, 80] }, // xScale(2), yScale(4)
        { method: 'lineTo', args: [30, 70] }, // xScale(3), yScale(6)
      ]);
    });

    it('should work with accessor receiving index and data', () => {
      const lineGen = line<Coordinate>()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .x((d, index, data) => d[0] + index * 10) // Add index-based offset
        .y((d, index, data) => data.length * 5 + d[1]) // Add data-length-based offset
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 0],
        [0, 10],
        [0, 20],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 15] }, // 0 + 0*10, 3*5 + 0
        { method: 'lineTo', args: [10, 25] }, // 0 + 1*10, 3*5 + 10
        { method: 'lineTo', args: [20, 35] }, // 0 + 2*10, 3*5 + 20
      ]);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle NaN coordinates gracefully', () => {
      const lineGen = line<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates: Coordinate[] = [
        [0, 0],
        [NaN, 10],
        [20, 20],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'lineTo', args: [NaN, 10] }, // Canvas will handle NaN
        { method: 'lineTo', args: [20, 20] },
      ]);
    });

    it('should handle Infinity coordinates', () => {
      const lineGen = line<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates: Coordinate[] = [
        [0, 0],
        [Infinity, 10],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'lineTo', args: [Infinity, 10] },
      ]);
    });

    it('should handle very large datasets efficiently', () => {
      const lineGen = line<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates: Coordinate[] = [];

      // Generate 1000 points
      for (let i = 0; i < 1000; i++) {
        coordinates.push([i, Math.sin(i / 100) * 50]);
      }

      const start = performance.now();
      lineGen(coordinates);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should be fast
      expect(mockContext.getOperations()).toHaveLength(1000);
    });

    it('should work with zero coordinates', () => {
      const lineGen = line<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates: Coordinate[] = [
        [0, 0],
        [0, 0],
        [0, 0],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'lineTo', args: [0, 0] },
      ]);
    });

    it('should work with negative coordinates', () => {
      const lineGen = line<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates: Coordinate[] = [
        [-10, -20],
        [-5, -15],
      ];

      lineGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [-10, -20] },
        { method: 'lineTo', args: [-5, -15] },
      ]);
    });
  });

  describe('type safety', () => {
    it('should work with custom data structures', () => {
      interface Point3D {
        x: number;
        y: number;
        z: number;
        visible: boolean;
      }

      const lineGen = line<Point3D>()
        .x((d) => d.x)
        .y((d) => d.y)
        .defined((d) => d.visible)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const points: Point3D[] = [
        { x: 0, y: 0, z: 0, visible: true },
        { x: 10, y: 20, z: 30, visible: false },
        { x: 20, y: 40, z: 60, visible: true },
      ];

      lineGen(points);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'moveTo', args: [20, 40] }, // Skip invisible point
      ]);
    });

    it('should work with complex data transformations', () => {
      interface StockPrice {
        date: Date;
        price: number;
        volume: number;
      }

      const lineGen = line<StockPrice>()
        .x((d) => d.date.getTime())
        .y((d) => d.price)
        .defined((d) => d.volume > 0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const data: StockPrice[] = [
        { date: new Date(2024, 0, 1), price: 100, volume: 1000 },
        { date: new Date(2024, 0, 2), price: 105, volume: 0 },
        { date: new Date(2024, 0, 3), price: 98, volume: 1500 },
      ];

      lineGen(data);

      const operations = mockContext.getOperations();
      expect(operations).toHaveLength(2); // Should skip zero volume point
      expect(operations[0].method).toBe('moveTo');
      expect(operations[1].method).toBe('moveTo');
    });
  });
});
