import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';

import { BaseChart } from './base-chart';
import { ChartProperties, NO_MARGINS } from './base-chart-models';
import { Range } from './models';
import { ArrayType, getArrayType } from './utils';

export type StripeChartProperties = {
  chartProps: ChartProperties;
  colorScale?: string[];
  domain?: Range | undefined;
};

type Properties = Omit<StripeChartProperties, 'chartProps'>;

export class StripeChart extends BaseChart {
  #props: Properties;

  constructor(props?: Partial<StripeChartProperties>) {
    super(props?.chartProps);

    if (props?.chartProps?.margins === undefined) {
      // default to no margins for the stripe chart
      this.margins(NO_MARGINS);
    }

    this.#props = { domain: props?.domain };
  }

  render(values: number[]): HTMLCanvasElement {
    const context = super.renderChartBase();

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

    const colorScale = d3Scale
      .scaleQuantize<string>()
      .domain(this.#getDomain(values))
      .range(this.#getColorScale());

    values.forEach((value, i) => {
      context.beginPath();
      context.rect(
        i * stripeWidth + this.chartProps.margins.left,
        this.chartProps.margins.top,
        stripeWidth,
        stripeHeight,
      );
      context.fillStyle = colorScale(value);
      context.fill();
      context.closePath();
    });

    return context.canvas;
  }

  colorScale(colorScale: string[]) {
    this.#props.colorScale = colorScale;
    return this;
  }

  domain(domain: Range) {
    this.#props.domain = domain;
    return this;
  }

  #getColorScale(): string[] {
    return (
      this.#props.colorScale ?? [
        '#ffffff',
        '#f0f0f0',
        '#d9d9d9',
        '#bdbdbd',
        '#969696',
        '#737373',
        '#525252',
        '#252525',
        '#000000',
      ]
    );
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
