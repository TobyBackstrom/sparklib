import { LineProperties } from './line-properties';

export type DatumLine = {
  position: number; // x or y, default: 0
  lineProperties: Required<LineProperties>;
};
