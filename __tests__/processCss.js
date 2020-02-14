import path from 'path';
import fs from 'fs-extra';

import rcs from '../lib';
import reset from './helpers/reset';

const testCwd = '__tests__/files/testCache';
const fixturesCwd = '__tests__/files/fixtures';
const resultsCwd = '__tests__/files/results';

beforeEach(() => {
  reset();
});

afterEach(() => fs.removeSync(testCwd));

test('should process css files and prefix them', (done) => {
  rcs.process.css('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
    prefix: 'prefixed-',
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style-prefix.css'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);

    done();
  });
});

test('should process css files with rcs.process.css', (done) => {
  rcs.process.css('**/style*.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/css/style.css'), 'utf8');
    const newFile2 = fs.readFileSync(path.join(testCwd, '/css/style2.css'), 'utf8');
    const newFile3 = fs.readFileSync(path.join(testCwd, '/css/subdirectory/style.css'), 'utf8');
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

test('should process css files without options', (done) => {
  rcs.process.css(path.join(fixturesCwd, 'css/**/style*.css'), (err) => {
    const newFile = fs.readFileSync(path.join(process.cwd(), 'rcs', fixturesCwd, '/css/style.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/style.css'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);

    fs.removeSync(path.join(process.cwd(), 'rcs'));

    done();
  });
});

test('should replace the selector attributes correctly', (done) => {
  rcs.process.css('css/css-attributes.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    expect(fs.readFileSync(path.join(testCwd, '/css/css-attributes.css'), 'utf8'))
      .toBe(fs.readFileSync(path.join(resultsCwd, '/css/css-attributes.css'), 'utf8'));

    done();
  });
});

test('should replace the selector attributes with pre and suffixes correctly', (done) => {
  rcs.process.css('css/css-attributes.css', {
    prefix: 'prefix-',
    suffix: '-suffix',
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    expect(fs.readFileSync(path.join(testCwd, '/css/css-attributes.css'), 'utf8'))
      .toBe(fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-pre-suffix.css'), 'utf8'));

    done();
  });
});

test('should replace the selector attributes without caring about attribute selectors', (done) => {
  rcs.process.css('css/css-attributes.css', {
    prefix: 'prefix-',
    suffix: '-suffix',
    ignoreAttributeSelectors: true,
    newPath: testCwd,
    cwd: fixturesCwd,
  }, () => {
    expect(fs.readFileSync(path.join(testCwd, '/css/css-attributes.css'), 'utf8'))
      .toBe(fs.readFileSync(path.join(resultsCwd, '/css/css-attributes-ignore.css'), 'utf8'));

    done();
  });
});

test('should process css file with css variables', (done) => {
  rcs.process.css('css/css-variables.css', {
    newPath: testCwd,
    cwd: fixturesCwd,
  }, (err) => {
    const newFile = fs.readFileSync(path.join(testCwd, '/css/css-variables.css'), 'utf8');
    const expectedFile = fs.readFileSync(path.join(resultsCwd, '/css/css-variables.css'), 'utf8');

    expect(err).toBeFalsy();
    expect(newFile).toBe(expectedFile);

    done();
  });
});
