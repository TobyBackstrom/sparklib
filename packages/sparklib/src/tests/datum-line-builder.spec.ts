import {
  LinePropertiesBuilder,
  lineProperties,
  DatumLineBuilder,
} from '../lib/builders';

describe('DatumLineBuilder', () => {
  test('should create a DatumLine with default values', () => {
    const linePropertiesBuilder = new LinePropertiesBuilder();
    const datumLineBuilder = new DatumLineBuilder(linePropertiesBuilder);

    const datumLine = datumLineBuilder.build();

    expect(datumLine.position).toBe(0);
    expect(datumLine.lineProperties.strokeStyle).toBe('black');
    expect(datumLine.lineProperties.lineWidth).toBe(1);
    expect(datumLine.lineProperties.lineDash).toEqual([]);
  });

  test('should create a DatumLine with custom position', () => {
    const linePropertiesBuilder = new LinePropertiesBuilder();
    const datumLineBuilder = new DatumLineBuilder(
      linePropertiesBuilder,
    ).setPosition(10);

    const datumLine = datumLineBuilder.build();

    expect(datumLine.position).toBe(10);
  });

  test('should create a DatumLine with custom lineProperties', () => {
    const linePropertiesBuilder = lineProperties('red', 2, [5, 15]);
    const datumLineBuilder = new DatumLineBuilder(linePropertiesBuilder);

    const datumLine = datumLineBuilder.build();

    expect(datumLine.lineProperties.strokeStyle).toBe('red');
    expect(datumLine.lineProperties.lineWidth).toBe(2);
    expect(datumLine.lineProperties.lineDash).toEqual([5, 15]);
  });
});
