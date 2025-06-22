import { area } from '../../../lib/utils/shape';
import { Coordinate } from '../../../lib/models';
import { MockCanvasRenderingContext2D } from './mock-canvas-rendering-context-2D';

describe('area generator', () => {
  let mockContext: MockCanvasRenderingContext2D;

  beforeEach(() => {
    mockContext = new MockCanvasRenderingContext2D();
  });

  describe('factory function', () => {
    it('should create an area generator with default settings', () => {
      const areaGen = area<Coordinate>();

      expect(typeof areaGen).toBe('function');
      expect(typeof areaGen.x).toBe('function');
      expect(typeof areaGen.y0).toBe('function');
      expect(typeof areaGen.y1).toBe('function');
      expect(typeof areaGen.defined).toBe('function');
      expect(typeof areaGen.context).toBe('function');
    });

    it('should work with default generic type', () => {
      const areaGen = area(); // Should default to [number, number]

      expect(typeof areaGen).toBe('function');
      expect(areaGen.context()).toBeNull();
    });

    it('should work with custom generic types', () => {
      interface DataPoint {
        x: number;
        y: number;
        baseline: number;
      }

      const areaGen = area<DataPoint>();
      expect(typeof areaGen).toBe('function');
    });
  });

  describe('default accessors', () => {
    it('should have default x accessor that returns first element', () => {
      const areaGen = area<Coordinate>();
      const xAccessor = areaGen.x();

      expect(xAccessor([10, 20], 0, [])).toBe(10);
      expect(xAccessor([5, 15], 0, [])).toBe(5);
    });

    it('should have default y0 accessor that returns zero', () => {
      const areaGen = area<Coordinate>();
      const y0Accessor = areaGen.y0();

      expect(y0Accessor([10, 20], 0, [])).toBe(0);
      expect(y0Accessor([5, 15], 0, [])).toBe(0);
    });

    it('should have default y1 accessor that returns second element', () => {
      const areaGen = area<Coordinate>();
      const y1Accessor = areaGen.y1();

      expect(y1Accessor).not.toBeNull();
      if (y1Accessor) {
        expect(y1Accessor([10, 20], 0, [])).toBe(20);
        expect(y1Accessor([5, 15], 0, [])).toBe(15);
      }
    });

    it('should have default defined accessor that returns true', () => {
      const areaGen = area<Coordinate>();
      const definedAccessor = areaGen.defined();

      expect(definedAccessor([10, 20], 0, [])).toBe(true);
      expect(definedAccessor([0, 0], 0, [])).toBe(true);
    });

    it('should have default context of null', () => {
      const areaGen = area<Coordinate>();
      expect(areaGen.context()).toBeNull();
    });
  });

  describe('x accessor', () => {
    it('should get current x accessor', () => {
      const areaGen = area<Coordinate>();
      const accessor = areaGen.x();

      expect(typeof accessor).toBe('function');
      expect(accessor([5, 10], 0, [])).toBe(5);
    });

    it('should set x accessor function and return area generator', () => {
      const areaGen = area<Coordinate>();
      const customAccessor = (d: Coordinate) => d[0] * 2;

      const result = areaGen.x(customAccessor);
      expect(result).toBe(areaGen);

      const newAccessor = areaGen.x();
      expect(newAccessor([5, 10], 0, [])).toBe(10); // 5 * 2
    });

    it('should set x to constant number and return area generator', () => {
      const areaGen = area<Coordinate>();

      const result = areaGen.x(100);
      expect(result).toBe(areaGen);

      const accessor = areaGen.x();
      expect(accessor([5, 10], 0, [])).toBe(100);
      expect(accessor([0, 0], 0, [])).toBe(100);
    });

    it('should work with custom data types', () => {
      interface Point {
        timestamp: number;
        value: number;
      }

      const areaGen = area<Point>();
      areaGen.x((d) => d.timestamp);

      const accessor = areaGen.x();
      expect(accessor({ timestamp: 123, value: 456 }, 0, [])).toBe(123);
    });

    it('should receive index and data array parameters', () => {
      const areaGen = area<Coordinate>();
      let receivedIndex: number | undefined;
      let receivedData: Coordinate[] | undefined;

      areaGen.x((d, index, data) => {
        receivedIndex = index;
        receivedData = data;
        return d[0];
      });

      const testData: Coordinate[] = [
        [1, 2],
        [3, 4],
      ];
      const accessor = areaGen.x();
      accessor([1, 2], 0, testData);

      expect(receivedIndex).toBeDefined();
      expect(receivedIndex).toBe(0);
      expect(receivedData).toBeDefined();
      expect(receivedData).toBe(testData);
    });
  });

  describe('y0 accessor', () => {
    it('should get current y0 accessor', () => {
      const areaGen = area<Coordinate>();
      const accessor = areaGen.y0();

      expect(typeof accessor).toBe('function');
      expect(accessor([5, 10], 0, [])).toBe(0);
    });

    it('should set y0 accessor function and return area generator', () => {
      const areaGen = area<Coordinate>();
      const customAccessor = (d: Coordinate) => d[1] / 2;

      const result = areaGen.y0(customAccessor);
      expect(result).toBe(areaGen);

      const newAccessor = areaGen.y0();
      expect(newAccessor([5, 10], 0, [])).toBe(5); // 10 / 2
    });

    it('should set y0 to constant number and return area generator', () => {
      const areaGen = area<Coordinate>();

      const result = areaGen.y0(50);
      expect(result).toBe(areaGen);

      const accessor = areaGen.y0();
      expect(accessor([5, 10], 0, [])).toBe(50);
      expect(accessor([0, 0], 0, [])).toBe(50);
    });

    it('should work with baseline calculations', () => {
      const areaGen = area<Coordinate>();
      const baseline = 100;

      areaGen.y0(() => baseline);

      const accessor = areaGen.y0();
      expect(accessor([10, 20], 0, [])).toBe(100);
    });
  });

  describe('y1 accessor', () => {
    it('should get current y1 accessor', () => {
      const areaGen = area<Coordinate>();
      const accessor = areaGen.y1();

      expect(accessor).not.toBeNull();
      expect(typeof accessor).toBe('function');
      if (accessor) {
        expect(accessor([5, 10], 0, [])).toBe(10);
      }
    });

    it('should set y1 accessor function and return area generator', () => {
      const areaGen = area<Coordinate>();
      const customAccessor = (d: Coordinate) => d[1] * 3;

      const result = areaGen.y1(customAccessor);
      expect(result).toBe(areaGen);

      const newAccessor = areaGen.y1();
      expect(newAccessor).not.toBeNull();
      if (newAccessor) {
        expect(newAccessor([5, 10], 0, [])).toBe(30); // 10 * 3
      }
    });

    it('should set y1 to constant number and return area generator', () => {
      const areaGen = area<Coordinate>();

      const result = areaGen.y1(200);
      expect(result).toBe(areaGen);

      const accessor = areaGen.y1();
      expect(accessor).not.toBeNull();
      if (accessor) {
        expect(accessor([5, 10], 0, [])).toBe(200);
        expect(accessor([0, 0], 0, [])).toBe(200);
      }
    });

    it('should work with scaling like in real usage', () => {
      const areaGen = area<Coordinate>();
      const scale = 2;

      areaGen.y1((coordinate) => coordinate[1] * scale);

      const accessor = areaGen.y1();
      expect(accessor).not.toBeNull();
      if (accessor) {
        expect(accessor([10, 20], 0, [])).toBe(40); // 20 * 2
      }
    });
  });

  describe('defined accessor', () => {
    it('should get current defined accessor', () => {
      const areaGen = area<Coordinate>();
      const accessor = areaGen.defined();

      expect(typeof accessor).toBe('function');
      expect(accessor([5, 10], 0, [])).toBe(true);
    });

    it('should set defined accessor function and return area generator', () => {
      const areaGen = area<Coordinate>();
      const customAccessor = (d: Coordinate) => d[1] != null;

      const result = areaGen.defined(customAccessor);
      expect(result).toBe(areaGen);

      const newAccessor = areaGen.defined();
      expect(newAccessor([5, 10], 0, [])).toBe(true);
      expect(newAccessor([5, null as unknown as number], 0, [])).toBe(false);
    });

    it('should set defined to constant boolean and return area generator', () => {
      const areaGen = area<Coordinate>();

      const result = areaGen.defined(false);
      expect(result).toBe(areaGen);

      const accessor = areaGen.defined();
      expect(accessor([5, 10], 0, [])).toBe(false);
      expect(accessor([0, 0], 0, [])).toBe(false);
    });

    it('should work with null checking like in real usage', () => {
      const areaGen = area<Coordinate>();

      areaGen.defined((coordinate) => coordinate[1] != null);

      const accessor = areaGen.defined();
      expect(accessor([10, 20], 0, [])).toBe(true);
      expect(accessor([10, null as unknown as number], 0, [])).toBe(false);
      expect(accessor([10, undefined as unknown as number], 0, [])).toBe(false);
    });
  });

  describe('context accessor', () => {
    it('should get current context', () => {
      const areaGen = area<Coordinate>();
      expect(areaGen.context()).toBeNull();
    });

    it('should set context and return area generator', () => {
      const areaGen = area<Coordinate>();

      const result = areaGen.context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      expect(result).toBe(areaGen);
      expect(areaGen.context()).toBe(mockContext);
    });

    it('should set context to null and return area generator', () => {
      const areaGen = area<Coordinate>();
      areaGen.context(mockContext as unknown as CanvasRenderingContext2D);

      const result = areaGen.context(null);
      expect(result).toBe(areaGen);
      expect(areaGen.context()).toBeNull();
    });
  });

  describe('area rendering', () => {
    beforeEach(() => {
      mockContext.reset();
    });

    it('should not render without context', () => {
      const areaGen = area<Coordinate>();
      const coordinates: Coordinate[] = [
        [0, 0],
        [10, 10],
        [20, 5],
      ];

      areaGen(coordinates);

      expect(mockContext.getOperations()).toHaveLength(0);
    });

    it('should render simple area with moveTo, lineTo, and closePath', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10],
        [10, 20],
        [20, 15],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // Top line (y1) from left to right
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [10, 20] },
        { method: 'lineTo', args: [20, 15] },
        // Bottom line (y0) from right to left
        { method: 'lineTo', args: [20, 0] },
        { method: 'lineTo', args: [10, 0] },
        { method: 'lineTo', args: [0, 0] },
        // D3 calls closePath
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle single point area', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [[5, 8]];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [5, 8] }, // y1
        { method: 'lineTo', args: [5, 0] }, // y0
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle empty data array', () => {
      const areaGen = area<Coordinate>().context(
        mockContext as unknown as CanvasRenderingContext2D,
      );
      const coordinates: Coordinate[] = [];

      areaGen(coordinates);

      expect(mockContext.getOperations()).toHaveLength(0);
    });

    it('should work with custom accessors', () => {
      const areaGen = area<Coordinate>()
        .x((d) => d[0] * 2)
        .y0(10)
        .y1((d) => d[1] + 5)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [1, 2],
        [3, 4],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // Top line: [1*2, 2+5], [3*2, 4+5]
        { method: 'moveTo', args: [2, 7] },
        { method: 'lineTo', args: [6, 9] },
        // Bottom line: [3*2, 10], [1*2, 10]
        { method: 'lineTo', args: [6, 10] },
        { method: 'lineTo', args: [2, 10] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should work with constant values', () => {
      const areaGen = area<Coordinate>()
        .x(100)
        .y0(50)
        .y1(150)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [1, 2],
        [3, 4],
        [5, 6],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // Top line: all at y1=150
        { method: 'moveTo', args: [100, 150] },
        { method: 'lineTo', args: [100, 150] },
        { method: 'lineTo', args: [100, 150] },
        // Bottom line: all at y0=50
        { method: 'lineTo', args: [100, 50] },
        { method: 'lineTo', args: [100, 50] },
        { method: 'lineTo', args: [100, 50] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should work with Iterable input', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates = new Set<Coordinate>([
        [0, 10],
        [10, 20],
      ]);

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toHaveLength(5); // 2 moveTo/lineTo + 2 lineTo + closePath
      expect(operations[0].method).toBe('moveTo');
      expect(operations[operations.length - 1].method).toBe('closePath');
    });
  });

  describe('defined point handling', () => {
    beforeEach(() => {
      mockContext.reset();
    });

    it('should skip undefined points', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10],
        [10, null as unknown as number],
        [20, 20],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: [0, 10]
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
        // Second segment: [20, 20]
        { method: 'moveTo', args: [20, 20] },
        { method: 'lineTo', args: [20, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle all undefined points', () => {
      const areaGen = area<Coordinate>()
        .defined(() => false)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 0],
        [10, 10],
        [20, 20],
      ];

      areaGen(coordinates);

      expect(mockContext.getOperations()).toHaveLength(0);
    });

    it('should handle undefined points at start', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, null as unknown as number],
        [10, 10],
        [20, 20],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [10, 10] },
        { method: 'lineTo', args: [20, 20] },
        { method: 'lineTo', args: [20, 0] },
        { method: 'lineTo', args: [10, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle undefined points at end', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10],
        [10, 20],
        [20, null as unknown as number],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [10, 20] },
        { method: 'lineTo', args: [10, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
      ]);
    });
  });

  describe('gap handling in areas', () => {
    beforeEach(() => {
      mockContext.reset();
    });

    it('should handle multiple consecutive undefined points', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10],
        [5, 15], // First segment
        [10, null as unknown as number],
        [15, null as unknown as number], // Multiple consecutive gaps
        [20, 20],
        [25, 25], // Second segment
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: [0, 10] and [5, 15]
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [5, 15] },
        { method: 'lineTo', args: [5, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
        // Second segment: [20, 20] and [25, 25]
        { method: 'moveTo', args: [20, 20] },
        { method: 'lineTo', args: [25, 25] },
        { method: 'lineTo', args: [25, 0] },
        { method: 'lineTo', args: [20, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle gaps at start of data', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, null as unknown as number],
        [5, null as unknown as number], // Gaps at start
        [10, 10],
        [15, 15], // Valid data
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // Only one segment for the valid data
        { method: 'moveTo', args: [10, 10] },
        { method: 'lineTo', args: [15, 15] },
        { method: 'lineTo', args: [15, 0] },
        { method: 'lineTo', args: [10, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle gaps at end of data', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10],
        [5, 15], // Valid data
        [10, null as unknown as number],
        [15, null as unknown as number], // Gaps at end
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // Only one segment for the valid data
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [5, 15] },
        { method: 'lineTo', args: [5, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle alternating gaps', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10], // Segment 1
        [5, null as unknown as number], // Gap
        [10, 20], // Segment 2
        [15, null as unknown as number], // Gap
        [20, 30], // Segment 3
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: [0, 10] (single point)
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
        // Second segment: [10, 20] (single point)
        { method: 'moveTo', args: [10, 20] },
        { method: 'lineTo', args: [10, 0] },
        { method: 'closePath', args: [] },
        // Third segment: [20, 30] (single point)
        { method: 'moveTo', args: [20, 30] },
        { method: 'lineTo', args: [20, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle all undefined data gracefully', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, null as unknown as number],
        [5, null as unknown as number],
        [10, null as unknown as number],
      ];

      areaGen(coordinates);

      // Should render nothing
      expect(mockContext.getOperations()).toHaveLength(0);
    });

    it('should handle mix of single points and multi-point segments', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10], // Single point segment
        [5, null as unknown as number], // Gap
        [10, 20],
        [15, 25],
        [20, 22], // Multi-point segment
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: single point [0, 10]
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
        // Second segment: multi-point [10, 20], [15, 25], [20, 22]
        { method: 'moveTo', args: [10, 20] },
        { method: 'lineTo', args: [15, 25] },
        { method: 'lineTo', args: [20, 22] },
        { method: 'lineTo', args: [20, 0] },
        { method: 'lineTo', args: [15, 0] },
        { method: 'lineTo', args: [10, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle gaps with different y0 values', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0((d) => d[0] / 10) // Variable baseline
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10], // Baseline = 0
        [10, null as unknown as number], // Gap
        [20, 30], // Baseline = 2
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment with baseline 0
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
        // Second segment with baseline 2
        { method: 'moveTo', args: [20, 30] },
        { method: 'lineTo', args: [20, 2] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle complex gap patterns with stacked areas', () => {
      interface StackedData {
        x: number;
        lower: number | null;
        upper: number | null;
      }

      const areaGen = area<StackedData>()
        .defined((d) => d.lower !== null && d.upper !== null)
        .x((d) => d.x)
        .y0((d) => d.lower || 0)
        .y1((d) => d.upper || 0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const data: StackedData[] = [
        { x: 0, lower: 0, upper: 10 }, // Valid
        { x: 10, lower: null, upper: 15 }, // Invalid (null lower)
        { x: 20, lower: 5, upper: null }, // Invalid (null upper)
        { x: 30, lower: 3, upper: 18 }, // Valid
      ];

      areaGen(data);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: x=0
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
        // Second segment: x=30
        { method: 'moveTo', args: [30, 18] },
        { method: 'lineTo', args: [30, 3] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle very sparse data with large gaps', () => {
      const areaGen = area<Coordinate>()
        .defined((d) => d[1] !== null)
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10], // First point
        ...Array(10)
          .fill(null)
          .map((_, i) => [i + 1, null as unknown as number] as Coordinate), // 10 gaps
        [11, 20], // Second point
        ...Array(5)
          .fill(null)
          .map((_, i) => [i + 12, null as unknown as number] as Coordinate), // 5 gaps
        [17, 30], // Third point
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: x=0
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
        // Second segment: x=11
        { method: 'moveTo', args: [11, 20] },
        { method: 'lineTo', args: [11, 0] },
        { method: 'closePath', args: [] },
        // Third segment: x=17
        { method: 'moveTo', args: [17, 30] },
        { method: 'lineTo', args: [17, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle partial gaps in multi-dimensional data', () => {
      interface MultiData {
        x: number;
        y: number | null;
        z: number;
        isValid: boolean;
      }

      const areaGen = area<MultiData>()
        .defined((d) => d.y !== null && d.isValid)
        .x((d) => d.x)
        .y0((d) => d.z)
        .y1((d) => d.y || 0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const data: MultiData[] = [
        { x: 0, y: 20, z: 5, isValid: true }, // Valid
        { x: 10, y: 25, z: 5, isValid: false }, // Invalid (isValid false)
        { x: 20, y: null, z: 5, isValid: true }, // Invalid (y null)
        { x: 30, y: 30, z: 8, isValid: true }, // Valid
      ];

      areaGen(data);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: x=0
        { method: 'moveTo', args: [0, 20] },
        { method: 'lineTo', args: [0, 5] },
        { method: 'closePath', args: [] },
        // Second segment: x=30
        { method: 'moveTo', args: [30, 30] },
        { method: 'lineTo', args: [30, 8] },
        { method: 'closePath', args: [] },
      ]);
    });
  });

  describe('method chaining', () => {
    it('should allow full method chaining', () => {
      const areaGen = area<Coordinate>()
        .x((d) => d[0] + 5)
        .y0(10)
        .y1((d) => d[1] + 15)
        .defined((d) => d[1] != null)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      expect(typeof areaGen).toBe('function');
      expect(areaGen.context()).toBe(mockContext);
    });

    it('should maintain state through chaining', () => {
      const areaGen = area<Coordinate>()
        .x((d) => d[0] * 2)
        .y0(50)
        .y1(100)
        .defined(false)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [1, 2],
        [3, 4],
      ];
      areaGen(coordinates);

      // Should not render anything because defined is false
      expect(mockContext.getOperations()).toHaveLength(0);
    });

    it('should work in any order', () => {
      const areaGen = area<Coordinate>()
        .context(mockContext as unknown as CanvasRenderingContext2D)
        .defined((d) => d[1] > 0)
        .y1((d) => d[1] * 2)
        .y0(5)
        .x((d) => d[0] + 1);

      const coordinates: Coordinate[] = [[0, 10]];
      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [1, 20] }, // [0+1, 10*2]
        { method: 'lineTo', args: [1, 5] }, // [0+1, 5]
        { method: 'closePath', args: [] },
      ]);
    });
  });

  describe('real-world usage patterns', () => {
    beforeEach(() => {
      mockContext.reset();
    });

    it('should match the documented usage pattern', () => {
      const y0 = 100;
      const context = mockContext as unknown as CanvasRenderingContext2D;

      const coordinates: Coordinate[] = [
        [0, 120],
        [10, 150],
        [20, null as unknown as number],
        [30, 130],
      ];

      area<Coordinate>()
        .defined((coordinate) => coordinate[1] != null)
        .x((coordinate) => coordinate[0])
        .y0(y0)
        .y1((coordinate) => coordinate[1])
        .context(context)(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: [0, 120] and [10, 150]
        { method: 'moveTo', args: [0, 120] },
        { method: 'lineTo', args: [10, 150] },
        { method: 'lineTo', args: [10, 100] },
        { method: 'lineTo', args: [0, 100] },
        { method: 'closePath', args: [] },
        // Second segment: [30, 130] (isolated point)
        { method: 'moveTo', args: [30, 130] },
        { method: 'lineTo', args: [30, 100] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should work with time series data', () => {
      interface DataPoint {
        timestamp: number;
        value: number | null;
        baseline: number;
      }

      const areaGen = area<DataPoint>()
        .defined((d) => d.value !== null)
        .x((d) => d.timestamp)
        .y0((d) => d.baseline)
        .y1((d) => d.value || 0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const data: DataPoint[] = [
        { timestamp: 0, value: 10, baseline: 5 },
        { timestamp: 1, value: 20, baseline: 5 },
        { timestamp: 2, value: null, baseline: 5 },
        { timestamp: 3, value: 15, baseline: 5 },
      ];

      areaGen(data);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: timestamps 0 and 1
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [1, 20] },
        { method: 'lineTo', args: [1, 5] },
        { method: 'lineTo', args: [0, 5] },
        { method: 'closePath', args: [] },
        // Second segment: timestamp 3 (isolated)
        { method: 'moveTo', args: [3, 15] },
        { method: 'lineTo', args: [3, 5] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should work with scaled coordinates', () => {
      // Simulating scale functions
      const xScale = (value: number) => value * 10;
      const yScale = (value: number) => 200 - value * 5;

      const areaGen = area<Coordinate>()
        .x((d) => xScale(d[0]))
        .y0(yScale(0)) // Baseline at scaled 0
        .y1((d) => yScale(d[1]))
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [1, 2],
        [2, 4],
        [3, 6],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // Top line: scaled y1 values
        { method: 'moveTo', args: [10, 190] }, // xScale(1), yScale(2)
        { method: 'lineTo', args: [20, 180] }, // xScale(2), yScale(4)
        { method: 'lineTo', args: [30, 170] }, // xScale(3), yScale(6)
        // Bottom line: scaled baseline
        { method: 'lineTo', args: [30, 200] }, // xScale(3), yScale(0)
        { method: 'lineTo', args: [20, 200] }, // xScale(2), yScale(0)
        { method: 'lineTo', args: [10, 200] }, // xScale(1), yScale(0)
        { method: 'closePath', args: [] },
      ]);
    });

    it('should work with stacked area data', () => {
      interface StackedData {
        x: number;
        lower: number;
        upper: number;
      }

      const areaGen = area<StackedData>()
        .x((d) => d.x)
        .y0((d) => d.lower)
        .y1((d) => d.upper)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const data: StackedData[] = [
        { x: 0, lower: 0, upper: 10 },
        { x: 10, lower: 5, upper: 25 },
        { x: 20, lower: 3, upper: 18 },
      ];

      areaGen(data);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // Top line (upper values)
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [10, 25] },
        { method: 'lineTo', args: [20, 18] },
        // Bottom line (lower values) in reverse
        { method: 'lineTo', args: [20, 3] },
        { method: 'lineTo', args: [10, 5] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should work with percentage areas', () => {
      const areaGen = area<Coordinate>()
        .x((d) => d[0])
        .y0(0)
        .y1((d) => d[1]) // Assume values are already 0-100%
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const percentages: Coordinate[] = [
        [0, 0],
        [25, 40],
        [50, 75],
        [75, 60],
        [100, 20],
      ];

      areaGen(percentages);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // Top line
        { method: 'moveTo', args: [0, 0] },
        { method: 'lineTo', args: [25, 40] },
        { method: 'lineTo', args: [50, 75] },
        { method: 'lineTo', args: [75, 60] },
        { method: 'lineTo', args: [100, 20] },
        // Bottom line (baseline at 0)
        { method: 'lineTo', args: [100, 0] },
        { method: 'lineTo', args: [75, 0] },
        { method: 'lineTo', args: [50, 0] },
        { method: 'lineTo', args: [25, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
      ]);
    });
  });

  describe('edge cases and error handling', () => {
    beforeEach(() => {
      mockContext.reset();
    });

    it('should handle NaN coordinates gracefully', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10],
        [NaN, 20],
        [20, 15],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [NaN, 20] }, // Canvas will handle NaN
        { method: 'lineTo', args: [20, 15] },
        { method: 'lineTo', args: [20, 0] },
        { method: 'lineTo', args: [NaN, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle Infinity coordinates', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10],
        [Infinity, 20],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [Infinity, 20] },
        { method: 'lineTo', args: [Infinity, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle very large datasets efficiently', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [];

      // Generate 1000 points
      for (let i = 0; i < 1000; i++) {
        coordinates.push([i, Math.sin(i / 100) * 50 + 50]);
      }

      const start = performance.now();
      areaGen(coordinates);
      const end = performance.now();

      expect(end - start).toBeLessThan(100); // Should be fast
      expect(mockContext.getOperations()).toHaveLength(2001); // 1000 top + 1000 bottom + closePath
    });

    it('should work with zero coordinates', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 0],
        [0, 0],
        [0, 0],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should work with negative coordinates', () => {
      const areaGen = area<Coordinate>()
        .y0(-50)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [-10, -20],
        [-5, -15],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [-10, -20] },
        { method: 'lineTo', args: [-5, -15] },
        { method: 'lineTo', args: [-5, -50] },
        { method: 'lineTo', args: [-10, -50] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle inverted y coordinates (y0 > y1)', () => {
      const areaGen = area<Coordinate>()
        .y0(100)
        .y1((d) => d[1]) // y1 might be less than y0
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 80],
        [10, 70],
      ]; // y1 < y0

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 80] },
        { method: 'lineTo', args: [10, 70] },
        { method: 'lineTo', args: [10, 100] },
        { method: 'lineTo', args: [0, 100] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should handle areas with same y0 and y1 values', () => {
      const areaGen = area<Coordinate>()
        .y0(50)
        .y1(50) // Zero height area
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10],
        [10, 20],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 50] },
        { method: 'lineTo', args: [10, 50] },
        { method: 'lineTo', args: [10, 50] },
        { method: 'lineTo', args: [0, 50] },
        { method: 'closePath', args: [] },
      ]);
    });
  });

  describe('type safety', () => {
    it('should work with custom data structures', () => {
      interface DataPoint3D {
        x: number;
        y: number;
        z: number;
        baseline: number;
        visible: boolean;
      }

      const areaGen = area<DataPoint3D>()
        .x((d) => d.x)
        .y0((d) => d.baseline)
        .y1((d) => d.y)
        .defined((d) => d.visible)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const points: DataPoint3D[] = [
        { x: 0, y: 10, z: 5, baseline: 0, visible: true },
        { x: 10, y: 20, z: 15, baseline: 5, visible: false },
        { x: 20, y: 15, z: 10, baseline: 2, visible: true },
      ];

      areaGen(points);

      const operations = mockContext.getOperations();
      expect(operations).toEqual([
        // First segment: point at x=0
        { method: 'moveTo', args: [0, 10] },
        { method: 'lineTo', args: [0, 0] },
        { method: 'closePath', args: [] },
        // Second segment: point at x=20 (skip invisible point at x=10)
        { method: 'moveTo', args: [20, 15] },
        { method: 'lineTo', args: [20, 2] },
        { method: 'closePath', args: [] },
      ]);
    });

    it('should work with complex data transformations', () => {
      interface StockData {
        date: Date;
        open: number;
        close: number;
        volume: number;
      }

      const areaGen = area<StockData>()
        .x((d) => d.date.getTime())
        .y0((d) => Math.min(d.open, d.close))
        .y1((d) => Math.max(d.open, d.close))
        .defined((d) => d.volume > 0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const data: StockData[] = [
        { date: new Date(2024, 0, 1), open: 100, close: 110, volume: 1000 },
        { date: new Date(2024, 0, 2), open: 105, close: 95, volume: 0 },
        { date: new Date(2024, 0, 3), open: 98, close: 105, volume: 1500 },
      ];

      areaGen(data);

      const operations = mockContext.getOperations();
      expect(operations).toHaveLength(6);
      expect(operations[0].method).toBe('moveTo');
      expect(operations[operations.length - 1].method).toBe('closePath');
    });

    it('should work with different coordinate systems', () => {
      interface PolarCoordinate {
        angle: number;
        radius: number;
        innerRadius: number;
      }

      // Convert polar to cartesian
      const toCartesian = (angle: number, radius: number) => ({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
      });

      const areaGen = area<PolarCoordinate>()
        .x((d) => toCartesian(d.angle, d.radius).x)
        .y0((d) => toCartesian(d.angle, d.innerRadius).y)
        .y1((d) => toCartesian(d.angle, d.radius).y)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const polarData: PolarCoordinate[] = [
        { angle: 0, radius: 10, innerRadius: 5 },
        { angle: Math.PI / 2, radius: 15, innerRadius: 7 },
      ];

      areaGen(polarData);

      const operations = mockContext.getOperations();
      expect(operations).toHaveLength(5); // 2 top + 2 bottom + closePath
      expect(operations[0].method).toBe('moveTo');
      expect(operations[operations.length - 1].method).toBe('closePath');
    });
  });

  describe('performance and precision', () => {
    it('should handle many operations efficiently', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      // Generate large dataset
      const coordinates: Coordinate[] = [];
      for (let i = 0; i < 5000; i++) {
        coordinates.push([i, Math.random() * 100]);
      }

      const start = performance.now();
      areaGen(coordinates);
      const end = performance.now();

      expect(end - start).toBeLessThan(200); // Should be reasonably fast
      expect(mockContext.getOperations()).toHaveLength(10001); // 5000*2 + closePath
    });

    it('should maintain precision with floating point arithmetic', () => {
      const areaGen = area<Coordinate>()
        .x((d) => d[0] * 0.1)
        .y0((d) => d[1] * 0.3)
        .y1((d) => d[1] * 0.7)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [[10, 20]];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations[0].args).toEqual([1, 14]); // 10*0.1, 20*0.7
      expect(operations[1].args).toEqual([1, 6]); // 10*0.1, 20*0.3
    });

    it('should handle extreme values gracefully', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, Number.MAX_SAFE_INTEGER / 2],
        [Number.MAX_SAFE_INTEGER / 2, 100],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations).toHaveLength(5);
      expect(isFinite(operations[0].args[0] ?? 0)).toBe(true);
      expect(isFinite(operations[0].args[1] ?? 0)).toBe(true);
    });
  });

  describe('area-specific behaviors', () => {
    beforeEach(() => {
      mockContext.reset();
    });

    it('should always close the path', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 10],
        [10, 20],
        [20, 15],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations[0]).toEqual({ method: 'moveTo', args: [0, 10] });
      expect(operations[operations.length - 1]).toEqual({
        method: 'closePath',
        args: [],
      });
    });

    it('should render top line first, then bottom line in reverse', () => {
      const areaGen = area<Coordinate>()
        .y0(10)
        .y1((d) => d[1])
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 20],
        [5, 25],
        [10, 22],
      ];

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      expect(operations.slice(0, 3)).toEqual([
        // Top line (y1) from left to right
        { method: 'moveTo', args: [0, 20] },
        { method: 'lineTo', args: [5, 25] },
        { method: 'lineTo', args: [10, 22] },
      ]);
      expect(operations.slice(3, 6)).toEqual([
        // Bottom line (y0) from right to left
        { method: 'lineTo', args: [10, 10] },
        { method: 'lineTo', args: [5, 10] },
        { method: 'lineTo', args: [0, 10] },
      ]);
    });

    it('should create correct winding for fills', () => {
      const areaGen = area<Coordinate>()
        .y0(0)
        .y1(50)
        .context(mockContext as unknown as CanvasRenderingContext2D);

      const coordinates: Coordinate[] = [
        [0, 50],
        [50, 50],
      ]; // Rectangle

      areaGen(coordinates);

      const operations = mockContext.getOperations();
      // Should create clockwise winding: top-left → top-right → bottom-right → bottom-left
      expect(operations).toEqual([
        { method: 'moveTo', args: [0, 50] }, // Top-left
        { method: 'lineTo', args: [50, 50] }, // Top-right
        { method: 'lineTo', args: [50, 0] }, // Bottom-right
        { method: 'lineTo', args: [0, 0] }, // Bottom-left
        { method: 'closePath', args: [] },
      ]);
    });
  });
});
