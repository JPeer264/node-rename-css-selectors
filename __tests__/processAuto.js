import tmp from 'tmp';
import path from 'path';
import fs from 'fs-extra';
import { minify } from 'html-minifier';

import rcs from '../lib';
import reset from './helpers/reset';

const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

let testCwd;

beforeEach(() => {
  testCwd = tmp.dirSync();

  reset();
});

afterEach(() => {
  testCwd.removeCallback();
});

test('should process css files', async () => {
  await rcs.process.auto('**/style*.css', {
    collectSelectors: true,
    newPath: testCwd.name,
    cwd: fixturesCwd,
  });

  const newFile = fs.readFileSync(path.join(testCwd.name, '/css/style.css'), 'utf8');
  const newFile2 = fs.readFileSync(path.join(testCwd.name, '/css/style2.css'), 'utf8');
  const newFile3 = fs.readFileSync(path.join(testCwd.name, '/css/subdirectory/style.css'), 'utf8');
  const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
  const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8');
  const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/css/subdirectory/style.css'), 'utf8');

  expect(newFile).toBe(expectedFile);
  expect(newFile2).toBe(expectedFile2);
  expect(newFile3).toBe(expectedFile3);
});

test('processing | should process all files automatically', (done) => {
  rcs.process.auto(['**/*.{js,html}', 'css/style.css'], {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd.name, '/js/main.js'), 'utf8');
    const newFile2 = fs.readFileSync(path.join(testCwd.name, '/css/style.css'), 'utf8');
    const newFile3 = fs.readFileSync(path.join(testCwd.name, '/html/index.html'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/js/main.js'), 'utf8');
    const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
    const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);
    expect(newFile2).toBe(expectedFile2);
    expect(minify(newFile3, { collapseWhitespace: true }))
      .toBe(minify(expectedFile3, { collapseWhitespace: true }));

    done();
  });
});

test('should process css files as arrays', (done) => {
  rcs.process.auto(['**/style.css', '**/style2.css'], {
    collectSelectors: true,
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd.name, '/css/style.css'), 'utf8');
    const newFile2 = fs.readFileSync(path.join(testCwd.name, '/css/style2.css'), 'utf8');
    const newFile3 = fs.readFileSync(path.join(testCwd.name, '/css/subdirectory/style.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');
    const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style2.css'), 'utf8');
    const expectedFile3 = fs.readFileSync(path.join(resultsCwd, '/css/subdirectory/style.css'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);
    expect(newFile2).toBe(expectedFile2);
    expect(newFile3).toBe(expectedFile3);

    done();
  });
});

test('should not overwrite original files', (done) => {
  rcs.process.auto(['**/style.css', '**/style2.css'], {
    collectSelectors: true,
    newPath: fixturesCwd,
    cwd: fixturesCwd,
  }, (err) => {
    expect(err.message)
      .toBe('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');

    done();
  });
});

test('should fail', (done) => {
  rcs.process.auto('path/**/with/nothing/in/it', (err) => {
    expect(err).toBeTruthy();
    expect(err.message).toBe('No files found');

    done();
  });
});

test('should process auto file with css variables', (done) => {
  rcs.process.auto('css/css-variables.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd.name, '/css/css-variables.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/css-variables.css'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);

    done();
  });
});

test('should not process auto file with css variables', (done) => {
  rcs.process.auto('css/css-variables.css', {
    newPath: testCwd.name,
    cwd: fixturesCwd,
    ignoreCssVariables: true,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd.name, '/css/css-variables.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/css-variables-ignore.css'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);

    done();
  });
});

test('should fillLibraries from html and css | issue #38', (done) => {
  rcs.process.auto(['**/*.{js,html}', 'css/style.css'], {
    newPath: testCwd.name,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd.name, '/html/index-with-style.html'), 'utf8');
    const newFile2 = fs.readFileSync(path.join(testCwd.name, '/css/style.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/html/index-with-style.html'), 'utf8');
    const expectedFile2 = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');

    expect(err).toBeFalsy();
    expect(minify(newFile, { collapseWhitespace: true }))
      .toBe(minify(expectedFile, { collapseWhitespace: true }));
    expect(minify(newFile2, { collapseWhitespace: true }))
      .toBe(minify(expectedFile2, { collapseWhitespace: true }));

    done();
  });
});
