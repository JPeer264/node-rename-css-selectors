import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';
import { minify } from 'html-minifier';

import rcs from '../';

const testFiles = 'test/files';
const testCwd = path.join(testFiles, 'testCache');
const fixturesCwd = path.join(testFiles, 'fixtures');

test.beforeEach(() => {
  rcsCore.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.reset();
  rcsCore.keyframesLibrary.reset();
});

test.afterEach.always(() => {
  fs.removeSync(testCwd);
});

test.cb('issue #19 | detect one file as array', (t) => {
  rcs.process.css('**/style.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    rcs.process.html(['html/index.html'], {
      newPath: testCwd,
      cwd: fixturesCwd,
    }, (err) => {
      t.falsy(err);
      t.true(fs.existsSync(path.join(testCwd, '/html/index.html')));
      t.true(fs.existsSync(path.join(testCwd, '/css/style.css')));
      t.true(fs.existsSync(path.join(testCwd, '/css/subdirectory/style.css')));
      t.end();
    });
  });
});

test.cb('issue #19 | detect one file', (t) => {
  rcs.process.css('**/style.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    rcs.process.html('html/index.html', {
      newPath: testCwd,
      cwd: fixturesCwd,
    }, (err) => {
      t.falsy(err);
      t.true(fs.existsSync(path.join(testCwd, '/html/index.html')));
      t.true(fs.existsSync(path.join(testCwd, '/css/style.css')));
      t.true(fs.existsSync(path.join(testCwd, '/css/subdirectory/style.css')));
      t.end();
    });
  });
});

test.cb('issue #21 | with auto', (t) => {
  const issueFixture = path.join(testFiles, 'issue21/fixtures');
  const issueResults = path.join(testFiles, 'issue21/results');

  rcs.process.auto(['style.css', 'index.html'], {
    newPath: testCwd,
    cwd: issueFixture,
  }, (err) => {
    t.falsy(err);

    const newCss = fs.readFileSync(path.join(testCwd, '/style.css'), 'utf8');
    const newHtml = fs.readFileSync(path.join(testCwd, '/index.html'), 'utf8');
    const expectedCss = fs.readFileSync(path.join(issueResults, '/style.css'), 'utf8');
    const expectedHtml = fs.readFileSync(path.join(issueResults, '/index.html'), 'utf8');

    t.is(newCss, expectedCss);
    t.is(
      minify(newHtml, { collapseWhitespace: true }),
      minify(expectedHtml, { collapseWhitespace: true }),
    );

    t.end();
  });
});

test.cb('issue #21 | with seperated process functions', (t) => {
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

      t.is(newCss, expectedCss);
      t.is(
        minify(newHtml, { collapseWhitespace: true }),
        minify(expectedHtml, { collapseWhitespace: true }),
      );

      t.end();
    });
  });
});
