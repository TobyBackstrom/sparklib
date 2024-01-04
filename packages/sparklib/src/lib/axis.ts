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

  render(ticks: AxisTick[], canvas?: HTMLCanvasElement): HTMLCanvasElement {
    const context = super.renderChartBase(canvas);
    context.font = this.#props.axisProps.font;

    const textMetrics = context.measureText('M');
    const textHeight =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;

    const width = this.chartProps.width;
    const height = this.chartProps.height;
    const lineWidth = this.#props.axisProps.lineWidth;
    const tickWidth = this.#props.axisProps.tickWidth;

    // Adjusted positions to account for line width
    const yTop = lineWidth / 2;
    const yBottom = height - lineWidth / 2;

    context.lineWidth = lineWidth;
    context.fillStyle = this.#props.axisProps.fontColor;

    if (this.#props.axisProps.position === AxisPosition.Top) {
      context.beginPath();
      context.moveTo(0, yBottom);
      context.lineTo(width, yBottom);

      ticks.forEach((tick) => {
        let tickPosition = tick.position;
        // Adjust for edge cases
        if (tickPosition === 0) {
          tickPosition += tickWidth;
        } else if (tick.position === width) {
          tickPosition -= tickWidth;
        }

        context.moveTo(tickPosition, yBottom);
        context.lineTo(
          tickPosition,
          yBottom - this.#props.axisProps.tickLength,
        );

        if (tick.label) {
          const labelYPosition =
            yBottom -
            this.#props.axisProps.tickLength -
            this.#props.axisProps.tickPadding; // Adjust the Y position for label
          context.textAlign = 'center';
          context.fillText(tick.label, tickPosition, labelYPosition);
        }
      });
    }

    if (this.#props.axisProps.position === AxisPosition.Bottom) {
      context.moveTo(0, yTop);
      context.lineTo(width, yTop);

      // Draw tick marks above the line
      ticks.forEach((tick) => {
        let tickPosition = tick.position;
        // Adjust for edge cases
        if (tickPosition === 0) {
          tickPosition += tickWidth;
        } else if (tick.position === width) {
          tickPosition -= tickWidth;
        }

        context.moveTo(tickPosition, yTop);
        context.lineTo(tickPosition, yTop + this.#props.axisProps.tickLength);

        if (tick.label) {
          const labelYPosition =
            yTop +
            this.#props.axisProps.tickLength +
            textHeight +
            this.#props.axisProps.tickPadding; // Adjust the Y position for label
          context.textAlign = 'center';
          context.fillText(tick.label, tickPosition, labelYPosition);
        }
      });
    }

    if (this.#props.axisProps.position === AxisPosition.Left) {
      const x = width - lineWidth / 2;

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
        context.lineTo(x - lineWidth - this.#props.axisProps.tickLength, y);

        if (tick.label) {
          const metrics = context.measureText(tick.label);

          const labelXPosition =
            x -
            lineWidth -
            this.#props.axisProps.tickLength -
            metrics.width -
            this.#props.axisProps.tickPadding;
          const labelYPosition = y + textHeight / 2;
          context.textAlign = 'left';
          context.fillText(tick.label, labelXPosition, labelYPosition);
        }
      });
    }

    if (this.#props.axisProps.position === AxisPosition.Right) {
      const x = lineWidth / 2;

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
        context.lineTo(x + this.#props.axisProps.tickLength, y);

        if (tick.label) {
          const labelXPosition =
            x +
            this.#props.axisProps.tickLength +
            this.#props.axisProps.tickPadding;
          const labelYPosition = y + textHeight / 2 - lineWidth / 2;
          context.textAlign = 'left';
          context.fillText(tick.label, labelXPosition, labelYPosition);
        }
      });
    }

    context.stroke();
    context.closePath();

    return context.canvas;
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
