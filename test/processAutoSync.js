import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';

import rcs from '../';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

test.beforeEach(() => {
  rcsCore.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.nameGenerator.reset();
  rcsCore.selectorLibrary.reset();
  rcsCore.keyframesLibrary.reset();
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test('should process all files synchronously', (t) => {
  let newFile;
  let expectedFile;

  rcs.process.autoSync(['**/*.js', 'css/style.css'], {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  newFile = fs.readFileSync(path.join(testCwd, '/js/main.js'), 'utf8');
  expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.js'), 'utf8');

  t.is(newFile, expectedFile);

  newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
  expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');

  t.is(newFile, expectedFile);
});
