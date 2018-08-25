import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import processSync from '../lib/process/processSync';
import processCssSync from '../lib/processCss/processCssSync';

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

  processCssSync('css/style.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  processSync('**/*.txt', {
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
