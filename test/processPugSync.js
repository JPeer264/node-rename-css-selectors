import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';

import rcs from '../';
import reset from './helpers/reset';

const testCwd = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';


test.before(() => {
  reset();

  rcsCore.selectorsLibrary.fillLibrary(fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'));
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test('should process pug files', (t) => {
  rcs.process.pugSync('pug/index.pug', {
    newPath: testCwd,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd, '/pug/index.pug'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/pug/index.pug'), 'utf8');

  t.is(newFile.trim(), expectedFile.trim());
});
