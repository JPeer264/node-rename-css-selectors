import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import config from '../lib/config/config';

const testFiles = path.join(process.cwd(), '/test/files');

test.beforeEach(() => {
  rcs.selectorsLibrary.getClassSelector().nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.getIdSelector().nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test.cb('should set the config with package.json', (t) => {
  // include config
  config.load();

  // include new settings
  rcs.selectorsLibrary.set(['.js', '.any-value']);

  t.is(rcs.selectorsLibrary.get('js'), 'js');
  t.is(rcs.selectorsLibrary.get('any-value'), 'a');

  t.end();
});

test.cb('should set the config with .rcsrc', (t) => {
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
  config.load();

  // include new settings
  rcs.selectorsLibrary.set(['.flexbox', '.any-value']);

  t.is(rcs.selectorsLibrary.get('flexbox'), 'flexbox');
  t.is(rcs.selectorsLibrary.get('any-value'), 'a');

  fs.removeSync(file);

  t.end();
});

test.cb('should set the config with package.json', (t) => {
  // include config
  config.load(path.join(testFiles, '/config.json'));

  // include new settings
  rcs.selectorsLibrary.set(['.own-file', '.any-value']);

  t.is(rcs.selectorsLibrary.get('own-file'), 'own-file');
  t.is(rcs.selectorsLibrary.get('any-value'), 'a');

  t.end();
});

test.cb('should load ignored patterns', (t) => {
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
  config.load();

  t.true(config.isIgnored("a.js"));
  t.true(config.isIgnored("b.min.js"));
  t.false(config.isIgnored("b.js"));

  fs.removeSync(file);

  t.end();
});

test.cb('should recover from bad config', (t) => {
  const file = '.rcsrc';

  fs.writeFileSync(file, '{}', {
      encoding: 'utf8',
    });

  // include config
  const prevPatternSize = config.ignorePatterns.length;
  config.load();

  t.is(config.ignorePatterns.length, prevPatternSize);
  fs.removeSync(file);

  t.end();
});
