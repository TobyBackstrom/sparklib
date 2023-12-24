export const singleValues = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 7, 5, 3, 2, 1, -1, -2, -5, -7, -2, 3, 4, 5, 6, 7,
  8, 6, 5, 4, 2, 1, 1, 1, 6, 7, 7, 8, 9, 0,
];

export const dateDataValues = [
  [new Date('2023-05-01T00:00:00.000Z'), 7.64],
  [new Date('2023-05-03T00:00:00.000Z'), -5.42],
  [new Date('2023-05-05T00:00:00.000Z'), 11.89],
  [new Date('2023-05-07T00:00:00.000Z'), -1.33],
  [new Date('2023-05-09T00:00:00.000Z'), 3.52],
  [new Date('2023-05-10T00:00:00.000Z'), -10.7],
  [new Date('2023-05-11T00:00:00.000Z'), 8.25],
  [new Date('2023-05-12T00:00:00.000Z'), 14.03],
  [new Date('2023-05-13T00:00:00.000Z'), -4.97],
  [new Date('2023-05-14T00:00:00.000Z'), 6.84],
  [new Date('2023-05-15T00:00:00.000Z'), -9.16],
  [new Date('2023-05-16T00:00:00.000Z'), 12.23],
  [new Date('2023-05-17T00:00:00.000Z'), 2.64],
  [new Date('2023-05-18T00:00:00.000Z'), -7.89],
  [new Date('2023-05-31T00:00:00.000Z'), 5.97],
  [new Date('2023-06-02T00:00:00.000Z'), -0.47],
  [new Date('2023-06-04T00:00:00.000Z'), 10.61],
  [new Date('2023-06-07T00:00:00.000Z'), -13.5],
  [new Date('2023-06-09T00:00:00.000Z'), 9.36],
  [new Date('2023-06-11T00:00:00.000Z'), -2.91],
  [new Date('2023-06-12T00:00:00.000Z'), 1.78],
  [new Date('2023-06-15T00:00:00.000Z'), -8.32],
  [new Date('2023-06-17T00:00:00.000Z'), 13.56],
  [new Date('2023-06-20T00:00:00.000Z'), -6.15],
];

export const monoDataValues = [
  7.64, -5.42, 11.89, -1.33, 3.52, -10.7, 8.25, 14.03, -4.97, 6.84, -9.16,
  12.23, 2.64, -7.89, 5.97, -0.47, 10.61, -13.5, 9.36, -2.91, 1.78, -8.32,
  13.56, -6.15,
];

export const monoDataValuesWithGaps = [
  7.64,
  -5.42,
  11.89,
  -1.33,
  3.52,
  -10.7,
  8.25,
  14.03,
  -4.97,
  6.84,
  -9.16,
  12.23,
  2.64,
  null,
  null,
  null,
  10.61,
  -13.5,
  9.36,
  null,
  1.78,
  -8.32,
  13.56,
  -6.15,
];

export interface DataObject {
  xPos: number;
  yPos: number | null;
  someOtherProp: string;
}
export const monoObjectValuesWithGaps: DataObject[] = [
  { xPos: -1, yPos: 7.64, someOtherProp: 'data' },
  { xPos: -1, yPos: -5.42, someOtherProp: 'data' },
  { xPos: -1, yPos: 11.89, someOtherProp: 'data' },
  { xPos: -1, yPos: -1.33, someOtherProp: 'data' },
  { xPos: -1, yPos: 3.52, someOtherProp: 'data' },
  { xPos: -1, yPos: -10.7, someOtherProp: 'data' },
  { xPos: -1, yPos: 8.25, someOtherProp: 'data' },
  { xPos: -1, yPos: 14.03, someOtherProp: 'data' },
  { xPos: -1, yPos: -4.97, someOtherProp: 'data' },
  { xPos: -1, yPos: 6.84, someOtherProp: 'data' },
  { xPos: -1, yPos: -9.16, someOtherProp: 'data' },
  { xPos: -1, yPos: 12.23, someOtherProp: 'data' },
  { xPos: -1, yPos: 2.64, someOtherProp: 'data' },
  { xPos: -1, yPos: null, someOtherProp: 'empty' },
  { xPos: -1, yPos: null, someOtherProp: 'empty' },
  { xPos: -1, yPos: null, someOtherProp: 'empty' },
  { xPos: -1, yPos: 10.61, someOtherProp: 'data' },
  { xPos: -1, yPos: -13.5, someOtherProp: 'data' },
  { xPos: -1, yPos: 9.36, someOtherProp: 'data' },
  { xPos: -1, yPos: null, someOtherProp: 'empty' },
  { xPos: -1, yPos: 1.78, someOtherProp: 'data' },
  { xPos: -1, yPos: -8.32, someOtherProp: 'data' },
  { xPos: -1, yPos: 13.56, someOtherProp: 'data' },
  { xPos: -1, yPos: -6.15, someOtherProp: 'data' },
];

