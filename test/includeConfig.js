import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import reset from './helpers/reset';
import includeConfig from '../lib/config/includeConfig';

const testFiles = path.join(process.cwd(), '/test/files');

test.beforeEach(() => {
  reset();
});

test.cb('should set the config with package.json', (t) => {
  // include config
  includeConfig();

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
            ]
        }`, {
    encoding: 'utf8',
  });

  // include config
  includeConfig();

  // include new settings
  rcs.selectorsLibrary.set(['.flexbox', '.any-value']);

  t.is(rcs.selectorsLibrary.get('flexbox'), 'flexbox');
  t.is(rcs.selectorsLibrary.get('any-value'), 'a');

  fs.removeSync(file);

  t.end();
});

test.cb('should set the config with package.json', (t) => {
  // include config
  includeConfig(path.join(testFiles, '/config.json'));

  // include new settings
  rcs.selectorsLibrary.set(['.own-file', '.any-value']);

  t.is(rcs.selectorsLibrary.get('own-file'), 'own-file');
  t.is(rcs.selectorsLibrary.get('any-value'), 'a');

  t.end();
});
