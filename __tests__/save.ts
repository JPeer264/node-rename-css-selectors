import tmp from 'tmp';
import fs from 'fs-extra';
import path from 'path';

import save from '../lib/helper/save';

let testCwd;
const testFiles = '__tests__/files';

beforeEach(() => {
  testCwd = tmp.dirSync();
});

afterEach(() => {
  testCwd.removeCallback();
});


test('should create a file within a non existing dir', (done) => {
  const filePath = path.join(testCwd.name, '/a/non/existing/path/test.txt');

  save(filePath, 'test content', (err) => {
    expect(err).not.toBe(undefined);

    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('test content');

    done();
  });
});

test('should not overwrite the same file', async () => {
  const filePath = path.join(testFiles, '/config.json');
  const filePathTest = path.join(testCwd.name, '/config.json');
  const oldFile = fs.readFileSync(filePath, 'utf8');

  await save(filePathTest, 'test content');

  await expect(save(filePathTest, 'test content'))
    .rejects
    .toEqual(new Error('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.'));
  expect(fs.readFileSync(filePath, 'utf8')).toBe(oldFile);
});
