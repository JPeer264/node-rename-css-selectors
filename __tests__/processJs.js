import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';

import rcs from '../lib';
import reset from './helpers/reset';

const testCwd = '__tests__/files/testCache';
const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

beforeAll(() => {
  reset();

  rcsCore.selectorsLibrary.fillLibrary(fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'));
});

afterEach(() => {
  fs.removeSync(testCwd);
});

test('should process js files', (done) => {
  rcs.process.js('js/main.js', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/main.js'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.js'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);

    done();
  });
});

test('should process jsx files', (done) => {
  rcs.process.js('js/react.js', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/react.js'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/react.js'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);

    done();
  });
});

test('should not process jsx files', (done) => {
  rcs.process.js('js/react.js', {
    newPath: testCwd,
    cwd: fixturesCwd,
    espreeOptions: {
      ecmaFeatures: {
        jsx: false,
      },
    },
  }, (err) => {
    expect(err).toBeTruthy();

    done();
  });
});

test('should process complex files', (done) => {
  rcs.process.js('js/complex.js', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/complex.js'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/complex.js'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);

    done();
  });
});

test('should not process multiple files', (done) => {
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

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);
    expect(newFileTwo).toBe(expectedFileTwo);
    expect(newFileThree).toBe(expectedFileThree);

    done();
  });
});
