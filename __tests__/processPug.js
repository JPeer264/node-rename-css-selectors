import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';

import rcs from '../lib';
import reset from './helpers/reset';

let testCwd;
const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

beforeAll(() => {
  testCwd = tmp.dirSync();

  reset();

  rcsCore.selectorsLibrary.fillLibrary(fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'));
});

afterEach(() => {
  testCwd.removeCallback();
});

test('should process pug files', (done) => {
  rcs.process.pug('pug/index.pug', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd.name, '/pug/index.pug'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/pug/index.pug'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile.trim()).toBe(expectedFile.trim());

    done();
  });
});
