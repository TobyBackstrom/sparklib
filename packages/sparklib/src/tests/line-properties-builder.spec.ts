import { LinearGradientBuilder, LinePropertiesBuilder } from '../lib/builders';
import 'jest-canvas-mock';

describe('LinePropertiesBuilder', () => {
  test('should build with default values', () => {
    const lineProps = new LinePropertiesBuilder().build();

    expect(lineProps.strokeStyle).toBe('black');
    expect(lineProps.lineWidth).toBe(1);
    expect(lineProps.lineDash).toEqual([]);
  });

  test('should build with custom strokeStyle', () => {
    const customStrokeStyle = 'red';
    const lineProps = new LinePropertiesBuilder()
      .setStrokeStyle(customStrokeStyle)
      .build();

    expect(lineProps.strokeStyle).toBe(customStrokeStyle);
  });

  test('should build with custom lineWidth', () => {
    const customLineWidth = 2;
    const lineProps = new LinePropertiesBuilder()
      .setLineWidth(customLineWidth)
      .build();

    expect(lineProps.lineWidth).toBe(customLineWidth);
  });

  test('should build with custom lineDash', () => {
    const customLineDash = [5, 15];
    const lineProps = new LinePropertiesBuilder()
      .setLineDash(customLineDash)
      .build();

    expect(lineProps.lineDash).toEqual(customLineDash);
  });

  test('should build with custom LinearGradient strokeStyle', () => {
    const gradient = new LinearGradientBuilder(0, 0, 1, 1)
      .addColorStop(0, 'white')
      .addColorStop(1, 'black')
      .build();
    const lineProps = new LinePropertiesBuilder()
      .setStrokeStyle(gradient)
      .build();

    expect(lineProps.strokeStyle).toEqual(gradient);
  });
});
