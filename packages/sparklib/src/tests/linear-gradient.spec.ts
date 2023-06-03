import { LinearGradient, linearGradient } from '../lib/models';
import 'jest-canvas-mock';

describe('LinearGradient', () => {
  let linearGradientInstance: LinearGradient;

  beforeEach(() => {
    linearGradientInstance = new LinearGradient(0, 0, 100, 100);
  });

  test('should call context.createLinearGradient with correct arguments', () => {
    const mockContext = {
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn(),
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    linearGradientInstance.getCanvasGradient(mockContext as any);

    expect(mockContext.createLinearGradient).toHaveBeenCalledWith(
      0,
      0,
      100,
      100
    );
  });

  test('should call gradient.addColorStop with correct arguments', () => {
    const addColorStopMock = jest.fn();

    const mockContext = {
      createLinearGradient: jest.fn(() => ({
        addColorStop: addColorStopMock,
      })),
    };

    linearGradientInstance
      .addColorStop(0, 'red')
      .addColorStop(1, 'blue')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .getCanvasGradient(mockContext as any);

    expect(addColorStopMock).toHaveBeenCalledWith(0, 'red');
    expect(addColorStopMock).toHaveBeenCalledWith(1, 'blue');
  });

  test('should add color stops through constructor', () => {
    const colorStops = [
      { offset: 0, color: 'red' },
      { offset: 1, color: 'blue' },
    ];

    const addColorStopMock = jest.fn();

    const mockContext = {
      createLinearGradient: jest.fn(() => ({
        addColorStop: addColorStopMock,
      })),
    };

    const gradient = new LinearGradient(0, 0, 100, 100, colorStops);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gradient.getCanvasGradient(mockContext as any);

    expect(addColorStopMock).toHaveBeenCalledWith(0, 'red');
    expect(addColorStopMock).toHaveBeenCalledWith(1, 'blue');
  });
});

describe('linearGradient', () => {
  test('should return a new LinearGradient instance', () => {
    const gradient = linearGradient(0, 0, 100, 100);
    expect(gradient).toBeInstanceOf(LinearGradient);
  });

  test('should return a new LinearGradient instance with color stops', () => {
    const colorStops = [
      { offset: 0, color: 'red' },
      { offset: 1, color: 'blue' },
    ];

    const gradient = linearGradient(0, 0, 100, 100, colorStops);
    expect(gradient).toBeInstanceOf(LinearGradient);

    const addColorStopMock = jest.fn();

    const mockContext = {
      createLinearGradient: jest.fn(() => ({
        addColorStop: addColorStopMock,
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gradient.getCanvasGradient(mockContext as any);

    expect(addColorStopMock).toHaveBeenCalledWith(0, 'red');
    expect(addColorStopMock).toHaveBeenCalledWith(1, 'blue');
  });
});
