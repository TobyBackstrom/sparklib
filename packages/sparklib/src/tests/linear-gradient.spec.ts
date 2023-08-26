import {
  ColorStop,
  LinearGradient,
  LinearGradientBuilder,
  linearGradient,
} from '../lib';
import { createLinearGradient } from '../lib/dom';
import 'jest-canvas-mock';

describe('createLinearGradient function', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let canvasContextMock: any;
  let linearGradient: LinearGradient;

  beforeEach(() => {
    // Mock the CanvasRenderingContext2D and the createLinearGradient method
    canvasContextMock = {
      createLinearGradient: jest.fn().mockImplementation(() => {
        return {
          addColorStop: jest.fn(),
        };
      }),
    };

    // Initialize a LinearGradient
    linearGradient = {
      x0: 0,
      y0: 0,
      x1: 100,
      y1: 100,
      colorStops: [
        {
          offset: 0.5,
          color: 'red',
        },
        {
          offset: 1,
          color: 'blue',
        },
      ],
    };
  });

  it('should create a CanvasGradient correctly', () => {
    const canvasGradient = createLinearGradient(
      linearGradient,
      canvasContextMock,
    );

    // Check that the createLinearGradient method was called correctly
    expect(canvasContextMock.createLinearGradient).toHaveBeenCalledWith(
      0,
      0,
      100,
      100,
    );

    // Check that the addColorStop method was called correctly for each color stop
    expect(canvasGradient.addColorStop).toHaveBeenCalledWith(0.5, 'red');
    expect(canvasGradient.addColorStop).toHaveBeenCalledWith(1, 'blue');
  });
});

describe('LinearGradientBuilder', () => {
  it('should correctly build a linear gradient', () => {
    const linearGradientInstance = new LinearGradientBuilder(0, 0, 100, 100)
      .addColorStop(0, 'red')
      .addColorStop(1, 'blue')
      .build();

    expect(linearGradientInstance).toEqual({
      x0: 0,
      y0: 0,
      x1: 100,
      y1: 100,
      colorStops: [
        { offset: 0, color: 'red' },
        { offset: 1, color: 'blue' },
      ],
    });
  });
});

describe('linearGradient function', () => {
  it('should create a builder and correctly build a linear gradient', () => {
    const colorStops: ColorStop[] = [
      { offset: 0, color: 'red' },
      { offset: 1, color: 'blue' },
    ];

    const linearGradientInstance = linearGradient(
      0,
      0,
      100,
      100,
      colorStops,
    ).build();

    expect(linearGradientInstance).toEqual({
      x0: 0,
      y0: 0,
      x1: 100,
      y1: 100,
      colorStops: [
        { offset: 0, color: 'red' },
        { offset: 1, color: 'blue' },
      ],
    });
  });
});
