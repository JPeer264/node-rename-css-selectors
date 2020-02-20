import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import json from 'json-extra';

import reset from './helpers/reset';
import generateMapping from '../lib/mapping/generateMapping';
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
  generateMapping(testCwd.name, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd.name, '/renaming_map.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping['.jp-block']).toBe('a');
    expect(cssMapping['.jp-block__element']).toBe('b');

    done();
  });
});

test('should create the minified mapping file', (done) => {
  generateMapping(testCwd.name, {
    cssMapping: false,
    cssMappingMin: true,
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd.name, '/renaming_map_min.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMappingMin['.a']).toBe('jp-block');
    expect(cssMappingMin['.b']).toBe('jp-block__element');

    done();
  });
});

test('should create the minified mapping file with a custom name', (done) => {
  generateMapping(testCwd.name, {
    cssMappingMin: 'custom-name',
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd.name, '/custom-name.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMappingMin['.a']).toBe('jp-block');
    expect(cssMappingMin['.b']).toBe('jp-block__element');

    done();
  });
});

test('should create the minified mapping js file', (done) => {
  generateMapping(testCwd.name, {
    json: false,
  }, (err) => {
    const cssMapping = fs.readFileSync(path.join(testCwd.name, '/renaming_map.js'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping).toMatch(new RegExp(/var CSS_NAME_MAPPING = {/));

    done();
  });
});

test('should overwrite mapping files', (done) => {
  generateMapping(testCwd.name, (err) => {
    generateMapping(testCwd.name, { overwrite: true }, (err2) => {
      expect(err).toBeFalsy();
      expect(err2).toBeFalsy();

      done();
    });
  });
});

test('should not overwrite mapping files', async () => {
  await expect(generateMapping(testCwd.name)).resolves.toBeTruthy();
  await expect(generateMapping(testCwd.name)).rejects.toBeTruthy();
});

test('should create the custom names minified mapping file', (done) => {
  generateMapping(testCwd.name, {
    cssMapping: 'custom-name',
  }, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd.name, '/custom-name.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping['.jp-block']).toBe('a');
    expect(cssMapping['.jp-block__element']).toBe('b');

    done();
  });
});
