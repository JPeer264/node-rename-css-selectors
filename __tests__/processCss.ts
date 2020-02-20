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

test('should process css files and prefix them', async () => {
  await rcs.process.css('**/style*.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
    prefix: 'prefixed-',
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/css/style.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style-prefix.css'), 'utf8');

  expect(newFile).toBe(expectedFile);
});

test('should process css files with rcs.process.css', async () => {
  await rcs.process.css('**/style*.css', {
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

test('should process css files without options', async () => {
  await rcs.process.css(path.join(fixturesCwd, 'css/**/style*.css'));

  const newFile = fs.readFileSync(path.join(process.cwd(), 'rcs', fixturesCwd, '/css/style.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');

  expect(newFile).toBe(expectedFile);

  fs.removeSync(path.join(process.cwd(), 'rcs'));
});

test('should replace the selector attributes correctly', async () => {
  await rcs.process.css('css/css-attributes.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  expect(fs.readFileSync(path.join(testCwd.name, '/css/css-attributes.css'), 'utf8'))
    .toBe(fs.readFileSync(path.join(resultsCwd, '/css/css-attributes.css'), 'utf8'));
});

test('should replace the selector attributes with pre and suffixes correctly', async () => {
  await rcs.process.css('css/css-attributes.css', {
    prefix: 'prefix-',
    suffix: '-suffix',
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  expect(fs.readFileSync(path.join(testCwd.name, '/css/css-attributes.css'), 'utf8'))
    .toBe(fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-pre-suffix.css'), 'utf8'));
});

test('should replace the selector attributes without caring about attribute selectors', async () => {
  await rcs.process.css('css/css-attributes.css', {
    prefix: 'prefix-',
    suffix: '-suffix',
    ignoreAttributeSelectors: true,
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  expect(fs.readFileSync(path.join(testCwd.name, '/css/css-attributes.css'), 'utf8'))
    .toBe(fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-ignore.css'), 'utf8'));
});

test('should process css file with css variables', async () => {
  await rcs.process.css('css/css-variables.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/css/css-variables.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/css-variables.css'), 'utf8');

  expect(newFile).toBe(expectedFile);
});
