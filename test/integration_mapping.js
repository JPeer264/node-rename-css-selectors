import test from 'ava';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';
import path from 'path';
import json from 'json-extra';
import { minify } from 'html-minifier';

import rcs from '../';

const testCwd = './test/files/testCache';
const fixturesCwd = './test/files/fixtures';
const resultsCwd = './test/files/results';

test.beforeEach.cb((t) => {
  rcsCore.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.reset();
  rcsCore.keyframesLibrary.reset();

  rcs.process.css('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    rcs.generateMapping(testCwd, () => {
      rcsCore.selectorsLibrary.reset();
      rcsCore.keyframesLibrary.reset();

      t.end();
    });
  });
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test.cb('should load from an object', (t) => {
  const cssMapping = json.readToObjSync(path.join(testCwd, '/renaming_map.json'), 'utf8');

  rcs.loadMapping(cssMapping);

  rcs.process.html('**/*.html', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    t.falsy(err);
    t.is(
      minify(newFile, { collapseWhitespace: true }),
      minify(expectedFile, { collapseWhitespace: true }),
    );

    t.end();
  });
});

test.cb('should load from a filestring', (t) => {
  rcs.loadMapping(path.join(testCwd, '/renaming_map.json'));

  rcs.process.html('**/*.html', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    t.falsy(err);
    t.is(
      minify(newFile, { collapseWhitespace: true }),
      minify(expectedFile, { collapseWhitespace: true }),
    );

    t.end();
  });
});

test.cb('should load nothing as it does not exist', (t) => {
  rcs.loadMapping(path.join(testCwd, '/doesnotexist.json'));

  rcs.process.html('**/*.html', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    t.falsy(err);
    t.not(
      minify(newFile, { collapseWhitespace: true }),
      minify(expectedFile, { collapseWhitespace: true }),
    );

    t.end();
  });
});

test.cb('should load from a filestring', (t) => {
  rcs.process.css('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    rcs.generateMapping(testCwd, { cssMappingMin: true }, () => {
      rcsCore.selectorsLibrary.reset();
      rcsCore.keyframesLibrary.reset();

      rcs.loadMapping(path.join(testCwd, '/renaming_map_min.json'), { origValues: false });

      rcs.process.html('**/*.html', {
        newPath: testCwd,
        cwd: fixturesCwd,
      }, (err) => {
        const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
        const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

        t.falsy(err);
        t.is(
          minify(newFile, { collapseWhitespace: true }),
          minify(expectedFile, { collapseWhitespace: true }),
        );

        t.end();
      });
    });
  });
});
