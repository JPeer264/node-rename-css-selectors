import tmp from 'tmp';
import fs from 'fs-extra';
import path from 'path';
import json from 'json-extra';
import { minify } from 'html-minifier';

import rcs from '../lib';
import reset from './helpers/reset';

let testCwd;
const fixturesCwd = './__tests__/files/fixtures';
const resultsCwd = './__tests__/files/results';

beforeEach(async () => {
  testCwd = tmp.dirSync();

  reset();

  await rcs.process.css('**/style*.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });
  await rcs.mapping.generate(testCwd.name);

  reset();
});

afterEach(() => {
  testCwd.removeCallback();
});

test('should load from an object', async () => {
  const cssMapping = json.readToObjSync(path.join(testCwd.name, '/renaming_map.json'), 'utf8');

  rcs.mapping.load(cssMapping);

  await rcs.process.html('**/*.html', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/html/index.html'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

  expect(minify(newFile, { collapseWhitespace: true }))
    .toBe(minify(expectedFile, { collapseWhitespace: true }));
});

test('should load from a filestring', async () => {
  await rcs.mapping.load(path.join(testCwd.name, '/renaming_map.json'));

  await rcs.process.html('**/*.html', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/html/index.html'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

  expect(minify(newFile, { collapseWhitespace: true }))
    .toBe(minify(expectedFile, { collapseWhitespace: true }));
});

test('should load nothing as it does not exist', async () => {
  await rcs.mapping.load(path.join(testCwd.name, '/doesnotexist.json'));

  await rcs.process.html('**/*.html', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/html/index.html'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

  expect(minify(newFile, { collapseWhitespace: true }))
    .not.toBe(minify(expectedFile, { collapseWhitespace: true }));
});

test('should load from a filestring', async () => {
  await rcs.process.css('**/style*.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  await rcs.mapping.generate(testCwd.name, { origValues: false });

  reset();

  await rcs.mapping.load(path.join(testCwd.name, '/renaming_map_min.json'), { origValues: false });

  await rcs.process.html('**/*.html', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/html/index.html'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

  expect(minify(newFile, { collapseWhitespace: true }))
    .toBe(minify(expectedFile, { collapseWhitespace: true }));
});
