import { BaseChart, ValueAccessor } from './base-chart';
import {
  BaseChartProperties,
  ChartMouseEventListener,
  MouseEventType,
  Range,
  BarValueType,
} from './models';
import { ArrayType, createGradientColorScale, getArrayType } from './utils';
import { CanvasMouseHandler } from './utils/canvas-mouse-handler';

export type BarChartProperties = {
  baseChartProps: BaseChartProperties;
  domain: Range | undefined;
};

type Properties = Omit<BarChartProperties, 'baseChartProps'>;

export class BarChart<T = unknown> extends BaseChart {
  #props: Properties;
  #valueAccessor: ValueAccessor<T> = undefined;
  #mouseHandler?: CanvasMouseHandler;

  constructor(props?: Partial<BarChartProperties>) {
    super(props?.baseChartProps);

    const defaultProperties: Properties = {
      domain: undefined,
    };

    this.#props = { ...defaultProperties, ...props };
  }

  render(
    inputValues: BarValueType<T>[],
    canvas?: HTMLCanvasElement,
  ): HTMLCanvasElement {
    const context = super.renderChartBase(canvas);

    return context.canvas;
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
}

// factory function for the fluid API
export const barChart = <T = unknown>(props?: Partial<BarChartProperties>) =>
  new BarChart<T>(props);
