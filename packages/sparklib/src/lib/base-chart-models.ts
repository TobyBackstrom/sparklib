import { LinearGradient } from './linear-gradient';

export enum ArrayType {
  SingleNumbers = 'SingleNumbers',
  NumberPairs = 'NumberPairs',
}

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
};

export const NO_MARGINS: ChartMargins = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};
