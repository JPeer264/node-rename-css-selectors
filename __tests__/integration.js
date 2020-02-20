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

test('issue #19 | detect one file as array', (done) => {
  rcs.process.css('**/style.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, () => {
    rcs.process.html(['html/index.html'], {
      newPath: testCwd.name,
      cwd: fixturesCwd,
    }, (err) => {
      expect(err).toBeFalsy();
      expect(fs.existsSync(path.join(testCwd.name, '/html/index.html'))).toBe(true);
      expect(fs.existsSync(path.join(testCwd.name, '/css/style.css'))).toBe(true);
      expect(fs.existsSync(path.join(testCwd.name, '/css/subdirectory/style.css'))).toBe(true);

      done();
    });
  });
});

test('issue #19 | detect one file', (done) => {
  rcs.process.css('**/style.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, () => {
    rcs.process.html('html/index.html', {
      newPath: testCwd.name,
      cwd: fixturesCwd,
    }, (err) => {
      expect(err).toBeFalsy();
      expect(fs.existsSync(path.join(testCwd.name, '/html/index.html'))).toBe(true);
      expect(fs.existsSync(path.join(testCwd.name, '/css/style.css'))).toBe(true);
      expect(fs.existsSync(path.join(testCwd.name, '/css/subdirectory/style.css'))).toBe(true);
      done();
    });
  });
});

test('issue #21 | with auto', (done) => {
  const issueFixture = path.join(testFiles, 'issue21/fixtures');
  const issueResults = path.join(testFiles, 'issue21/results');

  rcs.process.auto(['style.css', 'index.html'], {
    newPath: testCwd.name,
    cwd: issueFixture,
  }, (err) => {
    expect(err).toBeFalsy();

    const newCss = fs.readFileSync(path.join(testCwd.name, '/style.css'), 'utf8');
    const newHtml = fs.readFileSync(path.join(testCwd.name, '/index.html'), 'utf8');
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
    newPath: testCwd.name,
    cwd: issueFixture,
  }, () => {
    rcs.process.html('index.html', {
      newPath: testCwd.name,
      cwd: issueFixture,
    }, () => {
      const newCss = fs.readFileSync(path.join(testCwd.name, '/style.css'), 'utf8');
      const newHtml = fs.readFileSync(path.join(testCwd.name, '/index.html'), 'utf8');
      const expectedCss = fs.readFileSync(path.join(issueResults, '/style.css'), 'utf8');
      const expectedHtml = fs.readFileSync(path.join(issueResults, '/index.html'), 'utf8');

      expect(newCss).toBe(expectedCss);
      expect(minify(newHtml, { collapseWhitespace: true }))
        .toBe(minify(expectedHtml, { collapseWhitespace: true }));

      done();
    });
  });
});
