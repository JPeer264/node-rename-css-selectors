import fs from 'fs-extra';
import path from 'path';

import save from '../lib/helper/save';

const testCwd = '__tests__/files/testCache';

afterEach(() => {
  fs.removeSync(testCwd);
});

test('should create a file within a non existing dir', (done) => {
  const filePath = path.join(testCwd, '/a/non/existing/path/test.txt');

  save(filePath, 'test content', (err) => {
    expect(err).not.toBe(undefined);

    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('test content');

    done();
  });
});

test('should not overwrite the same file', (done) => {
  const filePath = path.join(testCwd, '/../config.json');
  const oldFile = fs.readFileSync(filePath, 'utf8');

  save(filePath, 'test content', (err) => {
    expect(err.message).toBe('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
    expect(fs.readFileSync(filePath, 'utf8')).toBe(oldFile);

    done();
  });
});
