import * as dom from './dom';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';
import * as d3Color from 'd3-color';

export interface ChartMargins {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface AreaProperties {
  fillStyle?: string | CanvasGradient | CanvasPattern; // default: "black"
}

export interface LineProperties {
  strokeStyle?: string | CanvasGradient | CanvasPattern; // default: "black"
  lineWidth?: number; // default: 1
  lineDash?: number[]; // default: [], https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
}

export interface ZeroLineProperties extends LineProperties {
  zeroLineValue?: number; // default: 0
}

export interface ChartProperties {
  width: number;
  height: number;
  dpi?: number;
  area: AreaProperties;
  line: LineProperties;
  margins?: ChartMargins;
  zeroLine?: ZeroLineProperties;
}

export function sparkline(
  values: number[],
  properties: ChartProperties
): HTMLCanvasElement {
  const margins = properties.margins ?? defaultMargins;

  const horizontalMargin = margins.left + margins.right;
  const verticalMargin = margins.top + margins.bottom;

  const xScale = d3Scale
    .scaleLinear()
    .domain([0, values.length - 1])
    .range([
      properties.width * horizontalMargin,
      properties.width - properties.width * horizontalMargin,
    ]);

  const yScale = d3Scale
    .scaleLinear()
    .domain(d3Array.extent(values) as [number, number])
    .range([
      properties.height - properties.height * verticalMargin,
      properties.height * verticalMargin,
    ]);

  const context = dom.context2d(
    properties.width,
    properties.height,
    properties.dpi
  );

  if (properties.zeroLine) {
    const y =
      properties.zeroLine.zeroLineValue ??
      defaultZeroLineProperties.zeroLineValue!;

    drawLine(
      [
        [0, y],
        [values.length - 1, y],
      ],
      xScale,
      yScale,
      properties.zeroLine,
      context
    );
  }

  drawPath(values, xScale, yScale, properties.line, context);

  return context.canvas;
}

function drawLine(
  coordinates: number[][], // (x0, y0) -> (x1, y1)
  xScale: any,
  yScale: any,
  lineProperties: LineProperties,
  context: CanvasRenderingContext2D
) {
  const line = (data: number[][]) => {
    context.beginPath();

    context.moveTo(xScale(coordinates[0][0]), yScale(coordinates[0][1]));
    context.lineTo(xScale(coordinates[1][0]), yScale(coordinates[1][1]));

    setContextLineProperties(lineProperties, context);

    context.stroke();
    context.closePath();
  };

  line(coordinates);
}

function drawPath(
  values: number[],
  xScale: any,
  yScale: any,
  lineProperties: LineProperties,
  context: CanvasRenderingContext2D
) {
  const line = (data: number[]) => {
    context.beginPath();

    const line = d3Shape
      .line<number>()
      .x((_, i) => xScale(i))
      .y(yScale)
      .context(context)(data);

    setContextLineProperties(lineProperties, context);

    context.stroke();
    context.closePath();
  };

  line(values);
}

function setContextLineProperties(
  properties: LineProperties,
  context: CanvasRenderingContext2D
) {
  const strokeStyle =
    properties.strokeStyle ?? defaultLineProperties.strokeStyle;
  const lineWidth = properties.lineWidth ?? defaultLineProperties.lineWidth;
  const lineDash = properties.lineDash ?? defaultLineProperties.lineDash;

  context.strokeStyle = strokeStyle!;
  context.setLineDash(lineDash!);
  context.lineWidth = lineWidth!;
}

function getAreaFillstyle(
  area: AreaProperties,
  fallback: LineProperties
): string | CanvasGradient | CanvasPattern {
  if (area?.fillStyle) {
    return area.fillStyle!;
  }

  if (
    typeof fallback?.strokeStyle === 'string' ||
    fallback?.strokeStyle == null
  ) {
    const fillStyle = fallback?.strokeStyle || 'black';
    const color = d3Color.color(fillStyle)?.copy({ opacity: 0.3 });
    return color!.formatHex8();
  }

  return area.fillStyle!;
}

function is2DArray(array: any[]): boolean {
  return array.every((element) => Array.isArray(element));
}

const defaultMargins: ChartMargins = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};

const defaultLineProperties: LineProperties = {
  strokeStyle: 'black',
  lineDash: [],
  lineWidth: 1,
};

const defaultZeroLineProperties: ZeroLineProperties = {
  strokeStyle: 'black',
  lineDash: [],
  lineWidth: 1,
  zeroLineValue: 0,
};
