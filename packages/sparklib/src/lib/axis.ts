import { BaseChart } from './base-chart';
import { BaseChartProperties } from './models';

export enum AxisPosition {
  Left = 'Left',
  Right = 'Right',
  Top = 'Top',
  Bottom = 'Bottom',
}

export type AxisProperties = {
  position?: AxisPosition;
  lineWidth?: number;
  fontSize?: string;
  fontFamily?: string;
};

export type AxisChartProperties = {
  baseChartProps: BaseChartProperties;
  axisProps: AxisProperties;
};

type Properties = {
  axisProps: Required<AxisProperties>;
} & Omit<AxisChartProperties, 'baseChartProps'>;

export class Axis extends BaseChart {
  #props: Properties;

  constructor(props?: Partial<AxisChartProperties>) {
    super(props?.baseChartProps);

    const defaultAxisProps: Required<AxisProperties> = {
      position: AxisPosition.Bottom,
      lineWidth: 1,
      fontSize: '10px',
      fontFamily: 'sans-serif',
    };

    this.#props = {
      axisProps: props?.axisProps
        ? { ...defaultAxisProps, ...props.axisProps }
        : defaultAxisProps,
    };
  }

  render(ticks: number[], canvas?: HTMLCanvasElement): HTMLCanvasElement {
    const context = super.renderChartBase(canvas);
    context.font = `${this.#props.axisProps.fontSize} ${
      this.#props.axisProps.fontFamily
    }`;

    const width = this.chartProps.width;
    const height = this.chartProps.height;
    const isBottom = this.#props.axisProps.position === AxisPosition.Bottom;
    const isTop = this.#props.axisProps.position === AxisPosition.Top;
    const isLeft = this.#props.axisProps.position === AxisPosition.Left;
    const isRight = this.#props.axisProps.position === AxisPosition.Right;
    const lineWidth = this.#props.axisProps.lineWidth;

    context.beginPath();
    context.lineWidth = lineWidth;

    if (isTop) {
      const y = height - lineWidth / 2;
      context.moveTo(0, y);
      context.lineTo(width, y);
    }

    if (isBottom) {
      const y = lineWidth / 2;
      context.moveTo(0, y);
      context.lineTo(width, y);
    }

    if (isRight) {
      const x = lineWidth / 2;
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }

    if (isLeft) {
      const x = width - lineWidth / 2;
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }

    context.stroke();
    context.closePath();

    return context.canvas;
  }

  fontSize(fontSize: string) {
    this.#props.axisProps.fontSize = fontSize;
    return this;
  }

  fontFamily(fontFamily: string) {
    this.#props.axisProps.fontFamily = fontFamily;
    return this;
  }

  lineWidth(lineWidth: number) {
    this.#props.axisProps.lineWidth = lineWidth;
    return this;
  }
}

// factory functions for the fluid API
export const axis = (props?: Partial<AxisChartProperties>) => new Axis(props);

export const axisLeft = (props?: Partial<AxisChartProperties>) =>
  new Axis({
    ...props,
    axisProps: {
      ...props?.axisProps,
      position: AxisPosition.Left,
    },
  });

export const axisRight = (props?: Partial<AxisChartProperties>) =>
  new Axis({
    ...props,
    axisProps: {
      ...props?.axisProps,
      position: AxisPosition.Right,
    },
  });

export const axisTop = (props?: Partial<AxisChartProperties>) =>
  new Axis({
    ...props,
    axisProps: {
      ...props?.axisProps,
      position: AxisPosition.Top,
    },
  });

export const axisBottom = (props?: Partial<AxisChartProperties>) =>
  new Axis({
    ...props,
    axisProps: {
      ...props?.axisProps,
      position: AxisPosition.Bottom,
    },
  });
