import rcsCore from 'rcs-core';

import rcs from '../lib';
import reset from './helpers/reset';

beforeEach(() => {
  reset();
});

test('should load from an object', () => {
  rcs.mapping.load({
    selectors: {
      '.jp-block': 'a-class',
      '#compressed': 'b',
    },
  });

  expect(rcsCore.selectorsLibrary.get('jp-block')).toBe('a-class');
  expect(rcsCore.selectorsLibrary.get('#compressed')).toBe('b');
});
