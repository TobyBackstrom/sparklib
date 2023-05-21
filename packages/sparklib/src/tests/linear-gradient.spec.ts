import { LinearGradient, linearGradient } from '../lib/linear-gradient';
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
});

describe('linearGradient', () => {
  test('should return a new LinearGradient instance', () => {
    const gradient = linearGradient(0, 0, 100, 100);
    expect(gradient).toBeInstanceOf(LinearGradient);
  });
});
