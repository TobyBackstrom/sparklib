import * as d3Array from 'd3-array';
import * as d3Color from 'd3-color';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

import { ChartBase, ChartProperties } from './chart-base';
import { LinearGradient } from './linear-gradient';

export type Coordinate = [number, number];
export type Range = [number, number];

enum ArrayType {
  Unknown = 'Unknown',
  SingleNumbers = 'SingleNumbers',
  NumberPairs = 'NumberPairs',
}

export interface LineProperties {
  strokeStyle?: string | LinearGradient; // default: "black"
  lineWidth?: number; // default: 1
  lineDash?: number[]; // default: [], https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
}

interface DatumLine {
  position: number; // x or y, default: 0
  lineProperties: Required<LineProperties>;
}

export interface SparklineParameters {
  lineProps?: LineProperties;
  chartProps?: ChartProperties;
}

export class LineChart extends ChartBase {
  #lineProps: Required<LineProperties>;
  #fillStyle?: string | LinearGradient;

  #xDatumLines: DatumLine[] = [];
  #yDatumLines: DatumLine[] = [];

  #xDomain: Range | undefined;
  #yDomain: Range | undefined;

  constructor(params?: SparklineParameters) {
    super(params?.chartProps);

    const defaultLineProps: Required<LineProperties> = {
      strokeStyle: 'black',
      lineDash: [],
      lineWidth: 1,
    };

    this.#lineProps = params?.lineProps
      ? { ...defaultLineProps, ...params.lineProps }
      : defaultLineProps;
  }

  render(values: (number | [number, number])[]): HTMLCanvasElement {
    const context = super.renderChartBase();

    if (values.length < 2) {
      // This is a line chart, remember? It requires at least a pair of coordinates.
      // Instead of throwing an error just return the empty canvas.
      return context.canvas;
    }

    const arrayType = getArrayType(values);

    const xDomain = this.#getXDomain(values, arrayType);
    const yDomain = this.#getYDomain(values, arrayType);

    const xScale = this.#xScale(xDomain);
    const yScale = this.#yScale(yDomain);

    this.#xDatumLines.forEach((datumLine) =>
      this.#drawDatumLine('x', datumLine, yDomain, xScale, yScale, context)
    );

