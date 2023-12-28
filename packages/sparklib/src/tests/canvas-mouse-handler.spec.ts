import { MouseEventType, ChartMouseEvent } from '../lib';
import { CanvasMouseHandler } from '../lib/utils/canvas-mouse-handler';

describe('CanvasMouseHandler', () => {
  let canvas: HTMLCanvasElement;
  let mouseHandler: CanvasMouseHandler;

  beforeEach(() => {
    canvas = document.createElement('canvas');

    canvas.width = 100;
    canvas.height = 100;

    canvas.getBoundingClientRect = jest.fn(() => ({
      left: 10,
      top: 10,
      right: 110,
      bottom: 110,
      width: 100,
      height: 100,
      x: 10,
      y: 10,
      toJSON: () => {
        return {
          left: 10,
          top: 10,
          right: 110,
          bottom: 110,
          width: 100,
          height: 100,
          x: 10,
          y: 10,
        };
      },
    }));

    mouseHandler = new CanvasMouseHandler();
    mouseHandler.setCanvas(canvas).setValueLength(100);
  });

  it('should initialize correctly', () => {
    expect(mouseHandler).toBeDefined();
  });

  it('should add event listeners', () => {
    const mockHandler = jest.fn();
    mouseHandler.addEventListener(MouseEventType.Click, mockHandler);

    canvas.dispatchEvent(new MouseEvent('click'));
    expect(mockHandler).toHaveBeenCalled();
  });

  it('should handle mouse click event', () => {
    const mockClickHandler = jest.fn();
    mouseHandler.addEventListener(MouseEventType.Click, mockClickHandler);

    // Create a new mouse event
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      clientX: 20,
      clientY: 10,
    });

    // Dispatch the event on the canvas
    canvas.dispatchEvent(clickEvent);

    // Check if the handler was called
    expect(mockClickHandler).toHaveBeenCalled();

    const callArgs = mockClickHandler.mock.calls[0]; // Assuming it's the first call
    const eventTypeArg = callArgs[0].eventType; // eventType argument

    // Check if eventTypeArg is a valid value of MouseEventType
    expect(Object.values(MouseEventType)).toContain(eventTypeArg);

    expect(callArgs).toEqual([expect.any(ChartMouseEvent)]);
    expect(mockClickHandler.mock.calls[0][0].x).toBe(10);
    expect(mockClickHandler.mock.calls[0][0].y).toBe(0);
    expect(mockClickHandler.mock.calls[0][0].mouseEvent.clientX).toBe(20);
    expect(mockClickHandler.mock.calls[0][0].mouseEvent.clientY).toBe(10);
  });

  it('should remove event listeners', () => {
    const mockHandler = jest.fn();
    mouseHandler.addEventListener(MouseEventType.Click, mockHandler);
    mouseHandler.removeEventListener(MouseEventType.Click);

    canvas.dispatchEvent(new MouseEvent('click'));
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should preprocess events before dispatching to the listener', () => {
    // Check preprocessing
  });

  it('should clean up event listeners on dispose', () => {
    const mockHandler = jest.fn();
    mouseHandler.addEventListener(MouseEventType.Click, mockHandler);
    mouseHandler.dispose();

    canvas.dispatchEvent(new MouseEvent('click'));
    expect(mockHandler).not.toHaveBeenCalled();
  });
});
