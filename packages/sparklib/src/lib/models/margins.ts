import { MarginsBuilder } from './margins-builder';

export type Margins = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export const margins = () => new MarginsBuilder();
