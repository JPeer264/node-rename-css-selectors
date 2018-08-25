import test from 'ava';
import fs from 'fs-extra';
import rcs from 'rcs-core';
import path from 'path';
import json from 'json-extra';

import app from '..';

const testCwd = './test/files/testCache';
const fixturesCwd = './test/files/fixtures';
const resultsCwd = './test/files/results';

test.beforeEach.cb((t) => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();

  app.processCss('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    app.generateMapping(testCwd, () => {
      rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
      rcs.nameGenerator.reset();
      rcs.selectorLibrary.reset();
      rcs.keyframesLibrary.reset();

      t.end();
    });
  });
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test.cb('should load from an object', (t) => {
  const cssMapping = json.readToObjSync(path.join(testCwd, '/renaming_map.json'), 'utf8');

  app.loadMapping(cssMapping);

  app.process('**/*.html', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});

test.cb('should load from a filestring', (t) => {
  app.loadMapping(path.join(testCwd, '/renaming_map.json'));

  app.process('**/*.html', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});

test.cb('should load nothing as it does not exist', (t) => {
  app.loadMapping(path.join(testCwd, '/doesnotexist.json'));

  app.process('**/*.html', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    t.falsy(err);
    t.not(newFile, expectedFile);

    t.end();
  });
});

test.cb('should load from a filestring', (t) => {
  app.processCss('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    app.generateMapping(testCwd, { cssMappingMin: true }, () => {
      rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
      rcs.nameGenerator.reset();
      rcs.selectorLibrary.reset();
      rcs.keyframesLibrary.reset();

      app.loadMapping(path.join(testCwd, '/renaming_map_min.json'), { origValues: false });

      app.process('**/*.html', {
        newPath: testCwd,
        cwd: fixturesCwd,
      }, (err) => {
        const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
        const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

        t.falsy(err);
        t.is(newFile, expectedFile);

        t.end();
      });
    });
  });
});
