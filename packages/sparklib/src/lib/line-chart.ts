import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

import { BaseChart, ValueAccessor } from './base-chart';
import { DatumLineBuilder, LinearGradientBuilder } from './builders';
import {
  Coordinate,
  LineChartProperties,
  LinearGradient,
  Range,
  LineValueType,
  BasicLineValueType,
  ChartMouseEventListener,
  MouseEventType,
} from './models';
import { DatumLine } from './models/datum-line';
import { LineProperties } from './models/line-properties';
import { ArrayType, getArrayType } from './utils';
import { CanvasMouseHandler } from './utils/canvas-mouse-handler';

// LineChart props only (BaseChart excluded), with required lineProps.
type Properties = {
  lineProps: Required<LineProperties>;
} & Omit<LineChartProperties, 'baseChartProps'>;

type ChartScales = {
  xDomain: Range;
  yDomain: Range;

  xScale: d3Scale.ScaleLinear<number, number, never>;
  yScale: d3Scale.ScaleLinear<number, number, never>;
};

export class LineChart<T = unknown> extends BaseChart {
  #props: Properties;
  #scales?: ChartScales;
  #arrayType: ArrayType = ArrayType.Unknown;
  #xAccessor: ValueAccessor<T> = undefined;
  #yAccessor: ValueAccessor<T> = undefined;
  #mouseHandler?: CanvasMouseHandler;

