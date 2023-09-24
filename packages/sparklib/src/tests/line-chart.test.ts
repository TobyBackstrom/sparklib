import { LineChart } from '../lib';

describe('LineChart', () => {
  let chart: LineChart;
  let values: [number, number][];

  beforeEach(() => {
    chart = new LineChart();
  });

  it('should return a canvas element when render is called with valid data', () => {
    values = [
      [0, 0],
      [10, 10],
      [20, 20],
      [30, 30],
      [40, 40],
      [50, 50],
      [60, 60],
      [70, 70],
      [80, 80],
      [90, 90],
      [100, 100],
    ];

    const result = chart.render(values);
    expect(result).toBeInstanceOf(HTMLCanvasElement);
  });

  it('should correctly compute domain coordinates', () => {
    const result = chart.height(100).width(200).render(values);
    expect(result).toBeInstanceOf(HTMLCanvasElement);

    const [domainX, domainY] = chart.getDomainCoordinate(100, 50);
    expect(domainX).toBe(50);
    expect(domainY).toBe(50);
  });

  it('should correctly compute pixel coordinates', () => {
    const result = chart.height(100).width(200).render(values);
    expect(result).toBeInstanceOf(HTMLCanvasElement);

    const [pixelX, pixelY] = chart.getPixelCoordinate(50, 50);
    expect(pixelX).toBe(100);
    expect(pixelY).toBe(50);
  });

  // TODO: Add more test cases:
  // 1. When data is empty or contains only 1 value.
  // 2. When different chart properties are set.
  // 3. When fillStyle and strokeStyle are applied.
  // ...and so on.
});
