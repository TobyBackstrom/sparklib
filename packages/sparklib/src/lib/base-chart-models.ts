import { LinearGradient } from './models';

export type ChartMargins = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type ChartProperties = {
  width: number;
  height: number;
  dpi?: number;
  background?: string | LinearGradient | undefined;
  margins?: ChartMargins;
};

export const NO_MARGINS: ChartMargins = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};
