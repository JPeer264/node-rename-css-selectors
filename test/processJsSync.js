import test from 'ava';
import fs from 'fs-extra';
import rcs from 'rcs-core';
import path from 'path';

import { process } from '../';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

test.before(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();

  rcs.selectorLibrary.fillLibrary(fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'));
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test('should process js files', (t) => {
  process.jsSync('js/main.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/js/main.txt'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.txt'), 'utf8');

  t.is(newFile, expectedFile);
});

test('should process jsx files', (t) => {
  process.jsSync('js/react.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
    jsx: true,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/js/react.txt'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/react.txt'), 'utf8');

  t.is(newFile, expectedFile);
});

test('should not process jsx files', (t) => {
  process.jsSync('js/react.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/js/react.txt'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(testCwd, '/js/react.txt'), 'utf8');

  t.is(newFile, expectedFile);
});

test('should process complex files', (t) => {
  process.jsSync('js/complex.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/js/complex.txt'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(testCwd, '/js/complex.txt'), 'utf8');

  t.is(newFile, expectedFile);
});

test('should not process multiple files', (t) => {
  process.jsSync('js/*.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
    jsx: true,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/js/complex.txt'), 'utf8');
  const newFileTwo = fs.readFileSync(path.join(testCwd, '/js/main.txt'), 'utf8');
  const newFileThree = fs.readFileSync(path.join(testCwd, '/js/react.txt'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8');
  const expectedFileTwo = fs.readFileSync(path.join(resultsCwd, '/js/main.txt'), 'utf8');
  const expectedFileThree = fs.readFileSync(path.join(resultsCwd, '/js/react.txt'), 'utf8');

  t.is(newFile, expectedFile);
  t.is(newFileTwo, expectedFileTwo);
  t.is(newFileThree, expectedFileThree);
});
