import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';

import rcs from '../';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

test.beforeEach(() => {
  rcsCore.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.reset();
  rcsCore.keyframesLibrary.reset();
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test('should process css files synchornously', (t) => {
  rcs.process.cssSync('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
  const newFile2 = fs.readFileSync(path.join(testCwd, '/css/style2.css'), 'utf8');
  const newFile3 = fs.readFileSync(path.join(testCwd, '/css/subdirectory/style.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
  const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8');
  const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/css/subdirectory/style.css'), 'utf8');

  t.is(newFile, expectedFile);
  t.is(newFile2, expectedFile2);
  t.is(newFile3, expectedFile3);
});

test('should process css files as arrays synchornously', (t) => {
  rcs.process.cssSync(['**/style.css', '**/style2.css'], {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
  const newFile2 = fs.readFileSync(path.join(testCwd, '/css/style2.css'), 'utf8');
  const newFile3 = fs.readFileSync(path.join(testCwd, '/css/subdirectory/style.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
  const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8');
  const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/css/subdirectory/style.css'), 'utf8');

  t.is(newFile, expectedFile);
  t.is(newFile2, expectedFile2);
  t.is(newFile3, expectedFile3);
});
