import { lineProperties, datumLine } from '../lib/builders';

describe('datumLine', () => {
  test('should create a DatumLineBuilder with default values', () => {
    const builder = datumLine();

    const line = builder.build();

    expect(line.position).toBe(0);
    expect(line.lineProperties.strokeStyle).toBe('black');
    expect(line.lineProperties.lineWidth).toBe(1);
    expect(line.lineProperties.lineDash).toEqual([]);
  });

  test('should create a DatumLineBuilder with custom position', () => {
    const builder = datumLine(10);

    const line = builder.build();

    expect(line.position).toBe(10);
  });

  test('should create a DatumLineBuilder with custom lineProperties', () => {
    const linePropertiesBuilder = lineProperties('red', 2, [5, 15]);
    const builder = datumLine(undefined, linePropertiesBuilder);

    const line = builder.build();

    expect(line.lineProperties.strokeStyle).toBe('red');
    expect(line.lineProperties.lineWidth).toBe(2);
    expect(line.lineProperties.lineDash).toEqual([5, 15]);
  });
});
