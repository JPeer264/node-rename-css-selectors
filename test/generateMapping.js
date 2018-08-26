import test from 'ava';
import path from 'path';
import rcsCore from 'rcs-core';
import fs from 'fs-extra';
import json from 'json-extra';

import generateMapping from '../lib/mapping/generateMapping';
import rcs from '../';

const testCwd = path.join(process.cwd(), '/test/files/testCache');
const fixturesCwd = path.join(process.cwd(), '/test/files/fixtures');

test.beforeEach.cb((t) => {
  fs.removeSync(testCwd);
  rcsCore.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.nameGenerator.reset();
  rcsCore.selectorLibrary.reset();
  rcsCore.keyframesLibrary.reset();

  rcs.process.css('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    t.end();
  });
});

test.cb('should create the normal mapping file', (t) => {
  generateMapping(testCwd, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd, '/renaming_map.json'), 'utf8');

    t.falsy(err);
    t.is(cssMapping['.jp-block'], 'a');
    t.is(cssMapping['.jp-block__element'], 'b');

    t.end();
  });
});

test.cb('should create the minified mapping file', (t) => {
  generateMapping(testCwd, {
    cssMapping: false,
    cssMappingMin: true,
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd, '/renaming_map_min.json'), 'utf8');

    t.falsy(err);
    t.is(cssMappingMin['.a'], 'jp-block');
    t.is(cssMappingMin['.b'], 'jp-block__element');

    t.end();
  });
});

test.cb('should create the extended normal mapping file', (t) => {
  generateMapping(testCwd, {
    extended: true,
  }, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd, '/renaming_map.json'), 'utf8');

    t.falsy(err);
    t.truthy(cssMapping['.jp-block'].type);
    t.truthy(cssMapping['.jp-block'].typeChar);
    t.is(cssMapping['.jp-block'].type, 'class');

    t.end();
  });
});

test.cb('should create the minified mapping file', (t) => {
  generateMapping(testCwd, {
    cssMapping: false,
    cssMappingMin: true,
    extended: true,
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd, '/renaming_map_min.json'), 'utf8');

    t.falsy(err);
    t.truthy(cssMappingMin['.a'].typeChar);
    t.is(cssMappingMin['.a'].type, 'class');

    t.end();
  });
});

test.cb('should create the minified mapping file with a custom name', (t) => {
  generateMapping(testCwd, {
    cssMappingMin: 'custom-name',
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd, '/custom-name.json'), 'utf8');

    t.falsy(err);
    t.is(cssMappingMin['.a'], 'jp-block');
    t.is(cssMappingMin['.b'], 'jp-block__element');

    t.end();
  });
});

test.cb('should create the minified mapping js file', (t) => {
  generateMapping(testCwd, {
    json: false,
  }, (err) => {
    const cssMapping = fs.readFileSync(path.join(testCwd, '/renaming_map.js'), 'utf8');

    t.falsy(err);
    t.regex(cssMapping, /var CSS_NAME_MAPPING = {/);

    t.end();
  });
});

test.cb('should overwrite mapping files', (t) => {
  generateMapping(testCwd, (err) => {
    generateMapping(testCwd, { overwrite: true }, (err2) => {
      t.falsy(err);
      t.falsy(err2);

      t.end();
    });
  });
});

test.cb('should not overwrite mapping files', (t) => {
  generateMapping(testCwd, (err) => {
    generateMapping(testCwd, (err2) => {
      t.falsy(err);
      t.truthy(err2);

      t.end();
    });
  });
});

test.cb('should create the custom names minified mapping file', (t) => {
  generateMapping(testCwd, {
    cssMapping: 'custom-name',
  }, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd, '/custom-name.json'), 'utf8');

    t.falsy(err);
    t.is(cssMapping['.jp-block'], 'a');
    t.is(cssMapping['.jp-block__element'], 'b');

    t.end();
  });
});
