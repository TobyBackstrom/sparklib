import { NO_MARGINS } from '../base-chart-models';
import { Margins } from './margins';

/**
 * A builder class for creating `Margins` objects.
 *
 * @example
 * ```typescript
 * const myMargins = new MarginsBuilder()
 *   .left(10)
 *   .top(20)
 *   .right(10)
 *   .bottom(20)
 *   .build();
 * ```
 */
export class MarginsBuilder {
  private margins: Margins = { ...NO_MARGINS };

  /**
   * Sets the left margin.
   *
   * @param value - The size of the left margin in pixels.
   * @returns The `MarginsBuilder` instance for chaining.
   */
  left(value: number): MarginsBuilder {
    this.margins.left = value;
    return this;
  }

  /**
   * Sets the top margin.
   *
   * @param value - The size of the top margin in pixels.
   * @returns The `MarginsBuilder` instance for chaining.
   */
  top(value: number): MarginsBuilder {
    this.margins.top = value;
    return this;
  }

  /**
   * Sets the right margin.
   *
   * @param value - The size of the right margin in pixels.
   * @returns The `MarginsBuilder` instance for chaining.
   */
  right(value: number): MarginsBuilder {
    this.margins.right = value;
    return this;
  }

  /**
   * Sets the bottom margin.
   *
   * @param value - The size of the bottom margin in pixels.
   * @returns The `MarginsBuilder` instance for chaining.
   */
  bottom(value: number): MarginsBuilder {
    this.margins.bottom = value;
    return this;
  }

  /**
   * Builds a `Margins` object based on the current state of the builder.
   *
   * @returns A `Margins` object with the specified margins.
   */
  build(): Margins {
    return {
      ...this.margins,
    };
  }
}

/**
 * Convenience function for creating a `MarginsBuilder` instance.
 *
 * @returns A new `MarginsBuilder` instance.
 *
 * @example
 * ```typescript
 * const myMargins = margins().left(10).top(20).build();
 * ```
 */
export const margins = () => new MarginsBuilder();
