import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';

import rcs from '../lib';
import reset from './helpers/reset';

let testCwd;
const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

beforeEach(() => {
  testCwd = tmp.dirSync();

  reset();
});

afterEach(() => {
  testCwd.removeCallback();
});

test('should process css files synchornously', () => {
  rcs.process.cssSync('**/style*.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/css/style.css'), 'utf8');
  const newFile2 = fs.readFileSync(path.join(testCwd.name, '/css/style2.css'), 'utf8');
  const newFile3 = fs.readFileSync(path.join(testCwd.name, '/css/subdirectory/style.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
  const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8');
  const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/css/subdirectory/style.css'), 'utf8');

  expect(newFile).toBe(expectedFile);
  expect(newFile2).toBe(expectedFile2);
  expect(newFile3).toBe(expectedFile3);
});

test('should process css files as arrays synchornously', () => {
  rcs.process.cssSync(['**/style.css', '**/style2.css'], {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/css/style.css'), 'utf8');
  const newFile2 = fs.readFileSync(path.join(testCwd.name, '/css/style2.css'), 'utf8');
  const newFile3 = fs.readFileSync(path.join(testCwd.name, '/css/subdirectory/style.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
  const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8');
  const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/css/subdirectory/style.css'), 'utf8');

  expect(newFile).toBe(expectedFile);
  expect(newFile2).toBe(expectedFile2);
  expect(newFile3).toBe(expectedFile3);
});
