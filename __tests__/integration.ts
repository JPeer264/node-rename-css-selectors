import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import { minify } from 'html-minifier';

import rcs from '../lib';
import reset from './helpers/reset';

let testCwd;
const testFiles = '__tests__/files';
const fixturesCwd = path.join(testFiles, 'fixtures');

beforeEach(() => {
  testCwd = tmp.dirSync();

  reset();
});

afterEach(() => {
  testCwd.removeCallback();
});

test('issue #19 | detect one file as array', async () => {
  await rcs.process.css('**/style.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  await rcs.process.html(['html/index.html'], {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  expect(fs.existsSync(path.join(testCwd.name, '/html/index.html'))).toBe(true);
  expect(fs.existsSync(path.join(testCwd.name, '/css/style.css'))).toBe(true);
  expect(fs.existsSync(path.join(testCwd.name, '/css/subdirectory/style.css'))).toBe(true);
});

test('issue #19 | detect one file', async () => {
  await rcs.process.css('**/style.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  await rcs.process.html('html/index.html', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  expect(fs.existsSync(path.join(testCwd.name, '/html/index.html'))).toBe(true);
  expect(fs.existsSync(path.join(testCwd.name, '/css/style.css'))).toBe(true);
  expect(fs.existsSync(path.join(testCwd.name, '/css/subdirectory/style.css'))).toBe(true);
});

test('issue #21 | with auto', async () => {
  const issueFixture = path.join(testFiles, 'issue21/fixtures');
  const issueResults = path.join(testFiles, 'issue21/results');

  await rcs.process.auto(['style.css', 'index.html'], {
    newPath: testCwd.name,
    cwd: issueFixture,
  });

  const newCss = fs.readFileSync(path.join(testCwd.name, '/style.css'), 'utf8');
  const newHtml = fs.readFileSync(path.join(testCwd.name, '/index.html'), 'utf8');
  const expectedCss = fs.readFileSync(path.join(issueResults, '/style.css'), 'utf8');
  const expectedHtml = fs.readFileSync(path.join(issueResults, '/index.html'), 'utf8');

  expect(newCss).toBe(expectedCss);
  expect(minify(newHtml, { collapseWhitespace: true }))
    .toBe(minify(expectedHtml, { collapseWhitespace: true }));
});

test('issue #21 | with seperated process functions', async () => {
  const issueFixture = path.join(testFiles, 'issue21/fixtures');
  const issueResults = path.join(testFiles, 'issue21/results');

  await rcs.process.css('style.css', {
    newPath: testCwd.name,
    cwd: issueFixture,
  });

  await rcs.process.html('index.html', {
    newPath: testCwd.name,
    cwd: issueFixture,
  });

  const newCss = fs.readFileSync(path.join(testCwd.name, '/style.css'), 'utf8');
  const newHtml = fs.readFileSync(path.join(testCwd.name, '/index.html'), 'utf8');
  const expectedCss = fs.readFileSync(path.join(issueResults, '/style.css'), 'utf8');
  const expectedHtml = fs.readFileSync(path.join(issueResults, '/index.html'), 'utf8');

  expect(newCss).toBe(expectedCss);
  expect(minify(newHtml, { collapseWhitespace: true }))
    .toBe(minify(expectedHtml, { collapseWhitespace: true }));
});

test('issue #70 | line breaks', async () => {
  const issueFixture = path.join(testFiles, 'issue70/fixtures');
  const issueResults = path.join(testFiles, 'issue70/results');

  await rcs.process.css('style.css', {
    newPath: testCwd.name,
    cwd: issueFixture,
  });

  await rcs.process.html('index.html', {
    newPath: testCwd.name,
    cwd: issueFixture,
  });

  const newCss = fs.readFileSync(path.join(testCwd.name, '/style.css'), 'utf8');
  const newHtml = fs.readFileSync(path.join(testCwd.name, '/index.html'), 'utf8');
  const expectedCss = fs.readFileSync(path.join(issueResults, '/style.css'), 'utf8');
  const expectedHtml = fs.readFileSync(path.join(issueResults, '/index.html'), 'utf8');

  expect(newCss).toBe(expectedCss);
  expect(minify(newHtml, { collapseWhitespace: true }))
    .toBe(minify(expectedHtml, { collapseWhitespace: true }));
});