    this.#yDatumLines.forEach((datumLine) =>
      this.#drawDatumLine('y', datumLine, xDomain, xScale, yScale, context)
    );

    const scaledCoordinates = this.#scaleCoordinates(
      values,
      arrayType,
      xScale,
      yScale
    );

    if (this.#fillStyle) {
      this.#drawArea(scaledCoordinates, yScale(0), this.#fillStyle!, context);
    }

    if (this.#lineProps.lineWidth !== 0) {
      this.#drawPath(scaledCoordinates, this.#lineProps, context);
    }

    return context.canvas;
  }

  // minX - maxX
  xDomain(xDomain: Range) {
    this.#xDomain = xDomain;
    return this;
  }

  // minY - maxY
  yDomain(yDomain: Range) {
    this.#yDomain = yDomain;
    return this;
  }

  // add horizontal reference lines in the y domain
  yDatum(y: number, lineProps?: LineProperties) {
    this.#datum(this.#yDatumLines, y, lineProps);

    return this;
  }

  // add vertical reference lines in the x domain
  xDatum(x: number, lineProps?: LineProperties) {
    this.#datum(this.#xDatumLines, x, lineProps);

    return this;
  }

  strokeStyle(strokeStyle: string | LinearGradient) {
    this.#lineProps.strokeStyle = strokeStyle;
    return this;
  }

  fillStyle(fillStyle?: string | LinearGradient) {
    if (fillStyle) {
      this.#fillStyle = fillStyle;
    }
    return this;
  }

  lineDash(lineDash: number[]) {
    this.#lineProps.lineDash = lineDash;
    return this;
  }

  lineWidth(lineWidth: number) {
    this.#lineProps.lineWidth = lineWidth;
    return this;
  }

  #getXDomain(
    values: (number | [number, number])[],
    arrayType: ArrayType
  ): Range {
    return (
      this.#xDomain ??
      ((arrayType === ArrayType.SingleNumbers
        ? [0, values.length - 1] // index in array defines the x domain
        : d3Array.extent(values as [number, number][], (d) => d[0])) as Range)
    );
  }

  #getYDomain(
    values: (number | [number, number])[],
    arrayType: ArrayType
  ): Range {
    return (
      this.#yDomain ??
      ((arrayType === ArrayType.SingleNumbers
        ? d3Array.extent(values as number[])
        : d3Array.extent(values as [number, number][], (d) => d[1])) as Range)
    );
  }

  #xScale(xDomain: Range): d3Scale.ScaleLinear<number, number, never> {
    return d3Scale
      .scaleLinear()
      .domain(xDomain)
      .range([
        this.marginsProps.left,
        this.chartProps.width! - this.marginsProps.right,
      ]);
  }

  #yScale(yDomain: Range): d3Scale.ScaleLinear<number, number, never> {
    return d3Scale
      .scaleLinear()
      .domain(yDomain)
      .range([
        this.chartProps.height! - this.marginsProps.top,
        this.marginsProps.bottom,
      ]);
  }

  #scaleCoordinates<T extends (number | [number, number])[]>(
    values: T,
    arrayType: ArrayType,
    xScale: d3Scale.ScaleLinear<number, number>,
    yScale: d3Scale.ScaleLinear<number, number>
  ): Coordinate[] {
    return values.map((value, index) => {
      const x =
        arrayType === ArrayType.SingleNumbers
          ? index
          : (value as [number, number])[0];
      const y =
        arrayType === ArrayType.SingleNumbers
          ? (value as number)
          : (value as [number, number])[1];
      return [xScale(x as number), yScale(y)];
    });
  }

  #datum(
    datumLines: DatumLine[],
    position: number,
    datumLineProps?: LineProperties
  ) {
    const defaultDatumLineProps = {
      strokeStyle: 'black',
      lineDash: [1, 1],
      lineWidth: 1,
    };

    const lineProperties = {
      ...defaultDatumLineProps,
      ...datumLineProps,
    } as Required<LineProperties>;

    datumLines.push({ position, lineProperties });
  }

  #drawDatumLine(
    axis: 'x' | 'y',
    datumLine: DatumLine,
    domain: Range,
    xScale: d3Scale.ScaleLinear<number, number>,
    yScale: d3Scale.ScaleLinear<number, number>,
    context: CanvasRenderingContext2D
  ) {
    const scaledCoordinates: Coordinate[] =
      axis === 'x'
        ? [
            [xScale(datumLine.position ?? 0), yScale(domain[0])],
            [xScale(datumLine.position ?? 0), yScale(domain[1])],
          ]
        : [
            [xScale(domain[0]), yScale(datumLine.position ?? 0)],
            [xScale(domain[1]), yScale(datumLine.position ?? 0)],
          ];

    this.#drawPath(scaledCoordinates, datumLine.lineProperties, context);
  }

  #drawArea(
    coordinates: Coordinate[],
    y0: number,
    fillStyle: string | LinearGradient,
    context: CanvasRenderingContext2D
  ) {
    const usedFillStyle =
      fillStyle instanceof LinearGradient
        ? fillStyle.getCanvasGradient(context)
        : fillStyle;

    context.beginPath();

    d3Shape
      .area<Coordinate>()
      .defined((coordinate) => coordinate[1] != null)
      .x((coordinate) => coordinate[0])
      .y0(y0)
      .y1((coordinate) => coordinate[1])
      .context(context)(coordinates);

    context.fillStyle = usedFillStyle;
    context.fill();
    context.closePath();
  }

  #drawPath(
    coordinates: Coordinate[],
    lineProperties: Required<LineProperties>,
    context: CanvasRenderingContext2D
  ) {
    const strokeStyle =
      lineProperties.strokeStyle instanceof LinearGradient
        ? lineProperties.strokeStyle.getCanvasGradient(context)
        : lineProperties.strokeStyle;

    context.beginPath();

    d3Shape
      .line<Coordinate>()
      .defined((coordinate) => coordinate[1] != null)
      .x((coordinate) => coordinate[0])
      .y((coordinate) => coordinate[1])
      .context(context)(coordinates);

    context.strokeStyle = strokeStyle;
    context.lineCap = 'round';
    context.setLineDash(lineProperties.lineDash!);
    context.lineWidth = lineProperties.lineWidth!;
    context.stroke();
    context.closePath();
  }
}

function getArrayType(values: (number | [number, number])[]): ArrayType {
  if (Array.isArray(values) && values.length > 0) {
    const firstValue = values[0];
    if (typeof firstValue === 'number') {
      return ArrayType.SingleNumbers;
    } else if (Array.isArray(firstValue) && firstValue.length === 2) {
      if (
        typeof firstValue[0] === 'number' &&
        typeof firstValue[1] === 'number'
      ) {
        return ArrayType.NumberPairs;
      }
    }
  }

  return ArrayType.Unknown;
}
