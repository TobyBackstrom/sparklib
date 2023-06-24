import { lineProperties, LinearGradientBuilder } from '../lib/models';

describe('lineProperties', () => {
  test('should create a builder with default values', () => {
    const builder = lineProperties();

    const lineProps = builder.build();

    expect(lineProps.strokeStyle).toBe('black');
    expect(lineProps.lineWidth).toBe(1);
    expect(lineProps.lineDash).toEqual([]);
  });

  test('should create a builder with custom strokeStyle', () => {
    const customStrokeStyle = 'red';
    const builder = lineProperties(customStrokeStyle);

    const lineProps = builder.build();

    expect(lineProps.strokeStyle).toBe(customStrokeStyle);
  });

  test('should create a builder with custom lineWidth', () => {
    const customLineWidth = 2;
    const builder = lineProperties(undefined, customLineWidth);

    const lineProps = builder.build();

    expect(lineProps.lineWidth).toBe(customLineWidth);
  });

  test('should create a builder with custom lineDash', () => {
    const customLineDash = [5, 15];
    const builder = lineProperties(undefined, undefined, customLineDash);

    const lineProps = builder.build();

    expect(lineProps.lineDash).toEqual(customLineDash);
  });

  test('should create a builder with custom LinearGradient strokeStyle', () => {
    const gradient = new LinearGradientBuilder(0, 0, 1, 1)
      .addColorStop(0, 'white')
      .addColorStop(1, 'black')
      .build();
    const builder = lineProperties(gradient);

    const lineProps = builder.build();

    expect(lineProps.strokeStyle).toEqual(gradient);
  });
});
