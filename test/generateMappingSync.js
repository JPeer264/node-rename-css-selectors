import test from 'ava';
import path from 'path';
import rcsCore from 'rcs-core';
import fs from 'fs-extra';
import json from 'json-extra';

import generateMappingSync from '../lib/mapping/generateMappingSync';
import rcs from '../';

const testCwd = path.join(process.cwd(), '/test/files/testCache');
const fixturesCwd = path.join(process.cwd(), '/test/files/fixtures');

test.beforeEach.cb((t) => {
  rcsCore.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.keyframesLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.reset();
  rcsCore.keyframesLibrary.reset();

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

  t.is(cssMapping.class['.jp-block'], 'a');
  t.is(cssMapping.class['.jp-block__element'], 'b');
});

test('should create the minified mapping file synchronously', (t) => {
  generateMappingSync(testCwd, {
    cssMapping: false,
    cssMappingMin: true,
  });

  const cssMappingMin = json.readToObjSync(path.join(testCwd, '/renaming_map_min.json'), 'utf8');

  t.is(cssMappingMin.class['.a'], 'jp-block');
  t.is(cssMappingMin.class['.b'], 'jp-block__element');
});

test('should create the custom names minified mapping file synchronously', (t) => {
  generateMappingSync(testCwd, {
    cssMapping: 'custom-name',
  });

  const cssMapping = json.readToObjSync(path.join(testCwd, '/custom-name.json'), 'utf8');

  t.is(cssMapping.class['.jp-block'], 'a');
  t.is(cssMapping.class['.jp-block__element'], 'b');
});

test('should create the minified mapping file with a custom name synchronously', (t) => {
  generateMappingSync(testCwd, {
    cssMappingMin: 'custom-name',
  });

  const cssMappingMin = json.readToObjSync(path.join(testCwd, '/custom-name.json'), 'utf8');

  t.is(cssMappingMin.class['.a'], 'jp-block');
  t.is(cssMappingMin.class['.b'], 'jp-block__element');
});

test('should create the minified mapping js file synchronously', (t) => {
  generateMappingSync(testCwd, { json: false });

  const cssMapping = fs.readFileSync(path.join(testCwd, '/renaming_map.js'), 'utf8');

  t.regex(cssMapping, /var CSS_NAME_MAPPING = {/);
});
