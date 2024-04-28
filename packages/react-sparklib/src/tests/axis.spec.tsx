import { render } from '@testing-library/react';
import { Axis } from '../lib/axis';

describe('Axis', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Axis />);
    expect(baseElement).toBeTruthy();
  });
});