export const pairDataValues = [
  [0, 7.64],
  [10, -5.42],
  [20, 11.89],
  [30, -1.33],
  [40, 3.52],
  [50, -10.7],
  [60, 8.25],
  [70, 14.03],
  [80, -4.97],
  [90, 6.84],
  [100, -9.16],
  [110, 12.23],
  [120, 2.64],
  [130, -7.89],
  [140, 5.97],
  [150, -0.47],
  [160, 10.61],
  [170, -13.5],
  [180, 9.36],
  [190, -2.91],
  [200, 1.78],
  [210, -8.32],
  [220, 13.56],
  [230, -6.15],
] as [number, number][];

export const pairSegmentValues = [
  [0, 7.64],
  [10, -5.42],
  [20, 11.89],
  [30, -1.33],
  [40, 3.52],
  [50, -10.7],
  [60, 8.25],
  [70, 14.03],
  [80, -4.97],
  [90, null],
  [100, null],
  // [90, 6.84],
  // [100, -9.16],
  [110, 12.23],
  [120, 2.64],
  [130, -7.89],
  [140, 5.97],
  [150, null],
  [160, 8.0],
  [170, null],
  // [150, -0.47],
  // [160, 10.61],
  // [170, -13.5],
  [180, 9.36],
  [190, -2.91],
  [200, 1.78],
  [210, -8.32],
  [220, 13.56],
  [230, -6.15],
] as [number, number][];

export const pairObjectSegmentValues: DataObject[] = [
  { xPos: 0, yPos: 7.64, someOtherProp: 'data' },
  { xPos: 10, yPos: -5.42, someOtherProp: 'data' },
  { xPos: 20, yPos: 11.89, someOtherProp: 'data' },
  { xPos: 30, yPos: -1.33, someOtherProp: 'data' },
  { xPos: 40, yPos: 3.52, someOtherProp: 'data' },
  { xPos: 50, yPos: -10.7, someOtherProp: 'data' },
  { xPos: 60, yPos: 8.25, someOtherProp: 'data' },
  { xPos: 70, yPos: 14.03, someOtherProp: 'data' },
  { xPos: 80, yPos: -4.97, someOtherProp: 'data' },
  { xPos: 90, yPos: null, someOtherProp: 'empty' },
  { xPos: 100, yPos: null, someOtherProp: 'empty' },
  { xPos: 110, yPos: 12.23, someOtherProp: 'data' },
  { xPos: 120, yPos: 2.64, someOtherProp: 'data' },
  { xPos: 130, yPos: -7.89, someOtherProp: 'data' },
  { xPos: 140, yPos: 5.97, someOtherProp: 'data' },
  { xPos: 150, yPos: null, someOtherProp: 'empty' },
  { xPos: 160, yPos: 8.0, someOtherProp: 'data' },
  { xPos: 170, yPos: null, someOtherProp: 'empty' },
  { xPos: 180, yPos: 9.36, someOtherProp: 'data' },
  { xPos: 190, yPos: -2.91, someOtherProp: 'data' },
  { xPos: 200, yPos: 1.78, someOtherProp: 'data' },
  { xPos: 210, yPos: -8.32, someOtherProp: 'data' },
  { xPos: 220, yPos: 13.56, someOtherProp: 'data' },
  { xPos: 230, yPos: -6.15, someOtherProp: 'data' },
];

export const stripe_x10_1_and_0 = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
export const stripe_x10_0_and_1 = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
export const stripe_x10_mostly_0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
export const stripe_x10_mostly_1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0];

export const stripe_x10_0_to_9 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const monotonicIncreasing = (
  first: number,
  length: number,
): number[] => {
  const result = [];

  for (let i = 0; i < length; ++i) {
    result.push(first++);
  }

  return result;
};

export const randomInRange = (
  minV: number,
  maxV: number,
  length: number,
  zeroProbability: number,
): number[] => {
  const result = [];

  for (let i = 0; i < length; ++i) {
    const randomNum = parseFloat(Math.random().toFixed(1));

    if (randomNum < zeroProbability) {
      result.push(0);
    } else {
      result.push(randomNum * (maxV - minV) + minV);
    }
  }

  return result;
};
