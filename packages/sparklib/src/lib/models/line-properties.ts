import { LinearGradient } from './linear-gradient';

export type LineProperties = {
  strokeStyle?: string | LinearGradient; // default: "black"
  lineWidth?: number; // default: 1
  lineDash?: number[]; // default: [], https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
};
