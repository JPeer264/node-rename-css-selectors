import test from 'ava';
import fs from 'fs-extra';
import path from 'path';

import saveSync from '../lib/helper/saveSync';

const testCwd = 'test/files/testCache';

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test('saveSync | should save', (t) => {
  const filePath = path.join(testCwd, '/config.txt');

  saveSync(filePath, 'test content');

  t.is(fs.readFileSync(filePath, 'utf8'), 'test content');
});

test('saveSync | should not overwrite the same file', (t) => {
  const filePath = path.join(testCwd, '/../config.json');
  const oldFile = fs.readFileSync(filePath, 'utf8');
  let failed = false;

  try {
    saveSync(filePath, 'test content');

    // if no error is thrown before it should fail here
    failed = true;
  } catch (e) {
    t.is(e.message, 'File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
  }

  t.is(failed, false);
  t.is(fs.readFileSync(filePath, 'utf8'), oldFile);
});
