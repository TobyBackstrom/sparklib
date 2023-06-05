import { LinearGradient } from './linear-gradient';
import { LinearGradientBuilder } from './linear-gradient-builder';

export type LineProperties = {
  strokeStyle?: string | LinearGradient | LinearGradientBuilder; // default: "black"
  lineWidth?: number; // default: 1
  lineDash?: number[]; // default: [], https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
};
