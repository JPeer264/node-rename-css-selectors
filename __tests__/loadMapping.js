import path from 'path';
import rcs from 'rcs-core';
import fs from 'fs-extra';

import loadMapping from '../lib/mapping/loadMapping';
import reset from './helpers/reset';

const testCwd = path.join(process.cwd(), '/test/files/testCache');

beforeEach(() => {
  reset();
});

afterEach(() => {
  fs.removeSync(testCwd);
});

test('should load from an object', () => {
  loadMapping({
    '.jp-block': 'a-class',
    '#compressed': 'b',
  });

  expect(rcs.selectorsLibrary.get('jp-block')).toBe('a-class');
  expect(rcs.selectorsLibrary.get('#compressed')).toBe('b');
});
