import { LinearGradient } from './linear-gradient';
import { LinearGradientBuilder } from './linear-gradient-builder';
import { LineProperties } from './line-properties';

/**
 * A builder class for creating `LineProperties` objects.
 *
 * @example
 * ```typescript
 * const builder = new LinePropertiesBuilder()
 *   .setStrokeStyle('red')
 *   .setLineWidth(2)
 *   .setLineDash([5, 10])
 *   .build();
 * ```
 */
export class LinePropertiesBuilder {
  private strokeStyle: string | LinearGradient | LinearGradientBuilder =
    'black';
  private lineWidth = 1;
  private lineDash: number[] = [];

  /**
   * Sets the stroke style for the line.
   *
   * @param strokeStyle - The style of the stroke, either a CSS color string, a `LinearGradient` object, or a `LinearGradientBuilder` instance.
   * @returns The `LinePropertiesBuilder` instance, for chaining.
   */
  setStrokeStyle(
    strokeStyle: string | LinearGradient | LinearGradientBuilder,
  ): LinePropertiesBuilder {
    this.strokeStyle = strokeStyle;
    return this;
  }

  /**
   * Sets the line width.
   *
   * @param lineWidth - The width of the line.
   * @returns The `LinePropertiesBuilder` instance, for chaining.
   */
  setLineWidth(lineWidth: number): LinePropertiesBuilder {
    this.lineWidth = lineWidth;
    return this;
  }

  /**
   * Sets the line dash pattern.
   *
   * @param lineDash - An array representing the line dash pattern.
   * @returns The `LinePropertiesBuilder` instance, for chaining.
   */
  setLineDash(lineDash: number[]): LinePropertiesBuilder {
    this.lineDash = lineDash;
    return this;
  }

  /**
   * Builds a `LineProperties` object based on the current state of the builder.
   *
   * @returns A `LineProperties` object with required properties.
   */
  build(): Required<LineProperties> {
    return {
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth,
      lineDash: this.lineDash,
    };
  }
}

/**
 * Convenience function for creating a `LinePropertiesBuilder` instance.
 *
 * @param strokeStyle - An optional initial stroke style.
 * @param lineWidth - An optional initial line width.
 * @param lineDash - An optional initial line dash pattern.
 * @returns A new `LinePropertiesBuilder` instance, pre-initialized with any provided values.
 *
 * @example
 * ```typescript
 * const lineProps = lineProperties('red', 2, [5, 10]).build();
 * ```
 */
export const lineProperties = (
  strokeStyle?: string | LinearGradient | LinearGradientBuilder,
  lineWidth?: number,
  lineDash?: number[],
) => {
  const builder = new LinePropertiesBuilder();

  if (strokeStyle !== undefined) {
    builder.setStrokeStyle(strokeStyle);
  }

  if (lineWidth !== undefined) {
    builder.setLineWidth(lineWidth);
  }

  if (lineDash !== undefined) {
    builder.setLineDash(lineDash);
  }

  return builder;
};
