import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import Config from '../lib/Config';

const testFiles = path.join(process.cwd(), '/__tests__/files');

beforeEach(() => {
  rcs.selectorsLibrary.getClassSelector().nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.getIdSelector().nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
  rcs.keyframesLibrary.reset();
});

it('should set the config with package.json', () => {
  // include config
  Config.getInstance().load();

  // include new settings
  rcs.selectorsLibrary.set(['.js', '.any-value']);

  expect(rcs.selectorsLibrary.get('js')).toBe('js');
  expect(rcs.selectorsLibrary.get('any-value')).toBe('a');
});

it('should set the config with .rcsrc', () => {
  const file = '.rcsrc';

  fs.writeFileSync(file, `{
            "exclude": [
                "flexbox",
                "no-js"
            ],
            "reserve": [
                "ad"
            ]
        }`, {
    encoding: 'utf8',
  });

  // include config
  Config.getInstance().load();

  // include new settings
  rcs.selectorsLibrary.set(['.flexbox', '.any-value']);

  expect(rcs.selectorsLibrary.get('flexbox')).toBe('flexbox');
  expect(rcs.selectorsLibrary.get('any-value')).toBe('a');

  fs.removeSync(file);
});

it('should set the config with package.json', () => {
  // include config
  Config.getInstance().load(path.join(testFiles, '/config.json'));

  // include new settings
  rcs.selectorsLibrary.set(['.own-file', '.any-value']);

  expect(rcs.selectorsLibrary.get('own-file')).toBe('own-file');
  expect(rcs.selectorsLibrary.get('any-value')).toBe('a');
});

it('should load ignored patterns', () => {
  const file = '.rcsrc';

  fs.writeFileSync(file, `{
            "ignore": [
                "a.js",
                "**.min.js"
            ]
        }`, {
    encoding: 'utf8',
  });

  // include config
  Config.getInstance().load();

  expect(Config.getInstance().isIgnored('a.js')).toBe(true);
  expect(Config.getInstance().isIgnored('b.min.js')).toBe(true);
  expect(Config.getInstance().isIgnored('b.js')).toBe(false);

  fs.removeSync(file);
});
