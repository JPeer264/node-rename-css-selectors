import path from 'path';
import fs from 'fs-extra';
import json from 'json-extra';

import reset from './helpers/reset';
import generateMapping from '../lib/mapping/generateMapping';
import rcs from '../lib';

const testCwd = path.join(process.cwd(), '/__tests__/files/testCache');
const fixturesCwd = path.join(process.cwd(), '/__tests__/files/fixtures');

beforeEach((done) => {
  fs.removeSync(testCwd);
  reset();

  rcs.process.css('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    done();
  });
});

test('should create the normal mapping file', (done) => {
  generateMapping(testCwd, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd, '/renaming_map.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping['.jp-block']).toBe('a');
    expect(cssMapping['.jp-block__element']).toBe('b');

    done();
  });
});

test('should create the minified mapping file', (done) => {
  generateMapping(testCwd, {
    cssMapping: false,
    cssMappingMin: true,
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd, '/renaming_map_min.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMappingMin['.a']).toBe('jp-block');
    expect(cssMappingMin['.b']).toBe('jp-block__element');

    done();
  });
});

test('should create the extended normal mapping file', (done) => {
  generateMapping(testCwd, {
    extended: true,
  }, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd, '/renaming_map.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping['.jp-block'].type).toBeTruthy();
    expect(cssMapping['.jp-block'].typeChar).toBeTruthy();
    expect(cssMapping['.jp-block'].type).toBe('class');

    done();
  });
});

test('should create the minified mapping file', (done) => {
  generateMapping(testCwd, {
    cssMapping: false,
    cssMappingMin: true,
    extended: true,
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd, '/renaming_map_min.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMappingMin['.a'].typeChar).toBeTruthy();
    expect(cssMappingMin['.a'].type).toBe('class');

    done();
  });
});

test('should create the minified mapping file with a custom name', (done) => {
  generateMapping(testCwd, {
    cssMappingMin: 'custom-name',
  }, (err) => {
    const cssMappingMin = json.readToObjSync(path.join(testCwd, '/custom-name.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMappingMin['.a']).toBe('jp-block');
    expect(cssMappingMin['.b']).toBe('jp-block__element');

    done();
  });
});

test('should create the minified mapping js file', (done) => {
  generateMapping(testCwd, {
    json: false,
  }, (err) => {
    const cssMapping = fs.readFileSync(path.join(testCwd, '/renaming_map.js'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping).toMatch(new RegExp(/var CSS_NAME_MAPPING = {/));

    done();
  });
});

test('should overwrite mapping files', (done) => {
  generateMapping(testCwd, (err) => {
    generateMapping(testCwd, { overwrite: true }, (err2) => {
      expect(err).toBeFalsy();
      expect(err2).toBeFalsy();

      done();
    });
  });
});

test('should not overwrite mapping files', (done) => {
  generateMapping(testCwd, (err) => {
    generateMapping(testCwd, (err2) => {
      expect(err).toBeFalsy();
      expect(err2).toBeTruthy();

      done();
    });
  });
});

test('should create the custom names minified mapping file', (done) => {
  generateMapping(testCwd, {
    cssMapping: 'custom-name',
  }, (err) => {
    const cssMapping = json.readToObjSync(path.join(testCwd, '/custom-name.json'), 'utf8');

    expect(err).toBeFalsy();
    expect(cssMapping['.jp-block']).toBe('a');
    expect(cssMapping['.jp-block__element']).toBe('b');

    done();
  });
});
