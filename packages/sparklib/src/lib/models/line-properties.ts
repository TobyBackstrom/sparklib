import { LinePropertiesBuilder } from './line-properties-builder';
import { LinearGradient } from './linear-gradient';
import { LinearGradientBuilder } from './linear-gradient-builder';

export type LineProperties = {
  strokeStyle?: string | LinearGradient | LinearGradientBuilder; // default: "black"
  lineWidth?: number; // default: 1
  lineDash?: number[]; // default: [], https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
};

export const lineProperties = (
  strokeStyle?: string | LinearGradient | LinearGradientBuilder,
  lineWidth?: number,
  lineDash?: number[]
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
