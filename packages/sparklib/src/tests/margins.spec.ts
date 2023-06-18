import { margins } from '../lib/models/margins';

describe('MarginsBuilder', () => {
  it('should correctly build a margins type', () => {
    const result = margins().bottom(5).left(10).right(15).top(20).build();

    expect(result).toEqual({
      bottom: 5,
      left: 10,
      right: 15,
      top: 20,
    });
  });
});
