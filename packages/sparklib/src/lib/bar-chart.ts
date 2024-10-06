import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';

import { ValueAccessor } from './base-chart';
import {
  ChartMouseEventListener,
  MouseEventType,
  Range,
  BarValueType,
  LinearGradient,
} from './models';
import { ArrayType, getArrayType } from './utils';
import { CanvasMouseHandler } from './utils/canvas-mouse-handler';
import { YDatumBaseChart } from './datum-base-chart';
import { YDatumBaseChartProperties } from './models/datum-base-chart-properties';
import { BarChartProperties } from './models/bar-chart-properties';
import { LinearGradientBuilder } from './builders/linear-gradient-builder';

type Properties = Omit<
  Omit<BarChartProperties, keyof YDatumBaseChartProperties>,
  'fillStyle'
> & {
  fillStyle: string | LinearGradient | LinearGradientBuilder;
};

type ChartScaling = {
  yDomain: Range;
  yScale: d3Scale.ScaleLinear<number, number, never>;
};

export class BarChart<T = unknown> extends YDatumBaseChart {
  #props: Properties;
  #valueAccessor: ValueAccessor<T> = undefined;
  #mouseHandler?: CanvasMouseHandler;

  constructor(props?: Partial<BarChartProperties>) {
    super(props);

    const defaultProperties: Properties = {
      fillStyle: 'black',
      domain: undefined,
    };

    this.#props = { ...defaultProperties, ...props };
  }

  barWidth(barWidth: number) {
    this.#props.barWidth = barWidth;
    return this;
  }

  barPadding(barPadding: number) {
    this.#props.barPadding = barPadding;
    return this;
  }

  fillStyle(fillStyle: string | LinearGradient | LinearGradientBuilder) {
    this.#props.fillStyle = fillStyle;
    return this;
  }

  render(
    inputValues: BarValueType<T>[],
    canvas?: HTMLCanvasElement,
  ): HTMLCanvasElement {
    const context = super.renderChartBase(canvas);

    if (!inputValues || inputValues.length == 0) {
      return context.canvas;
    }
    const values = this.#getValues(inputValues);
    const scales = this.#getScales(values);

    // datum lines with zIndex 0 are drawn below the chart data
    super.renderHorizontalDatumLines(
      context,
      true,
      scales.yDomain,
      scales.yScale,
    );

    this.#drawBars(values, scales, this.#props.fillStyle, context);

    // datum lines with zIndex > 0 are drawn above the chart data
    super.renderHorizontalDatumLines(
      context,
      false,
      scales.yDomain,
      scales.yScale,
    );

    this.#mouseHandler?.setCanvas(context.canvas).setValueLength(values.length);

    return context.canvas;
  }

  #drawBars(
    values: number[],
    scales: ChartScaling,
    fillStyle: string | LinearGradient | LinearGradientBuilder,
    context: CanvasRenderingContext2D,
  ) {
    const usedFillStyle = this.getFillStyle(fillStyle, context);

    const availableWidth =
      this.chartProps.width -
      this.chartProps.margins.left -
      this.chartProps.margins.right;

    const barPadding =
      values.length < 1
        ? 0 // no padding if only 1 bar
        : (this.#props.barPadding ??
          // if no padding is set, default to 2% of available width
          (values.length > 1 ? (0.2 * availableWidth) / values.length : 0));

    const barWidth =
      this.#props.barWidth ??
      (availableWidth - barPadding * values.length) / values.length;

    values.forEach((value, i) => {
      if (value) {
        context.beginPath();

        const xPos =
          i * barWidth + i * barPadding + this.chartProps.margins.left;
        const yPos = scales.yScale(this.chartProps.margins.top);
        const barHeight =
          scales.yScale(value) - scales.yScale(this.chartProps.margins.top);

        context.rect(xPos, yPos, barWidth, barHeight);
        context.rect(
          i * barWidth + i * barPadding + this.chartProps.margins.left,
          scales.yScale(this.chartProps.margins.top),
          barWidth,
          scales.yScale(value) - scales.yScale(this.chartProps.margins.top),
        );
        context.fillStyle = usedFillStyle;
        context.fill();
        context.closePath();
      }
    });
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

  #getValues(inputValues: BarValueType<T>[]): number[] {
    const arrayType = getArrayType(inputValues);

    if (arrayType === ArrayType.ObjectValue) {
      // Convert an Object array into a SingleValue array.
      if (this.#valueAccessor === undefined) {
        throw new Error('The valueAccessor is not initialized.');
      }

      return inputValues.map((v) => this.#valueAccessor?.(v as T)) as number[];
    }

    if (arrayType !== ArrayType.SingleValue) {
      throw new Error(
        'Invalid input format. Expected an array of numbers or objects with an accessor.',
      );
    }

    return inputValues as number[];
  }

  #getYDomain(values: number[]): Range {
    if (this.#props.domain === undefined) {
      if (values.length === 1) {
        return [Math.min(0, d3Array.min(values) ?? 0), values[0]];
      }
      return [
        Math.min(0, d3Array.min(values) ?? 0),
        d3Array.max(values),
      ] as Range;
    } else {
      return this.#props.domain;
    }
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

  #getScales(values: number[]): ChartScaling {
    const yDomain = this.#getYDomain(values);
    const yScale = this.#yScale(yDomain);

    return { yDomain, yScale };
  }
}

// factory function for the fluid API
export const barChart = <T = unknown>(props?: Partial<BarChartProperties>) =>
  new BarChart<T>(props);
