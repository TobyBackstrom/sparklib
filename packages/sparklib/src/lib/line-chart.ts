import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

import { BaseChart } from './base-chart';
import {
  DatumLineBuilder,
  LinearGradient,
  LinearGradientBuilder,
  Range,
} from './models';
import { LineProperties } from './models/line-properties';
import { DatumLine } from './models/datum-line';
import { Coordinate } from './models';
import { ArrayType, getArrayType } from './utils';
import { LineChartProperties } from './line-chart-models';

// LineChart props only (BaseChart excluded), with required lineProps.
type Properties = {
  lineProps: Required<LineProperties>;
} & Omit<LineChartProperties, 'chartProps'>;

export class LineChart extends BaseChart {
  #props: Properties;

  constructor(props?: Partial<LineChartProperties>) {
    super(props?.chartProps);

    const defaultLineProps: Required<LineProperties> = {
      strokeStyle: 'black',
      lineDash: [],
      lineWidth: 1,
    };

    this.#props = {
      lineProps: props?.lineProps
        ? { ...defaultLineProps, ...props.lineProps }
        : defaultLineProps,

      fillStyle: props?.fillStyle,

      xDatumLines: [...(props?.xDatumLines || [])],
      yDatumLines: [...(props?.yDatumLines || [])],

      xDomain: props?.xDomain,
      yDomain: props?.yDomain,
    };
  }

  render(values: (number | [number, number])[]): HTMLCanvasElement {
    const context = super.renderChartBase();

    if (!values || values.length < 2) {
      // This is a line chart, remember? It requires at least a pair of coordinates.
      // Instead of throwing an error just return the empty canvas.
      return context.canvas;
    }

    const arrayType = getArrayType({ values });

    const xDomain = this.#getXDomain(values, arrayType);
    const yDomain = this.#getYDomain(values, arrayType);

    const xScale = this.#xScale(xDomain);
    const yScale = this.#yScale(yDomain);

    this.#props.xDatumLines.forEach((datumLine) =>
      this.#drawDatumLine('x', datumLine, yDomain, xScale, yScale, context)
    );

    this.#props.yDatumLines.forEach((datumLine) =>
      this.#drawDatumLine('y', datumLine, xDomain, xScale, yScale, context)
    );

    const scaledCoordinates = this.#scaleCoordinates(
      values,
      arrayType,
      xScale,
      yScale
    );

    if (this.#props.fillStyle) {
      this.#drawArea(
        scaledCoordinates,
        yScale(0),
        this.#props.fillStyle,
        context
      );
    }

    if (this.#props.lineProps.lineWidth !== 0) {
      this.#drawPath(scaledCoordinates, this.#props.lineProps, context);
    }

    return context.canvas;
  }

  strokeStyle(strokeStyle: string | LinearGradient | LinearGradientBuilder) {
    this.#props.lineProps.strokeStyle = strokeStyle;
    return this;
  }

  fillStyle(
    fillStyle?: string | LinearGradient | LinearGradientBuilder | null
  ) {
    this.#props.fillStyle = fillStyle ?? undefined;
    return this;
  }

  lineDash(lineDash: number[]) {
    this.#props.lineProps.lineDash = lineDash;
    return this;
  }

  lineWidth(lineWidth: number) {
    this.#props.lineProps.lineWidth = lineWidth;
    return this;
  }

  // minX - maxX
  xDomain(xDomain: Range) {
    this.#props.xDomain = xDomain;
    return this;
  }

  // minY - maxY
  yDomain(yDomain: Range) {
    this.#props.yDomain = yDomain;
    return this;
  }

  // add a vertical reference line in the x domain
  xDatum(
    xPositionOrDatumLineBuilder: number | DatumLineBuilder,
    lineProps?: LineProperties
  ): LineChart {
    if (typeof xPositionOrDatumLineBuilder === 'number') {
      this.#datum(
        this.#props.xDatumLines,
        xPositionOrDatumLineBuilder,
        lineProps
      );
    } else {
      const datumLine = xPositionOrDatumLineBuilder.build();
      this.#datum(
        this.#props.xDatumLines,
        datumLine.position,
        datumLine.lineProperties
      );
    }

    return this;
  }

  xDatumLines(datumLines: DatumLine[]) {
    this.#props.xDatumLines.push(...datumLines);
    return this;
  }

  // add a horizontal reference line in the y domain
  yDatum(
    yPositionOrDatumLineBuilder: number | DatumLineBuilder,
    lineProps?: LineProperties
  ) {
    if (typeof yPositionOrDatumLineBuilder === 'number') {
      this.#datum(
        this.#props.yDatumLines,
        yPositionOrDatumLineBuilder,
        lineProps
      );
    } else {
      const datumLine = yPositionOrDatumLineBuilder.build();
      this.#datum(
        this.#props.yDatumLines,
        datumLine.position,
        datumLine.lineProperties
      );
    }

    return this;
  }

  yDatumLines(datumLines: DatumLine[]) {
    this.#props.yDatumLines.push(...datumLines);
    return this;
  }

  #getXDomain(
    values: (number | [number, number])[],
    arrayType: ArrayType
  ): Range {
    return (
      this.#props.xDomain ??
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
      this.#props.yDomain ??
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
        this.chartProps.margins.left,
        this.chartProps.width - this.chartProps.margins.right,
      ]);
  }

  #yScale(yDomain: Range): d3Scale.ScaleLinear<number, number, never> {
    return d3Scale
      .scaleLinear()
      .domain(yDomain)
      .range([
        this.chartProps.height - this.chartProps.margins.bottom,
        this.chartProps.margins.top,
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
            [xScale(datumLine.position), yScale(domain[0])],
            [xScale(datumLine.position), yScale(domain[1])],
          ]
        : [
            [xScale(domain[0]), yScale(datumLine.position)],
            [xScale(domain[1]), yScale(datumLine.position)],
          ];

    this.#drawPath(scaledCoordinates, datumLine.lineProperties, context);
  }

  #drawArea(
    coordinates: Coordinate[],
    y0: number,
    fillStyle: string | LinearGradient | LinearGradientBuilder,
    context: CanvasRenderingContext2D
  ) {
    const usedFillStyle = this.getFillStyle(fillStyle, context);

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
    const strokeStyle = this.getFillStyle(lineProperties.strokeStyle, context);

    context.beginPath();

    d3Shape
      .line<Coordinate>()
      .defined((coordinate) => coordinate[1] != null)
      .x((coordinate) => coordinate[0])
      .y((coordinate) => coordinate[1])
      .context(context)(coordinates);

    context.strokeStyle = strokeStyle;
    context.lineCap = 'round';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.setLineDash(lineProperties.lineDash!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.lineWidth = lineProperties.lineWidth!;
    context.stroke();
    context.closePath();
  }
}

// factory function for the fluid API
export const lineChart = (props?: Partial<LineChartProperties>) =>
  new LineChart(props);
