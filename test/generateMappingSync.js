import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import json from 'json-extra';

import reset from './helpers/reset';
import generateMappingSync from '../lib/mapping/generateMappingSync';
import rcs from '../lib';

const testCwd = path.join(process.cwd(), '/test/files/testCache');
const fixturesCwd = path.join(process.cwd(), '/test/files/fixtures');

test.beforeEach.cb((t) => {
  reset();

  rcs.process.css('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    t.end();
  });
});

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test('should create the normal mapping file synchronously', (t) => {
  generateMappingSync(testCwd);

  const cssMapping = json.readToObjSync(path.join(testCwd, '/renaming_map.json'), 'utf8');

  t.is(cssMapping['.jp-block'], 'a');
  t.is(cssMapping['.jp-block__element'], 'b');
});

test('should create the minified mapping file synchronously', (t) => {
  generateMappingSync(testCwd, {
    cssMapping: false,
    cssMappingMin: true,
  });

  const cssMappingMin = json.readToObjSync(path.join(testCwd, '/renaming_map_min.json'), 'utf8');

  t.is(cssMappingMin['.a'], 'jp-block');
  t.is(cssMappingMin['.b'], 'jp-block__element');
});

test('should create the custom names minified mapping file synchronously', (t) => {
  generateMappingSync(testCwd, {
    cssMapping: 'custom-name',
  });

  const cssMapping = json.readToObjSync(path.join(testCwd, '/custom-name.json'), 'utf8');

  t.is(cssMapping['.jp-block'], 'a');
  t.is(cssMapping['.jp-block__element'], 'b');
});

test('should create the minified mapping file with a custom name synchronously', (t) => {
  generateMappingSync(testCwd, {
    cssMappingMin: 'custom-name',
  });

  const cssMappingMin = json.readToObjSync(path.join(testCwd, '/custom-name.json'), 'utf8');

  t.is(cssMappingMin['.a'], 'jp-block');
  t.is(cssMappingMin['.b'], 'jp-block__element');
});

test('should create the minified mapping js file synchronously', (t) => {
  generateMappingSync(testCwd, { json: false });

  const cssMapping = fs.readFileSync(path.join(testCwd, '/renaming_map.js'), 'utf8');

  t.regex(cssMapping, /var CSS_NAME_MAPPING = {/);
});
