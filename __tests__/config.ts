import path from 'path';
import fs from 'fs-extra';
import rcsCore from 'rcs-core';
import rcs from '../lib';

const testFiles = path.join(process.cwd(), '/__tests__/files');

beforeEach(() => {
  rcsCore.selectorsLibrary.getClassSelector().nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.getIdSelector().nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcsCore.selectorsLibrary.reset();
  rcsCore.keyframesLibrary.reset();
});

it('should set the config with package.json', () => {
  // include config
  rcs.config.load();

  // include new settings
  rcsCore.selectorsLibrary.set(['.js', '.any-value']);

  expect(rcsCore.selectorsLibrary.get('js')).toBe('js');
  expect(rcsCore.selectorsLibrary.get('any-value')).toBe('a');
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
  rcs.config.load();

  // include new settings
  rcsCore.selectorsLibrary.set(['.flexbox', '.any-value']);

  expect(rcsCore.selectorsLibrary.get('flexbox')).toBe('flexbox');
  expect(rcsCore.selectorsLibrary.get('any-value')).toBe('a');

  fs.removeSync(file);
});

it('should set the config with package.json', () => {
  // include config
  rcs.config.load(path.join(testFiles, '/config.json'));

  // include new settings
  rcsCore.selectorsLibrary.set(['.own-file', '.any-value']);

  expect(rcsCore.selectorsLibrary.get('own-file')).toBe('own-file');
  expect(rcsCore.selectorsLibrary.get('any-value')).toBe('a');
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
  rcs.config.load();

  expect(rcs.config.isIgnored('a.js')).toBe(true);
  expect(rcs.config.isIgnored('b.min.js')).toBe(true);
  expect(rcs.config.isIgnored('b.js')).toBe(false);

  fs.removeSync(file);
});
