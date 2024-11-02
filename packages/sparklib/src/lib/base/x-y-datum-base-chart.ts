import { YDatumBaseChart } from './y-datum-base-chart';
import { DatumLineBuilder } from '../builders';
import { DatumLine, LineProperties } from '../models';

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
