import {
  LinePropertiesBuilder,
  lineProperties,
} from './line-properties-builder';
import { DatumLine } from '../models';

/**
 * A builder class for creating `DatumLine` objects.
 *
 * @public
 *
 * @example
 * ```typescript
 * const datumBuilder = new DatumLineBuilder(new LinePropertiesBuilder())
 *   .setPosition(5)
 *   .build();
 * ```
 */
export class DatumLineBuilder {
  private position = 0;
  private zIndex?: number;
  private linePropertiesBuilder: LinePropertiesBuilder;

  /**
   * Constructs a new `DatumLineBuilder`.
   *
   * @param linePropertiesBuilder - An instance of `LinePropertiesBuilder` to set the line properties.
   */
  constructor(linePropertiesBuilder: LinePropertiesBuilder) {
    this.linePropertiesBuilder = linePropertiesBuilder;
  }

  /**
   * Sets the position for the datum line.
   *
   * @param position - The position of the line along the x or y axis.
   * @returns The `DatumLineBuilder` instance for chaining.
   */
  setPosition(position: number): DatumLineBuilder {
    this.position = position;
    return this;
  }

  /**
   * Sets the position for the datum line.
   *
   * @param zIndex - The zIndex of the datum line.
   * @returns The `DatumLineBuilder` instance for chaining.
   */
  setZIndex(zIndex: number): DatumLineBuilder {
    this.zIndex = zIndex;
    return this;
  }

  /**
   * Builds a `DatumLine` object based on the current state of the builder.
   *
   * @returns A `DatumLine` object with required properties.
   */
  build(): DatumLine {
    return {
      position: this.position,
      zIndex: this.zIndex,
      lineProperties: this.linePropertiesBuilder.build(),
    };
  }
}

/**
 * Convenience function for creating a `DatumLineBuilder` instance.
 *
 * @param position - Optional initial position along the axis.
 * @param linePropertiesBuilder - Optional instance of `LinePropertiesBuilder` for line properties.
 * @returns A new `DatumLineBuilder` instance.
 *
 * @example
 * ```typescript
 * const myDatumLine = datumLine(5, new LinePropertiesBuilder()).build();
 * ```
 */
export const datumLine = (
  position?: number,
  linePropertiesBuilder?: LinePropertiesBuilder,
  zIndex?: number,
) => {
  const builder = new DatumLineBuilder(
    linePropertiesBuilder ?? lineProperties(),
  );

  if (zIndex !== undefined) {
    builder.setZIndex(zIndex);
  }

  if (position !== undefined) {
    builder.setPosition(position);
  }

  return builder;
};
