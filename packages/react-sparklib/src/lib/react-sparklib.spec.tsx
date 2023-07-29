import { render } from '@testing-library/react';

import ReactSparklib from './react-sparklib';

describe('ReactSparklib', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<ReactSparklib />);
    expect(baseElement).toBeTruthy();
  });
  
});
