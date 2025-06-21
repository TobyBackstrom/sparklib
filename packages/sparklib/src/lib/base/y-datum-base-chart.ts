import { DatumBaseChart } from './datum-base-chart';
import { DatumLineBuilder } from '../builders';
import { DatumLine, LineProperties, Range } from '../models';
import { scaleLinear, ScaleLinear } from '../utils';

export abstract class YDatumBaseChart extends DatumBaseChart {
  #xDomain = [0, this.chartProps.width] as Range;
  #xScale = scaleLinear()
    .domain(this.#xDomain)
    .range([
      this.chartProps.margins.left,
      this.chartProps.width - this.chartProps.margins.right,
    ]);

  protected renderHorizontalDatumLines(
    context: CanvasRenderingContext2D,
    zIndex0: boolean, // only draw zIndex === 0 or not
    yDomain: Range,
    yScale: ScaleLinear,
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
