import fs from 'fs-extra';
import path from 'path';
import json from 'json-extra';
import { minify } from 'html-minifier';

import rcs from '../lib';
import reset from './helpers/reset';

const testCwd = './__tests__/files/testCache';
const fixturesCwd = './__tests__/files/fixtures';
const resultsCwd = './__tests__/files/results';

beforeEach((done) => {
  reset();

  rcs.process.css('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    rcs.generateMapping(testCwd, () => {
      reset();

      done();
    });
  });
});

afterEach(() => {
  fs.removeSync(testCwd);
});

test('should load from an object', (done) => {
  const cssMapping = json.readToObjSync(path.join(testCwd, '/renaming_map.json'), 'utf8');

  rcs.loadMapping(cssMapping);

  rcs.process.html('**/*.html', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    expect(err).toBeFalsy();
    expect(minify(newFile, { collapseWhitespace: true }))
      .toBe(minify(expectedFile, { collapseWhitespace: true }));

    done();
  });
});

test('should load from a filestring', (done) => {
  rcs.loadMapping(path.join(testCwd, '/renaming_map.json'));

  rcs.process.html('**/*.html', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    expect(err).toBeFalsy();
    expect(minify(newFile, { collapseWhitespace: true }))
      .toBe(minify(expectedFile, { collapseWhitespace: true }));

    done();
  });
});

test('should load nothing as it does not exist', (done) => {
  rcs.loadMapping(path.join(testCwd, '/doesnotexist.json'));

  rcs.process.html('**/*.html', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    expect(err).toBeFalsy();
    expect(minify(newFile, { collapseWhitespace: true }))
      .not.toBe(minify(expectedFile, { collapseWhitespace: true }));

    done();
  });
});

test('should load from a filestring', (done) => {
  rcs.process.css('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    rcs.generateMapping(testCwd, { cssMappingMin: true }, () => {
      reset();

      rcs.loadMapping(path.join(testCwd, '/renaming_map_min.json'), { origValues: false });

      rcs.process.html('**/*.html', {
        newPath: testCwd,
        cwd: fixturesCwd,
      }, (err) => {
        const newFile = fs.readFileSync(path.join(testCwd, '/html/index.html'), 'utf8');
        const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

        expect(err).toBeFalsy();
        expect(minify(newFile, { collapseWhitespace: true }))
          .toBe(minify(expectedFile, { collapseWhitespace: true }));

        done();
      });
    });
  });
});
