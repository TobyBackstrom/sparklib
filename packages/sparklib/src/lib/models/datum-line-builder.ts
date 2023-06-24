import { LinePropertiesBuilder } from './line-properties-builder';
import { DatumLine } from './datum-line';

export class DatumLineBuilder {
  private position = 0;
  private linePropertiesBuilder: LinePropertiesBuilder;

  constructor(linePropertiesBuilder: LinePropertiesBuilder) {
    this.linePropertiesBuilder = linePropertiesBuilder;
  }

  setPosition(position: number): DatumLineBuilder {
    this.position = position;
    return this;
  }

  build(): DatumLine {
    return {
      position: this.position,
      lineProperties: this.linePropertiesBuilder.build(),
    };
  }
}
