import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';

import rcs from '../lib';
import reset from './helpers/reset';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';


test.before(() => {
  reset();

  rcsCore.selectorsLibrary.fillLibrary(fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'));
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test.cb('should process js files', (t) => {
  rcs.process.js('js/main.js', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/main.js'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.js'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});

test.cb('should process jsx files', (t) => {
  rcs.process.js('js/react.js', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/react.js'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/react.js'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});

test.cb('should not process jsx files', (t) => {
  rcs.process.js('js/react.js', {
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
  rcs.process.js('js/complex.js', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/complex.js'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/complex.js'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});

test.cb('should not process multiple files', (t) => {
  rcs.process.js('js/*.js', {
    newPath: testCwd,
    cwd: fixturesCwd,
    jsx: true,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/complex.js'), 'utf8');
    const newFileTwo = fs.readFileSync(path.join(testCwd, '/js/main.js'), 'utf8');
    const newFileThree = fs.readFileSync(path.join(testCwd, '/js/react.js'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/complex.js'), 'utf8');
    const expectedFileTwo = fs.readFileSync(path.join(resultsCwd, '/js/main.js'), 'utf8');
    const expectedFileThree = fs.readFileSync(path.join(resultsCwd, '/js/react.js'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);
    t.is(newFileTwo, expectedFileTwo);
    t.is(newFileThree, expectedFileThree);

    t.end();
  });
});
