import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import includeConfig from '../lib/config/includeConfig';

const testFiles = path.join(process.cwd(), '/test/files');

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test.cb('should set the config with package.json', (t) => {
  // include config
  includeConfig();

  // include new settings
  rcs.selectorLibrary.set(['.js', '.any-value']);

  t.is(rcs.selectorLibrary.get('js'), 'js');
  t.is(rcs.selectorLibrary.get('any-value'), 'a');

  t.end();
});

test.cb('should set the config with .rcsrc', (t) => {
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
  rcs.selectorLibrary.set(['.flexbox', '.any-value']);

  t.is(rcs.selectorLibrary.get('flexbox'), 'flexbox');
  t.is(rcs.selectorLibrary.get('any-value'), 'a');

  fs.removeSync(file);

  t.end();
});

test.cb('should set the config with package.json', (t) => {
  // include config
  includeConfig(path.join(testFiles, '/config.json'));

  // include new settings
  rcs.selectorLibrary.set(['.own-file', '.any-value']);

  t.is(rcs.selectorLibrary.get('own-file'), 'own-file');
  t.is(rcs.selectorLibrary.get('any-value'), 'a');

  t.end();
});
