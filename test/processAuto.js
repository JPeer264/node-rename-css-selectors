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
  rcsCore.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.nameGenerator.reset();
  rcsCore.selectorLibrary.reset();
  rcsCore.keyframesLibrary.reset();
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test.cb('should process css files', (t) => {
  rcs.process.auto('**/style*.css', {
    collectSelectors: true,
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
    const newFile2 = fs.readFileSync(path.join(testCwd, '/css/style2.css'), 'utf8');
    const newFile3 = fs.readFileSync(path.join(testCwd, '/css/subdirectory/style.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
    const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8');
    const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/css/subdirectory/style.css'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);
    t.is(newFile2, expectedFile2);
    t.is(newFile3, expectedFile3);

    t.end();
  });
});

test.cb('processing | should process all files automatically', (t) => {
  rcs.process.auto(['**/*.{js,html}', 'css/style.css'], {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/main.js'), 'utf8');
    const newFile2 = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
    const newFile3 = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.js'), 'utf8');
    const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
    const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);
    t.is(newFile2, expectedFile2);
    t.is(
      minify(newFile3, { collapseWhitespace: true }),
      minify(expectedFile3, { collapseWhitespace: true }),
    );

    t.end();
  });
});

test.cb('should process css files as arrays', (t) => {
  rcs.process.auto(['**/style.css', '**/style2.css'], {
    collectSelectors: true,
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
    const newFile2 = fs.readFileSync(path.join(testCwd, '/css/style2.css'), 'utf8');
    const newFile3 = fs.readFileSync(path.join(testCwd, '/css/subdirectory/style.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
    const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8');
    const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/css/subdirectory/style.css'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);
    t.is(newFile2, expectedFile2);
    t.is(newFile3, expectedFile3);

    t.end();
  });
});

test.cb('should not overwrite original files', (t) => {
  rcs.process.auto(['**/style.css', '**/style2.css'], {
    collectSelectors: true,
    newPath: fixturesCwd,
    cwd: fixturesCwd,
  }, (err) => {
    t.is(err.message, 'File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');

    t.end();
  });
});

test.cb('should fail', (t) => {
  rcs.process.auto('path/**/with/nothing/in/it', (err) => {
    t.truthy(err);
    t.is(err.error, 'ENOENT');

    t.end();
  });
});
