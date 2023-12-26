import * as d3Array from 'd3-array';

import { BaseChart, ValueAccessor } from './base-chart';
import { BaseChartProperties, Range, StripeValueType } from './models';
import { ArrayType, createGradientColorScale, getArrayType } from './utils';

export type StripeChartProperties = {
  baseChartProps: BaseChartProperties;
  gradientColors: string[];
  nGradientColorLevels: number;
  domain: Range | undefined;
};

type Properties = Omit<StripeChartProperties, 'baseChartProps'>;

export class StripeChart<T = unknown> extends BaseChart {
  #props: Properties;
  #valueAccessor: ValueAccessor<T> = undefined;

  defaultColorScale: string[] = [
    '#ffffff',
    '#f0f0f0',
    '#d9d9d9',
    '#bdbdbd',
    '#969696',
    '#737373',
    '#525252',
    '#252525',
    '#000000',
  ];

  constructor(props?: Partial<StripeChartProperties>) {
    super(props?.baseChartProps);

    const defaultProperties: Properties = {
      gradientColors: this.defaultColorScale,
      nGradientColorLevels: this.defaultColorScale.length,
      domain: undefined,
    };

    this.#props = { ...defaultProperties, ...props };
  }

  render(
    inputValues: StripeValueType<T>[],
    canvas?: HTMLCanvasElement,
  ): HTMLCanvasElement {
    const context = super.renderChartBase(canvas);

    if (!inputValues || inputValues.length == 0) {
      return context.canvas;
    }

    const values = this.#getValues(inputValues);

    const stripeWidth =
      (this.chartProps.width -
        this.chartProps.margins.left -
        this.chartProps.margins.right) /
      values.length;

    const stripeHeight =
      this.chartProps.height -
      this.chartProps.margins.bottom -
      this.chartProps.margins.top;

    const gradientColorScale = createGradientColorScale(
      this.#getDomain(values),
      this.#props.gradientColors,
      this.#props.nGradientColorLevels,
    );

    values.forEach((value, i) => {
      context.beginPath();
      context.rect(
        i * stripeWidth + this.chartProps.margins.left,
        this.chartProps.margins.top,
        stripeWidth,
        stripeHeight,
      );
      context.fillStyle = gradientColorScale(value);
      context.fill();
      context.closePath();
    });

    return context.canvas;
  }

  gradientColors(colors: string[], numLevels?: number) {
    this.#props.gradientColors = colors;
    const n = Math.round(numLevels ?? colors.length);
    this.#props.nGradientColorLevels = n >= 1 ? n : 1;
    return this;
  }

  nGradientColorLevels(numLevels: number) {
    this.#props.nGradientColorLevels = numLevels >= 1 ? numLevels : 1;
    return this;
  }

  domain(domain: Range) {
    this.#props.domain = domain;
    return this;
  }

  valueAccessor(accessor: ValueAccessor<T>) {
    this.#valueAccessor = accessor;
    return this;
  }

  #getValues(inputValues: StripeValueType<T>[]): number[] {
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

  #getDomain(values: number[]): Range {
    if (this.#props.domain === undefined) {
      if (values.length === 1) {
        return [values[0], values[0]];
      }
      return d3Array.extent(values) as Range;
    } else {
      return this.#props.domain;
    }
  }
}

// factory function for the fluid API
export const stripeChart = <T = unknown>(
  props?: Partial<StripeChartProperties>,
) => new StripeChart<T>(props);
