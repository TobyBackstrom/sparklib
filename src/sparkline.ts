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

export const chart = (properties: ChartProperties) => {
  let _width = properties?.width ?? 250;
  let _height = properties?.height ?? 50;
  let _dpi = properties.dpi;
  let _xDomain: [number, number];
  let _yDomain: [number, number];

  const margins = properties.margins ?? defaultMargins;
  const horizontalMargin = margins.left + margins.right;
  const verticalMargin = margins.top + margins.bottom;

  const width = (w: number) => {
    _width = w;
    return exports;
  };

  const height = (h: number) => {
    _height = h;
    return exports;
  };

  const dpi = (_: number) => {
    _dpi = _;
    return exports;
  };

  const xDomain = (_: [number, number]) => {
    _xDomain = _;
    return exports;
  };

  const yDomain = (_: [number, number]) => {
    _yDomain = _;
    return exports;
  };

  const render = (values: number[]): HTMLCanvasElement => {
    const xScale = d3Scale
      .scaleLinear()
      .domain(_xDomain ?? [0, values.length - 1])
      .range([_width * horizontalMargin, _width - _width * horizontalMargin]);

    const yScale = d3Scale
      .scaleLinear()
      .domain(_yDomain ?? (d3Array.extent(values) as [number, number]))
      .range([_height - _height * verticalMargin, _height * verticalMargin]);

    const context = dom.context2d(_width, _height, _dpi);

    drawZeroLine(
      properties.zeroLine,
      values.length - 1,
      xScale,
      yScale,
      context
    );
    drawPath(values, xScale, yScale, properties.line, context);

    return context.canvas;
  };

  const exports = { width, height, dpi, xDomain, yDomain, render };

  return exports;
};

function drawZeroLine(
  properties: ZeroLineProperties | undefined,
  xMaxValue: number,
  xScale: d3Scale.ScaleLinear<number, number, never>,
  yScale: d3Scale.ScaleLinear<number, number, never>,
  context: CanvasRenderingContext2D
) {
  if (properties) {
    const zeroLineProperties = {
      ...defaultZeroLineProperties,
      ...properties,
    };

    drawLine(
      [
        [0, zeroLineProperties.zeroLineValue!],
        [xMaxValue, zeroLineProperties.zeroLineValue!],
      ],
      xScale,
      yScale,
      zeroLineProperties,
      context
    );
  }
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
  lineDash: [1, 1],
  lineWidth: 1,
  zeroLineValue: 0,
};
