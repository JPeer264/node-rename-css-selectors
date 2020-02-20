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

beforeEach((done) => {
  testCwd = tmp.dirSync();

  reset();

  rcs.process.css('**/style*.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, () => {
    rcs.generateMapping(testCwd.name, () => {
      reset();

      done();
    });
  });
});

afterEach(() => {
  testCwd.removeCallback();
});

test('should load from an object', (done) => {
  const cssMapping = json.readToObjSync(path.join(testCwd.name, '/renaming_map.json'), 'utf8');

  rcs.loadMapping(cssMapping);

  rcs.process.html('**/*.html', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd.name, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    expect(err).toBeFalsy();
    expect(minify(newFile, { collapseWhitespace: true }))
      .toBe(minify(expectedFile, { collapseWhitespace: true }));

    done();
  });
});

test('should load from a filestring', (done) => {
  rcs.loadMapping(path.join(testCwd.name, '/renaming_map.json'));

  rcs.process.html('**/*.html', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd.name, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    expect(err).toBeFalsy();
    expect(minify(newFile, { collapseWhitespace: true }))
      .toBe(minify(expectedFile, { collapseWhitespace: true }));

    done();
  });
});

test('should load nothing as it does not exist', (done) => {
  rcs.loadMapping(path.join(testCwd.name, '/doesnotexist.json'));

  rcs.process.html('**/*.html', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd.name, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    expect(err).toBeFalsy();
    expect(minify(newFile, { collapseWhitespace: true }))
      .not.toBe(minify(expectedFile, { collapseWhitespace: true }));

    done();
  });
});

test('should load from a filestring', (done) => {
  rcs.process.css('**/style*.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, () => {
    rcs.generateMapping(testCwd.name, { cssMappingMin: true }, () => {
      reset();

      rcs.loadMapping(path.join(testCwd.name, '/renaming_map_min.json'), { origValues: false });

      rcs.process.html('**/*.html', {
        newPath: testCwd.name,
        cwd: fixturesCwd,
      }, (err) => {
        const newFile = fs.readFileSync(path.join(testCwd.name, '/html/index.html'), 'utf8');
        const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

        expect(err).toBeFalsy();
        expect(minify(newFile, { collapseWhitespace: true }))
          .toBe(minify(expectedFile, { collapseWhitespace: true }));

        done();
      });
    });
  });
});
