import test from 'ava';
import path from 'path';
import rcs from 'rcs-core';
import fs from 'fs-extra';

import loadMapping from '../lib/mapping/loadMapping';

const testCwd = path.join(process.cwd(), '/test/files/testCache');

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test('should load from an object', (t) => {
  loadMapping({
    '.jp-block': 'a-class',
    '#compressed': 'b',
  });

  t.is(rcs.selectorLibrary.get('jp-block'), 'a-class');
  t.is(rcs.selectorLibrary.get('#compressed'), 'b');
});

