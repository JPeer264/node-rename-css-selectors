import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import { processJs } from '../';

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

test.cb('should process js files', (t) => {
  processJs('js/main.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/main.txt'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.txt'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});

test.cb('should process jsx files', (t) => {
  processJs('js/react.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/react.txt'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/react.txt'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});

test.cb('should not process jsx files', (t) => {
  processJs('js/react.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
    parserOptions: {
      ecmaFeatures: {
        jsx: false,
      },
    },
  }, (err) => {
    t.truthy(err);

    t.end();
  });
});

test.cb('should process complex files', (t) => {
  processJs('js/complex.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/complex.txt'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});

test.cb('should not process multiple files', (t) => {
  processJs('js/*.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
    jsx: true,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/complex.txt'), 'utf8');
    const newFileTwo = fs.readFileSync(path.join(testCwd, '/js/main.txt'), 'utf8');
    const newFileThree = fs.readFileSync(path.join(testCwd, '/js/react.txt'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/complex.txt'), 'utf8');
    const expectedFileTwo = fs.readFileSync(path.join(resultsCwd, '/js/main.txt'), 'utf8');
    const expectedFileThree = fs.readFileSync(path.join(resultsCwd, '/js/react.txt'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);
    t.is(newFileTwo, expectedFileTwo);
    t.is(newFileThree, expectedFileThree);

    t.end();
  });
});
