/**
 * A single color stop in a gradient.
 */
export type ColorStop = {
  /** The position of the color stop along the gradient line, ranging from 0 to 1. */
  offset: number;
  /** The color of the color stop, expressed as a CSS color string. */
  color: string;
};
