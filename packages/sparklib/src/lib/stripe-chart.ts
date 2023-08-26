import * as d3Array from 'd3-array';

import { BaseChart } from './base-chart';
import { BaseChartProperties, NO_MARGINS, Range } from './models';
import { ArrayType, createGradientColorScale, getArrayType } from './utils';

export type StripeChartProperties = {
  baseChartProps: BaseChartProperties;
  gradientColors: string[];
  nGradientColorLevels: number;
  domain: Range | undefined;
};

type Properties = Omit<StripeChartProperties, 'baseChartProps'>;

export class StripeChart extends BaseChart {
  #props: Properties;
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

    if (props?.baseChartProps?.margins === undefined) {
      // default to no margins for the stripe chart
      this.margins(NO_MARGINS);
    }

    this.#props = { ...defaultProperties, ...props };
  }

  render(values: number[], canvas?: HTMLCanvasElement): HTMLCanvasElement {
    const context = super.renderChartBase(canvas);

    if (!values || values.length == 0) {
      return context.canvas;
    }

    if (getArrayType(values) !== ArrayType.SingleNumbers) {
      throw new Error('Invalid input format. Expected an array of numbers.');
    }

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
export const stripeChart = (props?: Partial<StripeChartProperties>) =>
  new StripeChart(props);
