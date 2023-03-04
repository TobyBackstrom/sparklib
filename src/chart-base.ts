import * as dom from './dom';
import * as d3Array from 'd3-array';
import * as d3Color from 'd3-color';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';

export interface ChartMargins {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface AreaProperties {
  fillStyle?: string | CanvasGradient; // default: "black with opacity 0.3"
}

export interface LineProperties {
  strokeStyle?: string | CanvasGradient; // default: "black"
  lineWidth?: number; // default: 1
  lineDash?: number[]; // default: [], https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
}

export interface DatumLine {
  position: number; // x or y, default: 0
  lineProperties: LineProperties;
}

export interface ChartProperties {
  width?: number;
  height?: number;
  dpi?: number;
}

export class ChartBase {
  #chartProps: ChartProperties = { width: 250, height: 50 };
  #background: string | CanvasGradient | undefined = undefined;

  #margins: ChartMargins = {
    bottom: 2,
    left: 2,
    right: 2,
    top: 2,
  };

  #lineProps: LineProperties | undefined = undefined;
  #xDatumLines: DatumLine[] = [];
  #yDatumLines: DatumLine[] = [];

  #xDomain: [number, number] | undefined;
  #yDomain: [number, number] | undefined;

  constructor(props?: ChartProperties) {
    this.#chartProps = { ...this.#chartProps, ...props };
  }

  width(width: number) {
    this.#chartProps.width = width;
    return this;
  }

  height(height: number) {
    this.#chartProps.height = height;
    return this;
  }

  dpi(dpi: number) {
    this.#chartProps.dpi = dpi;
    return this;
  }

  margins(margins: ChartMargins) {
    this.#margins = { ...this.#margins, ...margins };
    return this;
  }

  // minX - maxX
  xDomain(xDomain: [number, number]) {
    this.#xDomain = xDomain;
    return this;
  }

  // minY - maxY
  yDomain(yDomain: [number, number]) {
    this.#yDomain = yDomain;
    return this;
  }

  // add horizontal reference lines in the y domain
  yDatum(y: number, lineProps?: LineProperties) {
    this.#datum(this.#yDatumLines, y, lineProps);

    return this;
  }

  // add horizontal reference lines in the y domain
  xDatum(x: number, lineProps?: LineProperties) {
    this.#datum(this.#xDatumLines, x, lineProps);

    return this;
  }

  background(background: string | CanvasGradient) {
    this.#background = background;
    return this;
  }

  line(lineProps?: LineProperties) {
    const defaultLineProps = {
      strokeStyle: 'black',
      lineDash: [],
      lineWidth: 1,
    };

    this.#lineProps = lineProps
      ? { ...defaultLineProps, ...lineProps }
      : defaultLineProps;

    return this;
  }

  render(values: number[], tmp: [number, number][]): HTMLCanvasElement {
    const xScale = d3Scale
      .scaleLinear()
      .domain(this.#xDomain ?? [0, values.length - 1])
      .range([
        this.#margins.left,
        this.#chartProps.width! - this.#margins.right,
      ]);

    this.#yDomain =
      this.#yDomain ?? (d3Array.extent(values) as [number, number]);
    const yScale = d3Scale
      .scaleLinear()
      .domain(this.#yDomain)
      .range([
        this.#chartProps.height! - this.#margins.top,
        this.#margins.bottom,
      ]);

    const context = dom.context2d(
      this.#chartProps.width!,
      this.#chartProps.height!,
      this.#chartProps.dpi
    );

    if (this.#background) {
      context.fillStyle = this.#background;
      context.fillRect(0, 0, this.#chartProps.width!, this.#chartProps.height!);
    }

    this.#xDatumLines.forEach((datumLine) =>
      drawLine(
        [
          [datumLine.position ?? 0, this.#yDomain![0]],
          [datumLine.position ?? 0, this.#yDomain![1]],
        ],
        yScale,
        xScale,
        datumLine.lineProperties,
        context
      )
    );

    this.#yDatumLines.forEach((datumLine) =>
      drawLine(
        [
          [0, datumLine.position ?? 0],
          [values.length - 1, datumLine.position ?? 0],
        ],
        xScale,
        yScale,
        datumLine.lineProperties,
        context
      )
    );

    if (this.#lineProps) {
      drawPath(values, xScale, yScale, this.#lineProps, context);
    }

    return context.canvas;
  }

  #datum = (
    datumLines: DatumLine[],
    position: number,
    datumLineProps?: LineProperties
  ) => {
    const defaultDatumLineProps = {
      strokeStyle: 'black',
      lineDash: [],
      lineWidth: 1,
    };

    const lineProperties = {
      ...defaultDatumLineProps,
      ...datumLineProps,
    } as LineProperties;

    datumLines.push({ position, lineProperties });
  };
}

export class LineChart extends ChartBase {
  constructor(props?: ChartProperties) {
    super(props);
  }
}
// TODO: move

export function drawLine(
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

export function drawPath(
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
  props: LineProperties,
  context: CanvasRenderingContext2D
) {
  context.strokeStyle = props.strokeStyle!;
  context.setLineDash(props.lineDash!);
  context.lineWidth = props.lineWidth!;
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
