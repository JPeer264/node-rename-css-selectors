import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';

import rcs from '../';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';

test.beforeEach(() => {
  rcsCore.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.nameGenerator.reset();
  rcsCore.selectorLibrary.reset();
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
