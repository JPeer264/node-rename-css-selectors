import test from 'ava';
import fs from 'fs-extra';
import path from 'path';

import save from '../lib/helper/save';

const testCwd = 'test/files/testCache';

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test.cb('should create a file within a non existing dir', (t) => {
  const filePath = path.join(testCwd, '/a/non/existing/path/test.txt');

  save(filePath, 'test content', (err) => {
    t.not(err, undefined);

    t.true(fs.existsSync(filePath));
    t.is(fs.readFileSync(filePath, 'utf8'), 'test content');

    t.end();
  });
});

test.cb('should not overwrite the same file', (t) => {
  const filePath = path.join(testCwd, '/../config.json');
  const oldFile = fs.readFileSync(filePath, 'utf8');

  save(filePath, 'test content', (err) => {
    t.is(err.message, 'File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
    t.is(fs.readFileSync(filePath, 'utf8'), oldFile);

    t.end();
  });
});
