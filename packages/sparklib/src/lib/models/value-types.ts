export type BasicLineValueType = (number | null) | [number, number | null];

export type LineValueType<T = unknown> =
  | (number | null)
  | [number, number | null]
  | T;
