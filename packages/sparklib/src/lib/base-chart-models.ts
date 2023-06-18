import { Margins } from './models/margins';
import {
  LinearGradient,
  LinearGradientBuilder,
  MarginsBuilder,
} from './models';

export type ChartProperties = {
  width: number;
  height: number;
  dpi?: number;
  background?: string | LinearGradient | LinearGradientBuilder | undefined;
  margins?: Margins | MarginsBuilder;
};

export const NO_MARGINS: Margins = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};
