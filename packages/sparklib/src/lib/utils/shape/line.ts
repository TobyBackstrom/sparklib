/**
 * Line generator interface for Canvas rendering.
 *
 * @template T - The type of data elements in the input array
 *
 * @example
 * ```typescript
 * // Basic usage with coordinate pairs
 * const lineGen = line<[number, number]>()
 *   .x(d => d[0])
 *   .y(d => d[1])
 *   .context(canvasContext);
 *
 * lineGen([[0, 0], [10, 20], [20, 10]]);
 * ```
 *
 * @public
 */
export interface Line<T> {
  /**
   * Renders a line to the configured canvas context for the given array of data.
   *
   * @param data - Array of data elements to render as a line
   *
   * @example
   * ```typescript
   * const coordinates: Coordinate[] = [[0, 0], [10, 20], [20, 10]];
   * lineGenerator(coordinates);
   * ```
   *
   * @remarks
   * - Requires a canvas context to be set via `.context()`
   * - Uses moveTo() for the first point and lineTo() for subsequent points
   * - Handles undefined points by starting new line segments
   */
  (data: Iterable<T> | T[]): void;

  /**
   * Gets the current x-coordinate accessor function.
   *
   * @returns The current x-coordinate accessor function
   */
  x(): (d: T, index: number, data: T[]) => number;
  /**
   * Sets the x-coordinate to a constant value.
   *
   * @param x - A constant x-coordinate value
   * @returns This line generator for method chaining
   */
  x(x: number): this;
  /**
   * Sets the x-coordinate accessor function.
   *
   * @param x - A function that returns the x-coordinate for each data element
   * @returns This line generator for method chaining
   *
   * @example
   * ```typescript
   * lineGen.x((d, i) => d.timestamp * 10); // Scale timestamp to x position
   * ```
   */
  x(x: (d: T, index: number, data: T[]) => number): this;

  /**
   * Gets the current y-coordinate accessor function.
   *
   * @returns The current y-coordinate accessor function
   */
  y(): (d: T, index: number, data: T[]) => number;
  /**
   * Sets the y-coordinate to a constant value.
   *
   * @param y - A constant y-coordinate value
   * @returns This line generator for method chaining
   */
  y(y: number): this;
  /**
   * Sets the y-coordinate accessor function.
   *
   * @param y - A function that returns the y-coordinate for each data element
   * @returns This line generator for method chaining
   *
   * @example
   * ```typescript
   * lineGen.y((d, i) => d.value + offset); // Apply offset to value
   * ```
   */
  y(y: (d: T, index: number, data: T[]) => number): this;

  /**
   * Gets the current defined accessor function.
   *
   * @returns The current defined accessor function
   */
  defined(): (d: T, index: number, data: T[]) => boolean;
  /**
   * Sets whether all points are defined (constant boolean).
   *
   * @param defined - Whether all points should be considered defined
   * @returns This line generator for method chaining
   */
  defined(defined: boolean): this;
  /**
   * Sets the defined accessor function.
   *
   * @param defined - A function that returns whether each data element is defined
   * @returns This line generator for method chaining
   *
   * @example
   * ```typescript
   * // Skip points where y-value is null
   * lineGen.defined((d, i) => d[1] != null);
   * ```
   *
   * @remarks
   * When a point is not defined, it creates a gap in the line. The next defined
   * point will start a new line segment.
   */
  defined(defined: (d: T, index: number, data: T[]) => boolean): this;

  /**
   * Gets the current canvas rendering context.
   *
   * @returns The current canvas context, or null if none is set
   */
  context(): CanvasRenderingContext2D | null;
  /**
   * Sets the canvas rendering context.
   *
   * @param context - The canvas context to render to, or null to clear
   * @returns This line generator for method chaining
   *
   * @example
   * ```typescript
   * const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
   * const ctx = canvas.getContext('2d');
   * lineGen.context(ctx);
   * ```
   */
  context(context: CanvasRenderingContext2D | null): this;
}

/**
 * Creates a new line generator for rendering lines to a Canvas context.
 *
 * @template T - The type of data elements (defaults to [number, number])
 * @returns A new line generator with default settings
 *
 * @example
 * ```typescript
 * // Basic line with coordinate pairs
 * const basicLine = line<Coordinate>()
 *   .x(d => d[0])
 *   .y(d => d[1])
 *   .context(canvasContext);
 *
 * // Line with custom data structure
 * interface DataPoint {
 *   timestamp: number;
 *   value: number;
 *   valid: boolean;
 * }
 *
 * const customLine = line<DataPoint>()
 *   .defined(d => d.valid)
 *   .x(d => d.timestamp)
 *   .y(d => d.value)
 *   .context(canvasContext);
 *
 * // Line with offsets (like your usage)
 * const offsetLine = line<Coordinate>()
 *   .defined(coordinate => coordinate[1] != null)
 *   .x(coordinate => coordinate[0] + lineWidthOffset)
 *   .y(coordinate => coordinate[1] + lineWidthOffset)
 *   .context(context);
 * ```
 *
 * @remarks
 * - Default x accessor: `(d) => d[0]` (assumes [x, y] tuples)
 * - Default y accessor: `(d) => d[1]` (assumes [x, y] tuples)
 * - Default defined accessor: `() => true` (all points defined)
 * - Default context: `null` (must be set before rendering)
 * - Canvas-only implementation - no SVG path string generation
 * - Compatible with D3's line generator API for Canvas rendering
 *
 * @public
 */
export function line<T = [number, number]>(): Line<T> {
  let _x: (d: T, index: number, data: T[]) => number = (d: T) =>
    (d as unknown as [number, number])[0];
  let _y: (d: T, index: number, data: T[]) => number = (d: T) =>
    (d as unknown as [number, number])[1];
  let _defined: (d: T, index: number, data: T[]) => boolean = () => true;
  let _context: CanvasRenderingContext2D | null = null;
  /**
   * Renders the line to the canvas context.
   *
   * @param data - The data array to render
   *
   * @internal
   */
  function lineGenerator(data: Iterable<T> | T[]): void {
    if (!_context) return;

    const dataArray = Array.isArray(data) ? data : Array.from(data);
    let first = true;

    for (let i = 0; i < dataArray.length; i++) {
      const d = dataArray[i];
      if (_defined(d, i, dataArray)) {
        const x = _x(d, i, dataArray);
        const y = _y(d, i, dataArray);

        if (first) {
          _context.moveTo(x, y);
          first = false;
        } else {
          _context.lineTo(x, y);
        }
      } else {
        first = true; // Start new segment after undefined point
      }
    }
  }

  /**
   * X-coordinate accessor getter/setter.
   *
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  lineGenerator.x = function (x?: any): any {
    if (arguments.length === 0) return _x;
    _x = typeof x === 'number' ? () => x : x;
    return lineGenerator;
  };

  /**
   * Y-coordinate accessor getter/setter.
   *
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  lineGenerator.y = function (y?: any): any {
    if (arguments.length === 0) return _y;
    _y = typeof y === 'number' ? () => y : y;
    return lineGenerator;
  };

  /**
   * Defined accessor getter/setter.
   *
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  lineGenerator.defined = function (defined?: any): any {
    if (arguments.length === 0) return _defined;
    _defined = typeof defined === 'boolean' ? () => defined : defined;
    return lineGenerator;
  };

  /**
   * Canvas context getter/setter.
   *
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for getter/setter overload pattern
  lineGenerator.context = function (context?: any): any {
    if (arguments.length === 0) return _context;
    _context = context;
    return lineGenerator;
  };

  return lineGenerator;
}
