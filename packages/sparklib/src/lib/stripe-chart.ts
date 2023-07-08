import * as d3Array from 'd3-array';

import { BaseChart } from './base-chart';
import { ChartProperties } from './base-chart-models';
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

    if (this.#props.domain === undefined) {
      this.#props.domain = d3Array.extent(values) as Range;
    }

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
