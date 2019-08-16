import test from 'ava';
import path from 'path';
import fs from 'fs-extra';
import rcs from 'rcs-core';

import config from '../lib/config/config';

const testFiles = path.join(process.cwd(), '/test/files');

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorLibrary.reset();
  rcs.keyframesLibrary.reset();
});

test.cb('should set the config with package.json', (t) => {
  // include config
  config.load();

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
  config.load();

  // include new settings
  rcs.selectorLibrary.set(['.flexbox', '.any-value']);

  t.is(rcs.selectorLibrary.get('flexbox'), 'flexbox');
  t.is(rcs.selectorLibrary.get('any-value'), 'a');

  fs.removeSync(file);

  t.end();
});

test.cb('should set the config with package.json', (t) => {
  // include config
  config.load(path.join(testFiles, '/config.json'));

  // include new settings
  rcs.selectorLibrary.set(['.own-file', '.any-value']);

  t.is(rcs.selectorLibrary.get('own-file'), 'own-file');
  t.is(rcs.selectorLibrary.get('any-value'), 'a');

  t.end();
});

test.cb('should load ignored patterns', (t) => {
  const file = '.rcsrc';

  fs.writeFileSync(file, `{
            "ignore": [
                "a.js",
                "./b.css",
                "/path/to/whatever/c.html",
                "/d/", // regex
            ]
        }`, {
      encoding: 'utf8',
    });

  // include config
  config.load();

  t.true(config.isIgnored("a.js"));
  t.true(config.isIgnored("./b.css"));
  t.true(config.isIgnored("d.whatever"));

  fs.removeSync(file);

  t.end();
});
