import { BaseChart } from './base/base-chart';
import { LinearGradientBuilder } from './builders';
import { BaseChartProperties, LineProperties, LinearGradient } from './models';

export enum AxisPosition {
  Left = 'Left',
  Right = 'Right',
  Top = 'Top',
  Bottom = 'Bottom',
}

export type AxisTick = {
  position: number; // position in pixels along the axis line, 0 being top left.
  label: string;
};

export type AxisProperties = {
  position?: AxisPosition;
  font?: string; // 'bold 12px Arial'
  fontColor?: string;
  ticks?: AxisTick[];
  tickLength?: number;
  tickWidth?: number;
  tickPadding?: number; // space between text label and tick mark
};

export type AxisChartProperties = {
  baseChartProps: BaseChartProperties;
  lineProps: LineProperties;
  axisProps: AxisProperties;
};

type Properties = {
  lineProps: Required<LineProperties>;
  axisProps: Required<AxisProperties>;
};

export class Axis extends BaseChart {
  #props: Properties;

  constructor(props?: Partial<AxisChartProperties>) {
    super(props?.baseChartProps);

    const lineProps: Required<LineProperties> = {
      strokeStyle: 'black',
      lineDash: [],
      lineWidth: 1,
      ...props?.lineProps,
    };

    const defaultAxisProps: Required<AxisProperties> = {
      position: AxisPosition.Bottom,
      font: '10px sans-serif',
      fontColor: 'black',
      ticks: [],
      tickLength: 6,
      tickWidth: 1,
      tickPadding: 5,
    };

    this.#props = {
      lineProps,
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

  strokeStyle(strokeStyle: string | LinearGradient | LinearGradientBuilder) {
    this.#props.lineProps.strokeStyle = strokeStyle;
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
    context.lineWidth = this.#props.lineProps.lineWidth;
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
        this.#props.lineProps,
        this.getFillStyle(this.#props.lineProps.strokeStyle, context),
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
        this.#props.lineProps,
        this.getFillStyle(this.#props.lineProps.strokeStyle, context),
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
    lineProperties: Required<LineProperties>,
    strokeStyle: string | CanvasGradient,
    textHeight: number,
    ticks: AxisTick[],
    tickWidth: number,
    tickLength: number,
    tickPadding: number,
  ) {
    const isTopAxis = axisPosition === AxisPosition.Top;
    const axisLineY = isTopAxis
      ? height - lineProperties.lineWidth / 2
      : lineProperties.lineWidth / 2;

    context.beginPath();

    context.strokeStyle = strokeStyle;
    context.setLineDash(lineProperties.lineDash);

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
    lineProperties: Required<LineProperties>,
    strokeStyle: string | CanvasGradient,
    textHeight: number,
    ticks: AxisTick[],
    tickWidth: number,
    tickLength: number,
    tickPadding: number,
  ) {
    const isLeftAxis = axisPosition === AxisPosition.Left;
    const x = isLeftAxis
      ? width - lineProperties.lineWidth / 2
      : lineProperties.lineWidth / 2;

    context.beginPath();

    context.strokeStyle = strokeStyle;
    context.setLineDash(lineProperties.lineDash);

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
                lineProperties.lineWidth +
                tickLength +
                context.measureText(tick.label).width +
                tickPadding
              )
            : tickLength + tickPadding);
        const labelYPosition =
          y + textHeight / 2 - (isLeftAxis ? lineProperties.lineWidth / 2 : 0);
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
