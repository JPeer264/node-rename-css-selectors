import rcs from 'rcs-core';

import loadMapping from '../lib/mapping/loadMapping';
import reset from './helpers/reset';

beforeEach(() => {
  reset();
});

test('should load from an object', () => {
  loadMapping({
    '.jp-block': 'a-class',
    '#compressed': 'b',
  });

  expect(rcs.selectorsLibrary.get('jp-block')).toBe('a-class');
  expect(rcs.selectorsLibrary.get('#compressed')).toBe('b');
});
