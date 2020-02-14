import fs from 'fs-extra';
import path from 'path';

import saveSync from '../lib/helper/saveSync';

const testCwd = '__tests__/files/testCache';

afterEach(() => {
  fs.removeSync(testCwd);
});

test('saveSync | should save', () => {
  const filePath = path.join(testCwd, '/config.txt');

  saveSync(filePath, 'test content');

  expect(fs.readFileSync(filePath, 'utf8')).toBe('test content');
});

test('saveSync | should not overwrite the same file', () => {
  const filePath = path.join(testCwd, '/../config.json');
  const oldFile = fs.readFileSync(filePath, 'utf8');
  let failed = false;

  try {
    saveSync(filePath, 'test content');

    // if no error is thrown before it should fail here
    failed = true;
  } catch (e) {
    expect(e.message).toBe('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
  }

  expect(failed).toBe(false);
  expect(fs.readFileSync(filePath, 'utf8')).toBe(oldFile);
});
