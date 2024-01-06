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
  font?: string; // 'bold 12px Arial'
  fontColor?: string;
  ticks?: AxisTick[];
  tickLength?: number;
  tickWidth?: number;
  tickPadding?: number; // space between text label and tick mark
};

export type AxisChartProperties = {
  baseChartProps: BaseChartProperties;
  axisProps: AxisProperties;
};

export type AxisTick = {
  position: number; // position in pixels along the axis line, 0 being top left.
  label: string;
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
      font: '10px sans-serif',
      fontColor: 'black',
      ticks: [],
      tickLength: 6,
      tickWidth: 1,
      tickPadding: 5,
    };

    this.#props = {
      axisProps: props?.axisProps
        ? { ...defaultAxisProps, ...props.axisProps }
        : defaultAxisProps,
    };
  }

  font(font: string) {
    this.#props.axisProps.font = font;
    return this;
  }

  fontColor(fontColor: string) {
    this.#props.axisProps.fontColor = fontColor;
    return this;
  }

  lineWidth(lineWidth: number) {
    this.#props.axisProps.lineWidth = lineWidth;
    return this;
  }

  position(position: AxisPosition) {
    this.#props.axisProps.position = position;
    return this;
  }

  ticks(ticks: AxisTick[]) {
    this.#props.axisProps.ticks = ticks;
    return this;
  }

  tickLength(tickLength: number) {
    this.#props.axisProps.tickLength = tickLength;
    return this;
  }

  tickWidth(tickWidth: number) {
    this.#props.axisProps.tickWidth = tickWidth;
    return this;
  }

  tickPadding(tickPadding: number) {
    this.#props.axisProps.tickPadding = tickPadding;
    return this;
  }

  render(canvas?: HTMLCanvasElement): HTMLCanvasElement {
    const context = super.renderChartBase(canvas);

    context.font = this.#props.axisProps.font;
    context.lineWidth = this.#props.axisProps.lineWidth;
    context.fillStyle = this.#props.axisProps.fontColor;

    const textHeight = this.#getTextHeight(context);
    const isHorizontal =
      this.#props.axisProps.position === AxisPosition.Top ||
      this.#props.axisProps.position === AxisPosition.Bottom;

    if (isHorizontal) {
      Axis.#renderHorizontalAxis(
        this.#props.axisProps.position,
        context,
        this.chartProps.width,
        this.chartProps.height,
        this.#props.axisProps.lineWidth,
        this.#props.axisProps.position === AxisPosition.Bottom ? textHeight : 0,
        this.#props.axisProps.ticks ?? [],
        this.#props.axisProps.tickWidth,
        this.#props.axisProps.tickLength,
        this.#props.axisProps.tickPadding,
      );
    } else {
      Axis.#renderVerticalAxis(
        this.#props.axisProps.position,
        context,
        this.chartProps.width,
        this.chartProps.height,
        this.#props.axisProps.lineWidth,
        textHeight,
        this.#props.axisProps.ticks ?? [],
        this.#props.axisProps.tickWidth,
        this.#props.axisProps.tickLength,
        this.#props.axisProps.tickPadding,
      );
    }

    return context.canvas;
  }

  #getTextHeight(context: CanvasRenderingContext2D): number {
    const metrics = context.measureText('M');
    return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  }

  static #renderHorizontalAxis(
    axisPosition: AxisPosition,
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    lineWidth: number,
    textHeight: number,
    ticks: AxisTick[],
    tickWidth: number,
    tickLength: number,
    tickPadding: number,
  ) {
    const isTopAxis = axisPosition === AxisPosition.Top;
    const axisLineY = isTopAxis ? height - lineWidth / 2 : lineWidth / 2;

    context.beginPath();
    context.moveTo(0, axisLineY);
    context.lineTo(width, axisLineY);

    ticks.forEach((tick) => {
      let tickPosition = tick.position;

      // Adjust for edge cases
      if (tickPosition === 0) {
        tickPosition += tickWidth;
      } else if (tick.position === width) {
        tickPosition -= tickWidth;
      }

      context.moveTo(tickPosition, axisLineY);
      context.lineTo(
        tickPosition,
        axisLineY + (isTopAxis ? -1 : 1) * tickLength,
      );

      if (tick.label) {
        const labelYPosition =
          axisLineY +
          (isTopAxis
            ? -(tickLength + tickPadding)
            : tickLength + (textHeight ?? 0) + tickPadding);
        context.textAlign = 'center';
        context.fillText(tick.label, tickPosition, labelYPosition);
      }
    });

    context.stroke();
    context.closePath();
  }

  static #renderVerticalAxis(
    axisPosition: AxisPosition,
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    lineWidth: number,
    textHeight: number,
    ticks: AxisTick[],
    tickWidth: number,
    tickLength: number,
    tickPadding: number,
  ) {
    const isLeftAxis = axisPosition === AxisPosition.Left;
    const x = isLeftAxis ? width - lineWidth / 2 : lineWidth / 2;

    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);

    ticks.forEach((tick) => {
      let y = tick.position;

      // Adjust for edge cases
      if (y === 0) {
        y += tickWidth;
      } else if (tick.position === height) {
        y -= tickWidth;
      }

      context.moveTo(x, y);
      context.lineTo(x + (isLeftAxis ? -1 : 1) * tickLength, y);

      if (tick.label) {
        const labelXPosition =
          x +
          (isLeftAxis
            ? -(
                lineWidth +
                tickLength +
                context.measureText(tick.label).width +
                tickPadding
              )
            : tickLength + tickPadding);
        const labelYPosition =
          y + textHeight / 2 - (isLeftAxis ? lineWidth / 2 : 0);
        context.textAlign = 'left';
        context.fillText(tick.label, labelXPosition, labelYPosition);
      }
    });

    context.stroke();
    context.closePath();
  }
}

// factory functions for the fluid API
export const axis = (props?: Partial<AxisChartProperties>) => new Axis(props);
