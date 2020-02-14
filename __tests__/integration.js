import path from 'path';
import fs from 'fs-extra';
import { minify } from 'html-minifier';

import rcs from '../lib';
import reset from './helpers/reset';

const testFiles = '__tests__/files';
const testCwd = path.join(testFiles, 'testCache');
const fixturesCwd = path.join(testFiles, 'fixtures');

beforeEach(() => {
  reset();
});

afterEach(() => {
  fs.removeSync(testCwd);
});

test('issue #19 | detect one file as array', (done) => {
  rcs.process.css('**/style.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    rcs.process.html(['html/index.html'], {
      newPath: testCwd,
      cwd: fixturesCwd,
    }, (err) => {
      expect(err).toBeFalsy();
      expect(fs.existsSync(path.join(testCwd, '/html/index.html'))).toBe(true);
      expect(fs.existsSync(path.join(testCwd, '/css/style.css'))).toBe(true);
      expect(fs.existsSync(path.join(testCwd, '/css/subdirectory/style.css'))).toBe(true);

      done();
    });
  });
});

test('issue #19 | detect one file', (done) => {
  rcs.process.css('**/style.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    rcs.process.html('html/index.html', {
      newPath: testCwd,
      cwd: fixturesCwd,
    }, (err) => {
      expect(err).toBeFalsy();
      expect(fs.existsSync(path.join(testCwd, '/html/index.html'))).toBe(true);
      expect(fs.existsSync(path.join(testCwd, '/css/style.css'))).toBe(true);
      expect(fs.existsSync(path.join(testCwd, '/css/subdirectory/style.css'))).toBe(true);
      done();
    });
  });
});

test('issue #21 | with auto', (done) => {
  const issueFixture = path.join(testFiles, 'issue21/fixtures');
  const issueResults = path.join(testFiles, 'issue21/results');

  rcs.process.auto(['style.css', 'index.html'], {
    newPath: testCwd,
    cwd: issueFixture,
  }, (err) => {
    expect(err).toBeFalsy();

    const newCss = fs.readFileSync(path.join(testCwd, '/style.css'), 'utf8');
    const newHtml = fs.readFileSync(path.join(testCwd, '/index.html'), 'utf8');
    const expectedCss = fs.readFileSync(path.join(issueResults, '/style.css'), 'utf8');
    const expectedHtml = fs.readFileSync(path.join(issueResults, '/index.html'), 'utf8');

    expect(newCss).toBe(expectedCss);
    expect(minify(newHtml, { collapseWhitespace: true }))
      .toBe(minify(expectedHtml, { collapseWhitespace: true }));

    done();
  });
});

test('issue #21 | with seperated process functions', (done) => {
  const issueFixture = path.join(testFiles, 'issue21/fixtures');
  const issueResults = path.join(testFiles, 'issue21/results');

  rcs.process.css('style.css', {
    newPath: testCwd,
    cwd: issueFixture,
  }, () => {
    rcs.process.html('index.html', {
      newPath: testCwd,
      cwd: issueFixture,
    }, () => {
      const newCss = fs.readFileSync(path.join(testCwd, '/style.css'), 'utf8');
      const newHtml = fs.readFileSync(path.join(testCwd, '/index.html'), 'utf8');
      const expectedCss = fs.readFileSync(path.join(issueResults, '/style.css'), 'utf8');
      const expectedHtml = fs.readFileSync(path.join(issueResults, '/index.html'), 'utf8');

      expect(newCss).toBe(expectedCss);
      expect(minify(newHtml, { collapseWhitespace: true }))
        .toBe(minify(expectedHtml, { collapseWhitespace: true }));

      done();
    });
  });
});
