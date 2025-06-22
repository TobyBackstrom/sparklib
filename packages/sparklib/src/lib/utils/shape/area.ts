/**
 * Area generator interface for Canvas rendering.
 * A drop-in replacement for a limited usage of D3's version in Canvas contexts.
 *
 * @template T - The type of data elements in the input array
 *
 * @public
 */
export interface Area<T> {
  /**
   * Renders an area to the configured canvas context for the given array of data.
   *
   * @param data - Array of data elements to render as an area
   *
   * @remarks
   * - Requires a canvas context to be set via `.context()`
   * - Renders area by drawing the top line (y1) then bottom line (y0) in reverse
   * - Creates a closed path that can be filled
   */
  (data: Iterable<T> | T[]): void;

  /**
   * Gets the current x-coordinate accessor function.
   */
  x(): (d: T, index: number, data: T[]) => number;
  /**
   * Sets the x-coordinate to a constant value for both x0 and x1.
   */
  x(x: number): this;
  /**
   * Sets the x-coordinate accessor function for both x0 and x1.
   */
  x(x: (d: T, index: number, data: T[]) => number): this;

  /**
   * Gets the current y0 (baseline) accessor function.
   */
  y0(): (d: T, index: number, data: T[]) => number;
  /**
   * Sets the y0 (baseline) to a constant value.
   */
  y0(y: number): this;
  /**
   * Sets the y0 (baseline) accessor function.
   */
  y0(y: (d: T, index: number, data: T[]) => number): this;

  /**
   * Gets the current y1 (topline) accessor function.
   */
  y1(): ((d: T, index: number, data: T[]) => number) | null;
  /**
   * Sets the y1 (topline) to a constant value.
   */
  y1(y: number): this;
  /**
   * Sets the y1 (topline) accessor function.
   */
  y1(y: (d: T, index: number, data: T[]) => number): this;

  /**
   * Gets the current defined accessor function.
   */
  defined(): (d: T, index: number, data: T[]) => boolean;
  /**
   * Sets whether all points are defined (constant boolean).
   */
  defined(defined: boolean): this;
  /**
   * Sets the defined accessor function.
   */
  defined(defined: (d: T, index: number, data: T[]) => boolean): this;

  /**
   * Gets the current canvas rendering context.
   */
  context(): CanvasRenderingContext2D | null;
  /**
   * Sets the canvas rendering context.
   */
  context(context: CanvasRenderingContext2D | null): this;
}

/**
 * Creates a new area generator for rendering areas to a Canvas context.
 *
 * @template T - The type of data elements (defaults to [number, number])
 * @returns A new area generator with default settings
 *
 * @remarks
 * - Default x accessor: `(d) => d[0]` (assumes [x, y] tuples)
 * - Default y0 accessor: `() => 0` (baseline at zero)
 * - Default y1 accessor: `(d) => d[1]` (assumes [x, y] tuples)
 * - Default defined accessor: `() => true` (all points defined)
 * - Canvas-only implementation - no SVG path string generation
 *
 * @public
 */
export function area<T = [number, number]>(): Area<T> {
  let _x: (d: T, index: number, data: T[]) => number = (d: T) =>
    (d as unknown as [number, number])[0];
  let _y0: (d: T, index: number, data: T[]) => number = () => 0;
  let _y1: ((d: T, index: number, data: T[]) => number) | null = (d: T) =>
    (d as unknown as [number, number])[1];
  let _defined: (d: T, index: number, data: T[]) => boolean = () => true;
  let _context: CanvasRenderingContext2D | null = null;

  /**
   * Renders the area to the canvas context.
   */
  function areaGenerator(data: Iterable<T> | T[]): void {
    if (!_context) return;

    const dataArray = Array.isArray(data) ? data : Array.from(data);
    const segments: Array<Array<{ x: number; y0: number; y1: number }>> = [];
    let currentSegment: Array<{ x: number; y0: number; y1: number }> = [];

    // Group defined points into continuous segments
    for (let i = 0; i < dataArray.length; i++) {
      const d = dataArray[i];
      if (_defined(d, i, dataArray)) {
        const x = _x(d, i, dataArray);
        const y0 = _y0(d, i, dataArray);
        const y1 = _y1 ? _y1(d, i, dataArray) : y0;
        currentSegment.push({ x, y0, y1 });
      } else {
        // End current segment on undefined point
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }
    }

    // Add final segment if it exists
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }

    // Draw each segment separately
    for (const segment of segments) {
      if (segment.length === 0) continue;

      // Draw the top line (y1) from left to right
      _context.moveTo(segment[0].x, segment[0].y1);
      for (let i = 1; i < segment.length; i++) {
        _context.lineTo(segment[i].x, segment[i].y1);
      }

      // Draw the bottom line (y0) from right to left
      for (let i = segment.length - 1; i >= 0; i--) {
        _context.lineTo(segment[i].x, segment[i].y0);
      }

      // Close each segment
      _context.closePath();
    }
  }

  // X accessor methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  areaGenerator.x = function (x?: any): any {
    if (arguments.length === 0) return _x;
    _x =
      typeof x === 'number'
        ? () => x
        : (x as (d: T, index: number, data: T[]) => number);
    return areaGenerator;
  };

  // Y0 accessor methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  areaGenerator.y0 = function (y?: any): any {
    if (arguments.length === 0) return _y0;
    _y0 =
      typeof y === 'number'
        ? () => y
        : (y as (d: T, index: number, data: T[]) => number);
    return areaGenerator;
  };

  // Y1 accessor methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  areaGenerator.y1 = function (y?: any): any {
    if (arguments.length === 0) return _y1;
    _y1 =
      typeof y === 'number'
        ? () => y
        : (y as (d: T, index: number, data: T[]) => number);
    return areaGenerator;
  };

  // Defined accessor methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  areaGenerator.defined = function (defined?: any): any {
    if (arguments.length === 0) return _defined;
    _defined =
      typeof defined === 'boolean'
        ? () => defined
        : (defined as (d: T, index: number, data: T[]) => boolean);
    return areaGenerator;
  };

  // Context methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  areaGenerator.context = function (context?: any): any {
    if (arguments.length === 0) return _context;
    _context = context as CanvasRenderingContext2D | null;
    return areaGenerator;
  };

  return areaGenerator;
}
