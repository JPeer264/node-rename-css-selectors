import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import json from 'json-extra';

import reset from './helpers/reset';
import generateMappingSync from '../lib/mapping/generateMappingSync';
import rcs from '../lib';

let testCwd;
const fixturesCwd = path.join(process.cwd(), '/__tests__/files/fixtures');

beforeEach(async () => {
  testCwd = tmp.dirSync();

  reset();

  await rcs.process.css('**/style*.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });
});

afterEach(() => {
  testCwd.removeCallback();
});

test('should create the normal mapping file synchronously', () => {
  generateMappingSync(testCwd.name);

  const cssMapping = json.readToObjSync(path.join(testCwd.name, '/renaming_map.json'), 'utf8');

  expect(cssMapping['.jp-block']).toBe('a');
  expect(cssMapping['.jp-block__element']).toBe('b');
});

test('should create the minified mapping file synchronously', () => {
  generateMappingSync(testCwd.name, {
    cssMapping: false,
    cssMappingMin: true,
  });

  const cssMappingMin = json.readToObjSync(path.join(testCwd.name, '/renaming_map_min.json'), 'utf8');

  expect(cssMappingMin['.a']).toBe('jp-block');
  expect(cssMappingMin['.b']).toBe('jp-block__element');
});

test('should create the custom names minified mapping file synchronously', () => {
  generateMappingSync(testCwd.name, {
    cssMapping: 'custom-name',
  });

  const cssMapping = json.readToObjSync(path.join(testCwd.name, '/custom-name.json'), 'utf8');

  expect(cssMapping['.jp-block']).toBe('a');
  expect(cssMapping['.jp-block__element']).toBe('b');
});

test('should create the minified mapping file with a custom name synchronously', () => {
  generateMappingSync(testCwd.name, {
    cssMappingMin: 'custom-name',
  });

  const cssMappingMin = json.readToObjSync(path.join(testCwd.name, '/custom-name.json'), 'utf8');

  expect(cssMappingMin['.a']).toBe('jp-block');
  expect(cssMappingMin['.b']).toBe('jp-block__element');
});

test('should create the minified mapping js file synchronously', () => {
  generateMappingSync(testCwd.name, { json: false });

  const cssMapping = fs.readFileSync(path.join(testCwd.name, '/renaming_map.js'), 'utf8');

  expect(cssMapping).toMatch(new RegExp(/var CSS_NAME_MAPPING = {/));
});
