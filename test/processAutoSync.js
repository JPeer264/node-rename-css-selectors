import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';
import { minify } from 'html-minifier';

import rcs from '../';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

test.beforeEach(() => {
  rcsCore.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.reset();
  rcsCore.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.keyframesLibrary.reset();
  rcsCore.cssVariablesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.cssVariablesLibrary.reset();
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

test('should fillLibraries from html and css | issue #38', (t) => {
  rcs.process.autoSync(['**/*.{js,html}', 'css/style.css'], {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/html/index-with-style.html'), 'utf8');
  const newFile2 = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index-with-style.html'), 'utf8');
  const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');

  t.is(
    minify(newFile, { collapseWhitespace: true }),
    minify(expectedFile, { collapseWhitespace: true }),
  );
  t.is(
    minify(newFile2, { collapseWhitespace: true }),
    minify(expectedFile2, { collapseWhitespace: true }),
  );
});
