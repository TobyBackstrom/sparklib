import { DatumLineBuilder } from './datum-line-builder';
import { LineProperties, lineProperties } from './line-properties';
import { LinePropertiesBuilder } from './line-properties-builder';

export type DatumLine = {
  position: number; // x or y, default: 0
  lineProperties: Required<LineProperties>;
};

export const datumLine = (
  position?: number,
  linePropertiesBuilder?: LinePropertiesBuilder
) => {
  const builder = new DatumLineBuilder(
    linePropertiesBuilder ?? lineProperties()
  );

  if (position !== undefined) {
    builder.setPosition(position);
  }

  return builder;
};