  constructor(props?: Partial<LineChartProperties>) {
    super(props?.baseChartProps);

    const defaultLineProps: Required<LineProperties> = {
      strokeStyle: 'black',
      lineDash: [],
      lineWidth: 1,
    };

    this.#props = {
      lineProps: { ...defaultLineProps, ...props?.lineProps },

      fillStyle: props?.fillStyle,

      xDatumLines: [...(props?.xDatumLines || [])],
      yDatumLines: [...(props?.yDatumLines || [])],

      xDomain: props?.xDomain,
      yDomain: props?.yDomain,
    };
  }

  getDomainCoordinate(pixelX: number, pixelY: number): [number, number] {
    return [
      this.scales.xScale.invert(pixelX),
      this.scales.yScale.invert(pixelY),
    ];
  }

  getPixelCoordinate(domainX: number, domainY: number): [number, number] {
    return [this.scales.xScale(domainX), this.scales.yScale(domainY)];
  }

  render(
    inputValues: LineValueType<T>[],
    canvas?: HTMLCanvasElement,
  ): HTMLCanvasElement {
    const context = super.renderChartBase(canvas);

    if (!inputValues || inputValues.length < 2) {
      // This is a line chart and it requires at least a pair of coordinates.
      // Instead of throwing an error just return the empty canvas.
      return context.canvas;
    }

    const values = this.#getValues(inputValues);
    this.#setScales(values);

    const xDatumLinesWithZIndex: DatumLine[] = [];
    const yDatumLinesWithZIndex: DatumLine[] = [];

    // TODO: refactor datum lines to separate method
    this.#props.xDatumLines.forEach((datumLine) => {
      if (datumLine.zIndex === 0) {
        this.#drawDatumLine(
          'x',
          datumLine,
          this.scales,
          this.scales.yDomain,
          context,
        );
      } else {
        xDatumLinesWithZIndex.push(datumLine);
      }
    });

    // TODO: refactor datum lines to separate method
    this.#props.yDatumLines.forEach((datumLine) => {
      if (datumLine.zIndex === 0) {
        this.#drawDatumLine(
          'y',
          datumLine,
          this.scales,
          this.scales.xDomain,
          context,
        );
      } else {
        yDatumLinesWithZIndex.push(datumLine);
      }
    });

    const scaledCoordinates = this.#scaleCoordinates(
      values,
      this.#arrayType,
      this.scales,
    );

    if (this.#props.fillStyle) {
      this.#drawArea(
        scaledCoordinates,
        this.scales.yScale(0),
        this.#props.fillStyle,
        context,
      );
    }

    if (this.#props.lineProps.lineWidth !== 0) {
      this.#drawPath(scaledCoordinates, this.#props.lineProps, context);
    }

    // TODO: refactor datum lines to separate method
    xDatumLinesWithZIndex.forEach((datumLine) =>
      this.#drawDatumLine(
        'x',
        datumLine,
        this.scales,
        this.scales.yDomain,
        context,
      ),
    );

    // TODO: refactor datum lines to separate method
    yDatumLinesWithZIndex.forEach((datumLine) =>
      this.#drawDatumLine(
        'y',
        datumLine,
        this.scales,
        this.scales.xDomain,
        context,
      ),
    );

    this.#mouseHandler?.setCanvas(context.canvas).setValueLength(values.length);

    return context.canvas;
  }

  strokeStyle(strokeStyle: string | LinearGradient | LinearGradientBuilder) {
    this.#props.lineProps.strokeStyle = strokeStyle;
    return this;
  }

  fillStyle(
    fillStyle?: string | LinearGradient | LinearGradientBuilder | null,
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

  xAccessor(accessor: ValueAccessor<T>) {
    this.#xAccessor = accessor;
    return this;
  }

  yAccessor(accessor: ValueAccessor<T>) {
    this.#yAccessor = accessor;
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
    lineProps?: LineProperties,
    zIndex?: number,
  ): LineChart<T> {
    if (typeof xPositionOrDatumLineBuilder === 'number') {
      this.#datum(
        this.#props.xDatumLines,
        xPositionOrDatumLineBuilder,
        lineProps,
        zIndex,
      );
    } else {
      const datumLine = xPositionOrDatumLineBuilder.build();
      this.#datum(
        this.#props.xDatumLines,
        datumLine.position,
        datumLine.lineProperties,
        datumLine.zIndex,
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
    lineProps?: LineProperties,
    zIndex?: number,
  ) {
    if (typeof yPositionOrDatumLineBuilder === 'number') {
      this.#datum(
        this.#props.yDatumLines,
        yPositionOrDatumLineBuilder,
        lineProps,
        zIndex,
      );
    } else {
      const datumLine = yPositionOrDatumLineBuilder.build();
      this.#datum(
        this.#props.yDatumLines,
        datumLine.position,
        datumLine.lineProperties,
        datumLine.zIndex,
      );
    }

    return this;
  }

  yDatumLines(datumLines: DatumLine[]) {
    this.#props.yDatumLines.push(...datumLines);
    return this;
  }

  mouseEventListener(
    eventType: MouseEventType | MouseEventType[],
    eventListener: ChartMouseEventListener | null,
  ) {
    if (!this.#mouseHandler) {
      this.#mouseHandler = new CanvasMouseHandler();
    }

    if (eventListener) {
      this.#mouseHandler.addEventListener(eventType, eventListener);
    } else {
      this.#mouseHandler.removeEventListener(eventType);
    }

    return this;
  }

  dispose() {
    this.#mouseHandler?.dispose();
    this.#mouseHandler = undefined;
  }

  private get scales(): ChartScales {
    if (!this.#scales) {
      throw new Error('ChartScales are not initialized.');
    }
    return this.#scales;
  }

  #getValues(inputValues: LineValueType<T>[]): Array<BasicLineValueType> {
    const arrayType = getArrayType(inputValues);

    if (arrayType === ArrayType.ObjectValue) {
      // Convert an Object array into a SingleValue or TupleValue array
      // depending on what accessors are set.
      if (this.#yAccessor === undefined) {
        throw new Error('The yAccessor is not initialized.');
      }

      if (this.#xAccessor) {
        // Both xAccessor and yAccessor are set
        this.#arrayType = ArrayType.TupleValue;
        return inputValues.map((v) => [
          this.#xAccessor?.(v as T),
          this.#yAccessor?.(v as T),
        ]) as Array<[number, number | null]>;
      } else {
        // Only yAccessor is set, array index will be used for X values.
        this.#arrayType = ArrayType.SingleValue;
        return inputValues.map((v) => this.#yAccessor?.(v as T)) as Array<
          number | null
        >;
      }
    }

    this.#arrayType = arrayType;
    return inputValues as Array<number | null | [number, number | null]>;
  }

  #getXDomain(values: BasicLineValueType[], arrayType: ArrayType): Range {
    return (
      this.#props.xDomain ??
      ((arrayType === ArrayType.SingleValue
        ? [0, values.length - 1] // index in array defines the x domain
        : d3Array.extent(values as [number, number][], (d) => d[0])) as Range)
    );
  }

  #getYDomain(values: BasicLineValueType[], arrayType: ArrayType): Range {
    return (
      this.#props.yDomain ??
      ((arrayType === ArrayType.SingleValue
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

  #setScales(values: BasicLineValueType[]) {
    const xDomain = this.#getXDomain(values, this.#arrayType);
    const yDomain = this.#getYDomain(values, this.#arrayType);

    const xScale = this.#xScale(xDomain);
    const yScale = this.#yScale(yDomain);

    this.#scales = {
      xDomain,
      yDomain,
      xScale,
      yScale,
    };
  }

  #scaleCoordinates(
    values: BasicLineValueType[],
    arrayType: ArrayType,
    scales: ChartScales,
  ): Coordinate[] {
    return values.map((value, index) => {
      const x =
        arrayType === ArrayType.SingleValue
          ? index
          : (value as [number, number])[0];
      const y =
        arrayType === ArrayType.SingleValue
          ? (value as number)
          : (value as [number, number])[1];
      return [scales.xScale(x as number), scales.yScale(y)];
    });
  }

  #datum(
    datumLines: DatumLine[],
    position: number,
    datumLineProps?: LineProperties,
    zIndex?: number,
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

    datumLines.push({ position, lineProperties, zIndex });
  }

  #drawDatumLine(
    axis: 'x' | 'y',
    datumLine: DatumLine,
    scales: ChartScales,
    domain: Range,
    context: CanvasRenderingContext2D,
  ) {
    const scaledCoordinates: Coordinate[] =
      axis === 'x'
        ? [
            [scales.xScale(datumLine.position), scales.yScale(domain[0])],
            [scales.xScale(datumLine.position), scales.yScale(domain[1])],
          ]
        : [
            [scales.xScale(domain[0]), scales.yScale(datumLine.position)],
            [scales.xScale(domain[1]), scales.yScale(datumLine.position)],
          ];

    this.#drawPath(scaledCoordinates, datumLine.lineProperties, context);
  }

  #drawArea(
    coordinates: Coordinate[],
    y0: number,
    fillStyle: string | LinearGradient | LinearGradientBuilder,
    context: CanvasRenderingContext2D,
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
    context: CanvasRenderingContext2D,
  ) {
    const strokeStyle = this.getFillStyle(lineProperties.strokeStyle, context);
    const lineWidthOffset = lineProperties.lineWidth === 1 ? 0.5 : 0; // offset to avoid anti-aliasing widening the line

    context.beginPath();

    d3Shape
      .line<Coordinate>()
      .defined((coordinate) => coordinate[1] != null)
      .x((coordinate) => coordinate[0] + lineWidthOffset)
      .y((coordinate) => coordinate[1] + lineWidthOffset)
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
export const lineChart = <T = unknown>(props?: Partial<LineChartProperties>) =>
  new LineChart<T>(props);
