import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import reset from './helpers/reset';
import includeConfig from '../lib/config/includeConfig';

const testFiles = path.join(process.cwd(), '/test/files');

beforeEach(() => {
  reset();
});

test('should set the config with package.json', (done) => {
  // include config
  includeConfig();

  // include new settings
  rcs.selectorsLibrary.set(['.js', '.any-value']);

  expect(rcs.selectorsLibrary.get('js')).toBe('js');
  expect(rcs.selectorsLibrary.get('any-value')).toBe('a');

  done();
});

test('should set the config with .rcsrc', (done) => {
  const file = '.rcsrc';

  fs.writeFileSync(file, `{
            "exclude": [
                "flexbox",
                "no-js"
            ]
        }`, {
    encoding: 'utf8',
  });

  // include config
  includeConfig();

  // include new settings
  rcs.selectorsLibrary.set(['.flexbox', '.any-value']);

  expect(rcs.selectorsLibrary.get('flexbox')).toBe('flexbox');
  expect(rcs.selectorsLibrary.get('any-value')).toBe('a');

  fs.removeSync(file);

  done();
});

test('should set the config with config.json', (done) => {
  // include config
  includeConfig(path.join(testFiles, '/config.json'));

  // include new settings
  rcs.selectorsLibrary.set(['.own-file', '.any-value']);

  expect(rcs.selectorsLibrary.get('own-file')).toBe('own-file');
  expect(rcs.selectorsLibrary.get('any-value')).toBe('a');

  done();
});
