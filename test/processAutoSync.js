import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import { process } from '..';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test('should process all files synchronously', (t) => {
  let newFile;
  let expectedFile;

  process.cssSync('css/style.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  process.anySync('**/*.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  newFile = fs.readFileSync(path.join(testCwd, '/js/main.txt'), 'utf8');
  expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.txt'), 'utf8');

  t.is(newFile, expectedFile);

  newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
  expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');

  t.is(newFile, expectedFile);
});
