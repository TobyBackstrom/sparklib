export type BasicLineValueType = (number | null) | [number, number | null];

export type LineValueType<T = unknown> =
  | (number | null)
  | [number, number | null]
  | T;

export type StripeValueType<T = unknown> = number | T;

export type BarValueType<T = unknown> = number | T;
