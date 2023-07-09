import { createGradientColorScale } from '../lib/utils/create-gradient-color-scale';

describe('createGradientColorScale', () => {
  it('should create a valid color scale with normal inputs', () => {
    const domain: [number, number] = [0, 10];
    const colors = ['red', 'blue', 'green'];
    const numColorLevels = 5;

    const colorScale = createGradientColorScale(domain, colors, numColorLevels);

    expect(colorScale).toBeInstanceOf(Function);
    expect(colorScale.domain()).toEqual(domain);
    expect(colorScale.range().length).toBe(numColorLevels);
  });

  it('should handle an empty colors array', () => {
    const domain: [number, number] = [0, 10];
    const colors: string[] = [];
    const numColorLevels = 5;

    expect(() =>
      createGradientColorScale(domain, colors, numColorLevels),
    ).toThrow();
  });

  it('should handle a zero numColorLevels', () => {
    const domain: [number, number] = [0, 10];
    const colors = ['red', 'blue', 'green'];
    const numColorLevels = 0;

    expect(() =>
      createGradientColorScale(domain, colors, numColorLevels),
    ).toThrow();
  });

  it('should handle a negative numColorLevels', () => {
    const domain: [number, number] = [0, 10];
    const colors = ['red', 'blue', 'green'];
    const numColorLevels = -5;

    expect(() =>
      createGradientColorScale(domain, colors, numColorLevels),
    ).toThrow();
  });

  it('should handle a domain where max is less than min', () => {
    const domain: [number, number] = [10, 0];
    const colors = ['red', 'blue', 'green'];
    const numColorLevels = 5;

    expect(() =>
      createGradientColorScale(domain, colors, numColorLevels),
    ).toThrow();
  });
});
