import path from 'path';
import fs from 'fs-extra';
import { minify } from 'html-minifier';

import rcs from '../lib';
import reset from './helpers/reset';

const testCwd = '__tests__/files/testCache';
const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

beforeEach(() => {
  reset();
});

afterEach(() => {
  fs.removeSync(testCwd);
});

test('should process all files synchronously', () => {
  let newFile;
  let expectedFile;

  rcs.process.autoSync(['**/*.js', 'css/style.css'], {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  newFile = fs.readFileSync(path.join(testCwd, '/js/main.js'), 'utf8');
  expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.js'), 'utf8');

  expect(newFile).toBe(expectedFile);

  newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
  expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');

  expect(newFile).toBe(expectedFile);
});

test('should fillLibraries from html and css | issue #38', () => {
  rcs.process.autoSync(['**/*.{js,html}', 'css/style.css'], {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/html/index-with-style.html'), 'utf8');
  const newFile2 = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index-with-style.html'), 'utf8');
  const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');

  expect(minify(newFile, { collapseWhitespace: true }))
    .toBe(minify(expectedFile, { collapseWhitespace: true }));
  expect(minify(newFile2, { collapseWhitespace: true }))
    .toBe(minify(expectedFile2, { collapseWhitespace: true }));
});
