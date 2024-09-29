import * as d3Scale from 'd3-scale';

import { BaseChart } from './base-chart';
import { DatumLineBuilder } from './builders';
import {
  BaseChartProperties,
  Coordinate,
  DatumLine,
  LineProperties,
  Range,
} from './models';
import { XYDatumBaseChartProperties } from './models/datum-base-chart-properties';

// Note to self: Mixins can't be used as they impose restrictions on hiding visibility.
//               Methods and properties from base classes would become public/protected.
//               Hence this somewhat convoluted solution with multiple classes.

type Properties = Omit<XYDatumBaseChartProperties, keyof BaseChartProperties>;

abstract class DatumBaseChart extends BaseChart {
  #props: Properties;

  constructor(props?: Partial<XYDatumBaseChartProperties>) {
    super(props);

    this.#props = {
      xDatumLines: [...(props?.xDatumLines || [])],
      yDatumLines: [...(props?.yDatumLines || [])],
    };
  }

  protected renderDatumLines(
    context: CanvasRenderingContext2D,
    zIndex0: boolean, // only draw zIndex === 0 or not
    xDomain: Range,
    yDomain: Range,
    xScale: d3Scale.ScaleLinear<number, number, never>,
    yScale: d3Scale.ScaleLinear<number, number, never>,
  ): void {
    this.#props.xDatumLines.forEach((datumLine) => {
      const draw = datumLine.zIndex === 0 ? zIndex0 : true;

      if (draw) {
        this.drawDatumLine('x', datumLine, xScale, yScale, yDomain, context);
      }
    });

    this.#props.yDatumLines.forEach((datumLine) => {
      const draw = datumLine.zIndex === 0 ? zIndex0 : true;

      if (draw) {
        this.drawDatumLine('y', datumLine, xScale, yScale, xDomain, context);
      }
    });
  }

  protected addDatumLine(
    orientation: 'x' | 'y',
    position: number,
    datumLineProps?: LineProperties,
    zIndex?: number,
  ) {
    const defaultDatumLineProps = {
      strokeStyle: 'black',
      lineDash: [1, 1],
      lineWidth: 1,
    };

    const lineProperties = {
      ...defaultDatumLineProps,
      ...datumLineProps,
    } as Required<LineProperties>;

    const datumLines =
      orientation === 'x' ? this.#props.xDatumLines : this.#props.yDatumLines;

    datumLines.push({ position, lineProperties, zIndex });
  }

  protected addYDatumLines(datumLines: DatumLine[]) {
    this.#props.yDatumLines.push(...datumLines);
    return this;
  }

  protected addXDatumLines(datumLines: DatumLine[]) {
    this.#props.xDatumLines.push(...datumLines);
    return this;
  }

  protected drawDatumLine(
    orientation: 'x' | 'y',
    datumLine: DatumLine,
    xScale: d3Scale.ScaleLinear<number, number, never>,
    yScale: d3Scale.ScaleLinear<number, number, never>,
    domain: Range,
    context: CanvasRenderingContext2D,
  ): void {
    const scaledCoordinates: Coordinate[] =
      orientation === 'x'
        ? [
            [xScale(datumLine.position), yScale(domain[0])],
            [xScale(datumLine.position), yScale(domain[1])],
          ]
        : [
            [xScale(domain[0]), yScale(datumLine.position)],
            [xScale(domain[1]), yScale(datumLine.position)],
          ];

    this.drawLine(scaledCoordinates, datumLine.lineProperties, context);
  }
}

export abstract class YDatumBaseChart extends DatumBaseChart {
  #xDomain = [0, this.chartProps.width] as Range;
  #xScale = d3Scale
    .scaleLinear()
    .domain(this.#xDomain)
    .range([
      this.chartProps.margins.left,
      this.chartProps.width - this.chartProps.margins.right,
    ]);

  protected renderHorizontalDatumLines(
    context: CanvasRenderingContext2D,
    zIndex0: boolean, // only draw zIndex === 0 or not
    yDomain: Range,
    yScale: d3Scale.ScaleLinear<number, number, never>,
  ): void {
    super.renderDatumLines(
      context,
      zIndex0,
      this.#xDomain,
      yDomain,
      this.#xScale,
      yScale,
    );
  }

  // add a horizontal reference line in the y domain
  yDatum(
    yPositionOrDatumLineBuilder: number | DatumLineBuilder,
    lineProps?: LineProperties,
    zIndex?: number,
  ) {
    if (typeof yPositionOrDatumLineBuilder === 'number') {
      this.addDatumLine('y', yPositionOrDatumLineBuilder, lineProps, zIndex);
    } else {
      const datumLine = yPositionOrDatumLineBuilder.build();
      this.addDatumLine(
        'y',
        datumLine.position,
        datumLine.lineProperties,
        datumLine.zIndex,
      );
    }

    return this;
  }

  yDatumLines(datumLines: DatumLine[]) {
    this.addYDatumLines(datumLines);
    return this;
  }
}

export abstract class XYDatumBaseChart extends YDatumBaseChart {
  xDatum(
    xPositionOrDatumLineBuilder: number | DatumLineBuilder,
    lineProps?: LineProperties,
    zIndex?: number,
  ): this {
    if (typeof xPositionOrDatumLineBuilder === 'number') {
      this.addDatumLine('x', xPositionOrDatumLineBuilder, lineProps, zIndex);
    } else {
      const datumLine = xPositionOrDatumLineBuilder.build();
      this.addDatumLine(
        'x',
        datumLine.position,
        datumLine.lineProperties,
        datumLine.zIndex,
      );
    }

    return this;
  }

  xDatumLines(datumLines: DatumLine[]) {
    this.addXDatumLines(datumLines);
    return this;
  }
}
