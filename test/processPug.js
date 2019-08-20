import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';

import rcs from '../';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';


test.before(() => {
  rcsCore.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.reset();
  rcsCore.keyframesLibrary.reset();

  rcsCore.selectorsLibrary.fillLibrary(fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'));
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test.cb('should process pug files', (t) => {
  rcs.process.pug('pug/index.pug', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/pug/index.pug'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/pug/index.pug'), 'utf8');

    t.falsy(err);
    t.is(newFile.trim(), expectedFile.trim());

    t.end();
  });
});
