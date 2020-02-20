import tmp from 'tmp';
import fs from 'fs-extra';
import path from 'path';

import saveSync from '../lib/helper/saveSync';

let testCwd;
const testFiles = '__tests__/files';

beforeEach(() => {
  testCwd = tmp.dirSync();
});

afterEach(() => {
  testCwd.removeCallback();
});


test('saveSync | should save', () => {
  const filePath = path.join(testCwd.name, '/config.txt');

  saveSync(filePath, 'test content');

  expect(fs.readFileSync(filePath, 'utf8')).toBe('test content');
});

test('saveSync | should not overwrite the same file', () => {
  const filePath = path.join(testFiles, '/config.json');
  const filePathTest = path.join(testCwd.name, '/config.json');
  const oldFile = fs.readFileSync(filePath, 'utf8');
  let failed = false;

  saveSync(filePathTest, 'test content');

  try {
    saveSync(filePathTest, 'test content');

    // if no error is thrown before it should fail here
    failed = true;
  } catch (e) {
    expect(e.message).toBe('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
  }

  expect(failed).toBe(false);
  expect(fs.readFileSync(filePath, 'utf8')).toBe(oldFile);
});
