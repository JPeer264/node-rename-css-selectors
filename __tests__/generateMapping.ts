import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import json from 'json-extra';

import reset from './helpers/reset';
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

test('should create the normal mapping file', (done) => {
  rcs.mapping.generate(testCwd.name, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd.name, '/renaming_map.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping.selectors['.jp-block']).toBe('a');
    expect(cssMapping.selectors['.jp-block__element']).toBe('b');

    done();
  });
});

test('should create the minified mapping file', (done) => {
  rcs.mapping.generate(testCwd.name, {
    origValues: false,
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd.name, '/renaming_map_min.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMappingMin.selectors['.a']).toBe('jp-block');
    expect(cssMappingMin.selectors['.b']).toBe('jp-block__element');

    done();
  });
});

test('should create the minified mapping file with a custom name', (done) => {
  rcs.mapping.generate(testCwd.name, {
    origValues: false,
    fileName: 'custom-name',
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd.name, '/custom-name.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMappingMin.selectors['.a']).toBe('jp-block');
    expect(cssMappingMin.selectors['.b']).toBe('jp-block__element');

    done();
  });
});

test('should create the minified mapping js file', (done) => {
  rcs.mapping.generate(testCwd.name, {
    json: false,
  }, (err) => {
    const cssMapping = fs.readFileSync(path.join(testCwd.name, '/renaming_map.js'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping).toMatch(new RegExp(/var CSS_NAME_MAPPING = {/));

    done();
  });
});

test('should overwrite mapping files', (done) => {
  rcs.mapping.generate(testCwd.name, (err) => {
    rcs.mapping.generate(testCwd.name, { overwrite: true }, (err2) => {
      expect(err).toBeFalsy();
      expect(err2).toBeFalsy();

      done();
    });
  });
});

test('should not overwrite mapping files', async () => {
  await expect(rcs.mapping.generate(testCwd.name)).resolves.toBe(undefined);
  await expect(rcs.mapping.generate(testCwd.name)).rejects.toBeTruthy();
});

test('should create the custom names minified mapping file', (done) => {
  rcs.mapping.generate(testCwd.name, {
    fileName: 'custom-name',
  }, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd.name, '/custom-name.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping.selectors['.jp-block']).toBe('a');
    expect(cssMapping.selectors['.jp-block__element']).toBe('b');

    done();
  });
});
