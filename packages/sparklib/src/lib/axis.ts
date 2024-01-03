import { BaseChart } from './base-chart';
import { BaseChartProperties } from './models';

export type AxisProperties = {
  baseChartProps: BaseChartProperties;
};
type Properties = Omit<AxisProperties, 'baseChartProps'>;

export class Axis extends BaseChart {
  #props: Properties;

  constructor(props?: Partial<AxisProperties>) {
    super(props?.baseChartProps);

    const defaultProperties: Properties = {};

    this.#props = { ...defaultProperties, ...props };
  }

  render(ticks: number[], canvas?: HTMLCanvasElement): HTMLCanvasElement {
    const context = super.renderChartBase(canvas);

    return context.canvas;
  }
}

// factory function for the fluid API
export const axis = (props?: Partial<AxisProperties>) => new Axis(props);
