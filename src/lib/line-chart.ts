import * as d3Array from 'd3-array';
import * as d3Color from 'd3-color';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

import { ChartBase, ChartProperties } from './chart-base';

export type Coordinate = [number, number];
export type Range = [number, number];

export interface AreaProperties {
  fillStyle?: string | CanvasGradient; // default: "black with opacity 0.3"
}

export interface LineProperties {
  strokeStyle?: string | CanvasGradient; // default: "black"
  lineWidth?: number; // default: 1
  lineDash?: number[]; // default: [], https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
}

export interface DatumLine {
  position: number; // x or y, default: 0
  lineProperties: LineProperties;
}

export interface SparklineParameters {
  lineProps?: LineProperties;
  chartProps?: ChartProperties;
}

export class LineChart extends ChartBase {
  #lineProps: LineProperties | undefined = undefined;
  #xDatumLines: DatumLine[] = [];
  #yDatumLines: DatumLine[] = [];

  #xDomain: Range | undefined;
  #yDomain: Range | undefined;

  constructor(params?: SparklineParameters) {
    super(params?.chartProps);

    const defaultLineProps: LineProperties = {
      strokeStyle: 'black',
      lineDash: [],
      lineWidth: 1,
    };

    this.#lineProps = params?.lineProps
      ? { ...defaultLineProps, ...params.lineProps }
      : defaultLineProps;
  }

  render(values: number[], tmp: [number, number][]): HTMLCanvasElement {
    const context = super.renderChartBase();

    const xScale = d3Scale
      .scaleLinear()
      .domain(this.#xDomain ?? [0, values.length - 1])
      .range([
        this.marginsProps.left,
        this.chartProps.width! - this.marginsProps.right,
      ]);

    this.#yDomain =
      this.#yDomain ?? (d3Array.extent(values) as [number, number]);
    const yScale = d3Scale
      .scaleLinear()
      .domain(this.#yDomain)
      .range([
        this.chartProps.height! - this.marginsProps.top,
        this.marginsProps.bottom,
      ]);

    this.#xDatumLines.forEach((datumLine) =>
      this.#drawLine(
        [yScale(datumLine.position ?? 0), xScale(this.#yDomain![0])],
        [yScale(datumLine.position ?? 0), xScale(this.#yDomain![1])],
        datumLine.lineProperties,
        context
      )
    );

    this.#yDatumLines.forEach((datumLine) =>
      this.#drawLine(
        [xScale(0), yScale(datumLine.position ?? 0)],
        [xScale(values.length - 1), yScale(datumLine.position ?? 0)],
        datumLine.lineProperties,
        context
      )
    );

    const scaledValues = values.map(
      (v, i) => [xScale(i), yScale(v)] as Coordinate
    );

    if (this.#lineProps) {
      this.#drawPath(scaledValues, this.#lineProps, context);
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
    } as LineProperties;

    datumLines.push({ position, lineProperties });
  }

  #drawLine(
    from: Coordinate,
    to: Coordinate,
    lineProperties: LineProperties,
    context: CanvasRenderingContext2D
  ) {
    context.beginPath();

    context.moveTo(from[0], from[1]);
    context.lineTo(to[0], to[1]);

    context.strokeStyle = lineProperties.strokeStyle!;
    context.setLineDash(lineProperties.lineDash!);
    context.lineWidth = lineProperties.lineWidth!;

    context.stroke();
    context.closePath();
  }

  #drawPath(
    coordinates: Coordinate[],
    lineProperties: LineProperties,
    context: CanvasRenderingContext2D
  ) {
    context.beginPath();

    d3Shape
      .line<Coordinate>()
      .x((coordinate) => coordinate[0])
      .y((coordinate) => coordinate[1])
      .context(context)(coordinates);

    context.strokeStyle = lineProperties.strokeStyle!;
    context.setLineDash(lineProperties.lineDash!);
    context.lineWidth = lineProperties.lineWidth!;

    context.stroke();
    context.closePath();
  }
}

function getAreaFillstyle(
  area: AreaProperties,
  fallback: LineProperties
): string | CanvasGradient | CanvasPattern {
  if (area?.fillStyle) {
    return area.fillStyle!;
  }

  if (
    typeof fallback?.strokeStyle === 'string' ||
    fallback?.strokeStyle == null
  ) {
    const fillStyle = fallback?.strokeStyle || 'black';
    const color = d3Color.color(fillStyle)?.copy({ opacity: 0.3 });
    return color!.formatHex8();
  }

  return area.fillStyle!;
}

function is2DArray(array: any[]): boolean {
  return array.every((element) => Array.isArray(element));
}
