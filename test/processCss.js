import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import processCss from '../lib/processCss/processCss';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test.cb('should process css files and prefix them', (t) => {
  processCss('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
    prefix: 'prefixed-',
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style-prefix.css'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});

test.cb('should process css files with processCss', (t) => {
  processCss('**/style*.css', {
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

test.cb('should process css files without options', (t) => {
  processCss(path.join(fixturesCwd, '/**/style*.css'), (err) => {
    const newFile = fs.readFileSync(path.join('./rcs/', fixturesCwd, '/css/style.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    fs.removeSync('./rcs');

    t.end();
  });
});

test.cb('should replace the selector attributes correctly', (t) => {
  processCss('css/css-attributes.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    t.is(fs.readFileSync(path.join(testCwd, '/css/css-attributes.css'), 'utf8'), fs.readFileSync(path.join(resultsCwd, '/css/css-attributes.css'), 'utf8'));

    t.end();
  });
});

test.cb('should replace the selector attributes with pre and suffixes correctly', (t) => {
  processCss('css/css-attributes.css', {
    prefix: 'prefix-',
    suffix: '-suffix',
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    t.is(fs.readFileSync(path.join(testCwd, '/css/css-attributes.css'), 'utf8'), fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-pre-suffix.css'), 'utf8'));

    t.end();
  });
});

test.cb('should replace the selector attributes without caring about attribute selectors', (t) => {
  processCss('css/css-attributes.css', {
    prefix: 'prefix-',
    suffix: '-suffix',
    ignoreAttributeSelectors: true,
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    t.is(fs.readFileSync(path.join(testCwd, '/css/css-attributes.css'), 'utf8'), fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-ignore.css'), 'utf8'));

    t.end();
  });
});
