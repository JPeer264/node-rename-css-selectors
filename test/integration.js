import test from 'ava';
import fs from 'fs-extra';
import rcs from 'rcs-core';
import path from 'path';

import app from '..';

const testCwd = './test/files/testCache';
const fixturesCwd = './test/files/fixtures';
const resultsCwd = './test/files/results';

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test.cb('processing | should process js files', (t) => {
  rcs.selectorLibrary.fillLibrary(fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'));

  app.process('**/*.txt', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/js/main.txt'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.txt'), 'utf8');

    t.falsy(err);
    t.is(newFile, expectedFile);

    t.end();
  });
});


test.cb('processing | should process html files', (t) => {
  rcs.selectorLibrary.fillLibrary(fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'));

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
