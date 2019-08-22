import test from 'ava';
import path from 'path';
import rcs from 'rcs-core';
import fs from 'fs-extra';

import loadMapping from '../lib/mapping/loadMapping';

const testCwd = path.join(process.cwd(), '/test/files/testCache');

test.beforeEach(() => {
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test('should load from an object', (t) => {
  loadMapping({
    class: {
      '.jp-block': 'a-class',
    },
    id: {
      '#compressed': 'b',
    },
  });

  t.is(rcs.selectorsLibrary.get('jp-block'), 'a-class');
  t.is(rcs.selectorsLibrary.get('#compressed'), 'b');
});

